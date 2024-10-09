// src/components/Layout/Sidebar.tsx

import React from 'react';
import { Box, VStack, Button } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUser, FiSettings } from 'react-icons/fi';

const Sidebar = () => {
  return (
    <Box bg="gray.100" w="200px" p={4} minH="100vh">
      <VStack spacing={4} align="stretch">
        <Button as={NavLink} to="/" leftIcon={<FiHome />} variant="ghost">
          Dashboard
        </Button>
        <Button as={NavLink} to="/profile" leftIcon={<FiUser />} variant="ghost">
          Profile
        </Button>
        <Button as={NavLink} to="/settings" leftIcon={<FiSettings />} variant="ghost">
          Settings
        </Button>
        {/* Add more navigation buttons as needed */}
      </VStack>
    </Box>
  );
};

export default Sidebar;
