// src/components/Layout/Header.tsx

import React from 'react';
import { Box, Flex, Heading, Spacer, Button } from '@chakra-ui/react';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <Box bg="teal.500" px={4} py={2} color="white">
      <Flex alignItems="center">
        <Heading size="md">DevOps Dashboard</Heading>
        <Spacer />
        {isAuthenticated && (
          <Button colorScheme="teal" variant="outline" onClick={logout}>
            Logout
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default Header;
