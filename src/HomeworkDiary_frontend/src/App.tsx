import {
  Heading,
  VStack,
  IconButton,
  Button,
  ButtonGroup,
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
} from '@chakra-ui/react'; // TODO: test
import { FiSearch } from 'react-icons/fi';

import { useAuthenticationContext } from './hooks/authenticationContext';

function App() {
  const { authentication, authenticate } = useAuthenticationContext();

  const handleInternetIdentity = async () => {
    console.log('handleInternetIdentity');
    await authenticate();
  };

  const handleSearch = async () => {
    console.log('handleSearch');
  };

  return (
    <VStack p={4} minH='100vh' pb={28}>
      <ButtonGroup variant='outline' spacing='6' alignSelf='flex-end'>
        <IconButton
          icon={<FiSearch />}
          alignSelf='flex-end'
          aria-label='Search task'
          size='lg'
          onClick={handleSearch}
        />
        {authentication?.principal ? (
          <Button>{authentication.principal.toString()} </Button>
        ) : (
          <Button
            size='lg'
            alignSelf='flex-end'
            onClick={handleInternetIdentity}
          >
            Internet Identity
          </Button>
        )}
      </ButtonGroup>
      <Heading p='5' size='xl'>
        Homework
      </Heading>
    </VStack>
  );
}

export default App;
