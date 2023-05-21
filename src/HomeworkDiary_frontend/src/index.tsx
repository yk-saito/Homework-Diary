import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';

import {
  AuthClientContext,
  useAuthenticationProvider,
} from './hooks/authenticationContext';

const container = document.getElementById('app');
if (!container) {
  throw new Error('No container found');
}
const root = createRoot(container);

const AuthProvider = ({ children }) => {
  const auth = useAuthenticationProvider();
  return (
    <AuthClientContext.Provider value={auth}>
      {children}
    </AuthClientContext.Provider>
  );
};

root.render(
  <ChakraProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ChakraProvider>,
);
