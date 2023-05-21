import { createContext, useContext, useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { canisterId as IICanisterID } from '../../../declarations/internet_identity';
import {
  canisterId as HomeworkDiaryCanisterID,
  createActor,
  idlFactory,
} from '../../../declarations/HomeworkDiary_backend';

type Authentication = {
  principal: Principal | undefined;
  actor: Actor | undefined;
};

type AuthenticationState = {
  authentication: Authentication | undefined;
  authenticate?: () => Promise<void>;
};

const initialize: AuthenticationState = {
  authentication: undefined,
  authenticate: undefined,
};

export const AuthClientContext = createContext(initialize);

export const useAuthenticationContext = (): AuthenticationState =>
  useContext(AuthClientContext);

export const useAuthenticationProvider = () => {
  const [authentication, setAuthentication] = useState<
    Authentication | undefined
  >(initialize.authentication);

  useEffect(() => {
    (async () => {
      const authClient = await AuthClient.create();
      if (await authClient.isAuthenticated()) {
        handleAuthenticated(authClient);
      }
    })();
  }, []);

  const handleAuthenticated = async (authClient: AuthClient) => {
    const identity = authClient.getIdentity();

    // ICと対話するためのエージェントを作成します。
    const agent = new HttpAgent({ identity });
    // 開発環境の`agent`はICの公開鍵を持っていないため、`fetchRootKey()`で鍵を取得します。
    if (process.env.NODE_ENV === 'development') {
      agent.fetchRootKey();
    }

    const homeworkDiaryActor = Actor.createActor(idlFactory, {
      agent,
      canisterId: HomeworkDiaryCanisterID,
    });

    setAuthentication({
      principal: identity.getPrincipal(),
      actor: homeworkDiaryActor,
    });
  };

  const authenticate = async () => {
    // アプリケーションが接続しているネットワークに応じて、
    // ユーザー認証に使用するInternet IdentityのURLを決定する
    let iiUrl: string;
    if (process.env.DFX_NETWORK === 'local') {
      iiUrl = `http://localhost:4943/?canisterId=${IICanisterID}`;
    } else if (process.env.DFX_NETWORK === 'ic') {
      // iiUrl = `https://${IICanisterID}.ic0.app`;
      iiUrl = 'https://identity.ic0.app/#authorize';
    } else {
      iiUrl = `https://${IICanisterID}.dfinity.network`;
    }

    const authClient = await AuthClient.create();
    authClient.login({
      identityProvider: iiUrl,
      onSuccess: async () => {
        handleAuthenticated(authClient);
      },
      onError: (err) => {
        console.error(err);
      },
    });
  };

  return { authentication, authenticate };
};
