// src/pages/AdminDashboard.tsx

import React from 'react';
import {
  Box,
  Heading,
  VStack,
  Text,
  Button,
  List,
  ListItem,
  ListIcon,
  Input,
  HStack,
} from '@chakra-ui/react';
import { FiUsers, FiActivity, FiSearch } from 'react-icons/fi';
import useFetchUsers from '../hooks/useFetchUsers';
import useFetchSystemLogs from '../hooks/useFetchSystemLogs';
import useDeleteUser from '../hooks/useDeleteUser';

const AdminDashboard = () => {
  const { data: users } = useFetchUsers();
  const { data: logs } = useFetchSystemLogs();
  const deleteUserMutation = useDeleteUser();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(userId);
    }
  };

  return (
    <Box p={6}>
      <Heading mb={6}>Admin Dashboard</Heading>
      <VStack align="start" spacing={6}>
        {/* User Management Section */}
        <Box w="100%">
          <Heading size="md" mb={4}>
            <ListItem>
              <ListIcon as={FiUsers} color="teal.500" />
              User Management
            </ListItem>
          </Heading>
          {/* Search Bar */}
          <HStack mb={4}>
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="sm"
            />
            <Button leftIcon={<FiSearch />} size="sm">
              Search
            </Button>
          </HStack>
          <List spacing={3}>
            {users && users.length > 0 ? (
              filteredUsers.length > 0 ? (
                filteredUsers.map((user: any) => (
                  <ListItem key={user.id} display="flex" justifyContent="space-between" alignItems="center">
                    <Text>
                      {user.name} ({user.email}) - {user.role}
                    </Text>
                    <Button
                      size="sm"
                      colorScheme="red"
                      variant="outline"
                      onClick={() => handleDeleteUser(user.id)}
                      isLoading={deleteUserMutation.isPending && deleteUserMutation.variables === user.id}
                    >
                      Delete
                    </Button>
                  </ListItem>
                ))
              ) : (
                <Text>No users match your search.</Text>
              )
            ) : (
              <Text>No users found.</Text>
            )}
          </List>
        </Box>

        {/* System Logs Section */}
        <Box w="100%">
          <Heading size="md" mb={4}>
            <ListItem>
              <ListIcon as={FiActivity} color="teal.500" />
              System Logs
            </ListItem>
          </Heading>
          {logs && logs.length > 0 ? (
            <Box
              maxH="400px"
              overflowY="scroll"
              bg="gray.100"
              p={4}
              borderRadius="md"
              whiteSpace="pre-wrap"
              fontFamily="monospace"
              fontSize="sm"
            >
              {logs.map((log: string, index: number) => (
                <Text key={index}>{log}</Text>
              ))}
            </Box>
          ) : (
            <Text>No logs available.</Text>
          )}
        </Box>

        {/* Add more admin-specific sections as needed */}
      </VStack>
    </Box>
  );
};

export default AdminDashboard;
