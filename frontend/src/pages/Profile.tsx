import React from 'react';
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Spinner,
  Center,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import useFetchUserProfile from '../hooks/useFetchUserProfile';
import useUpdateUserProfile from '../hooks/useUpdateUserProfile';
import useChangePassword from '../hooks/useChangePassword';
import { toast } from 'react-toastify';

interface ProfileFormData {
  name: string;
  email: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile = () => {
  const { data: user, isLoading, isError } = useFetchUserProfile();
  const updateProfileMutation = useUpdateUserProfile();
  const changePasswordMutation = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>();

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>();

  React.useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, reset]);

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Profile updated successfully.');
      },
      onError: () => {
        toast.error('Failed to update profile.');
      },
    });
  };

  const onSubmitPassword = (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    changePasswordMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Password changed successfully.');
        resetPassword();
      },
      onError: () => {
        toast.error('Failed to change password.');
      },
    });
  };

  if (isLoading) {
    return (
      <Center h="100%">
        <Spinner size="lg" />
      </Center>
    );
  }

  if (isError || !user) {
    return (
      <Center h="100%">
        <Alert status="error">
          <AlertIcon />
          Failed to load user profile.
        </Alert>
      </Center>
    );
  }

  return (
    <Box p={6}>
      <Heading mb={6}>Profile</Heading>
      <VStack align="start" spacing={6}>
        {/* Update Profile Section */}
        <Box w="100%">
          <Heading size="md" mb={4}>Update Profile</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4} align="stretch">
              <FormControl id="name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Your Name"
                  {...register('name', { required: 'Name is required.' })}
                />
                {errors.name && <span style={{ color: 'red' }}>{errors.name.message}</span>}
              </FormControl>
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  {...register('email', {
                    required: 'Email is required.',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address.',
                    },
                  })}
                />
                {errors.email && <span style={{ color: 'red' }}>{errors.email.message}</span>}
              </FormControl>
              <Button
                type="submit"
                colorScheme="teal"
                isLoading={updateProfileMutation.isPending}
              >
                Update Profile
              </Button>
            </VStack>
          </form>
        </Box>

        {/* Change Password Section */}
        <Box w="100%">
          <Heading size="md" mb={4}>Change Password</Heading>
          <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
            <VStack spacing={4} align="stretch">
              <FormControl id="currentPassword" isRequired>
                <FormLabel>Current Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Current Password"
                  {...registerPassword('currentPassword', { required: 'Current password is required.' })}
                />
                {passwordErrors.currentPassword && <span style={{ color: 'red' }}>{passwordErrors.currentPassword.message}</span>}
              </FormControl>
              <FormControl id="newPassword" isRequired>
                <FormLabel>New Password</FormLabel>
                <Input
                  type="password"
                  placeholder="New Password"
                  {...registerPassword('newPassword', {
                    required: 'New password is required.',
                    minLength: { value: 6, message: 'Password must be at least 6 characters.' },
                  })}
                />
                {passwordErrors.newPassword && <span style={{ color: 'red' }}>{passwordErrors.newPassword.message}</span>}
              </FormControl>
              <FormControl id="confirmPassword" isRequired>
                <FormLabel>Confirm New Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Confirm New Password"
                  {...registerPassword('confirmPassword', { required: 'Please confirm your new password.' })}
                />
                {passwordErrors.confirmPassword && <span style={{ color: 'red' }}>{passwordErrors.confirmPassword.message}</span>}
              </FormControl>
              <Button
                type="submit"
                colorScheme="purple"
                isLoading={changePasswordMutation.isPending}
              >
                Change Password
              </Button>
            </VStack>
          </form>
        </Box>
      </VStack>
    </Box>
  );
};

export default Profile;
