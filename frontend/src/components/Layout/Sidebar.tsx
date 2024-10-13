import { Box, VStack, Button } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUser, FiSettings, FiFolder, FiGithub, FiShield } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <Box w="200px" p={4} minH="100vh">
      <VStack spacing={4} align="stretch">
        <Button as={NavLink} to="/" leftIcon={<FiHome />} variant="ghost">
          Dashboard
        </Button>
        <Button as={NavLink} to="/projects" leftIcon={<FiFolder />} variant="ghost">
          Projects
        </Button>
        <Button as={NavLink} to="/webhooks" leftIcon={<FiGithub />} variant="ghost">
          Webhooks
        </Button>
        <Button as={NavLink} to="/profile" leftIcon={<FiUser />} variant="ghost">
          Profile
        </Button>
        <Button as={NavLink} to="/settings" leftIcon={<FiSettings />} variant="ghost">
          Settings
        </Button>
        {user?.role === 'ADMIN' && (
          <Button as={NavLink} to="/admin" leftIcon={<FiShield />} variant="ghost">
            Admin
          </Button>
        )}
        {/* Add more navigation buttons as needed */}
      </VStack>
    </Box>
  );
};

export default Sidebar;
