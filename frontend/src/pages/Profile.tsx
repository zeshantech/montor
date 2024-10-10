import { Box, Heading, Text, VStack, Button } from '@chakra-ui/react';
import useFetchProfile from '../hooks/useFetchProfile';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { data, isLoading, isError } = useFetchProfile();
  const { logout } = useAuth();

  if (isLoading) {
    return <Box p={4}>Loading...</Box>;
  }

  if (isError) {
    return <Box p={4}>Failed to load profile.</Box>;
  }

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <VStack spacing={4} align="start">
        <Heading size="md">Profile</Heading>
        <Text><strong>Name:</strong> {data.name}</Text>
        <Text><strong>Email:</strong> {data.email}</Text>
        {/* Display additional user information as needed */}
        <Button colorScheme="red" onClick={logout}>
          Logout
        </Button>
      </VStack>
    </Box>
  );
};

export default Profile;
