import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react';
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react';

export default function Welcome() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bg="gray.50"
      p={4}
    >
      <Heading as="h1" size="xl" mb={4}>
        Welcome to Your App
      </Heading>
      <Text fontSize="lg" mb={8}>
        A brief description or tagline for your application.
      </Text>

      <Stack direction="row" spacing={4}>
        <SignedOut>
          <SignInButton mode="modal">
            <Button colorScheme="teal" size="lg">
              Sign In
            </Button>
          </SignInButton>

          <SignUpButton mode="modal">
            <Button variant="outline" size="lg">
              Get Started
            </Button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <Button colorScheme="teal" size="lg" onClick={() => window.location.href = "/dashboard"}>
            Go to Dashboard
          </Button>
        </SignedIn>
      </Stack>
    </Box>
  );
}
