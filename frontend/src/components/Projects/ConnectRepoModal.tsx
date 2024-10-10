// src/components/Projects/ConnectRepoModal.tsx

import React, { useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import useConnectRepo from '../../hooks/useConnectRepo';

interface ConnectRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

interface FormData {
  repositoryUrl: string;
}

const ConnectRepoModal: React.FC<ConnectRepoModalProps> = ({ isOpen, onClose, projectId }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const connectRepoMutation = useConnectRepo();

  useEffect(() => {
    if (!isOpen) {
      reset({
        repositoryUrl: '',
      });
    }
  }, [isOpen, reset]);

  const onSubmit = (data: FormData) => {
    connectRepoMutation.mutate({ projectId, data });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Connect Repository</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              <FormControl id="repositoryUrl" isRequired>
                <FormLabel>Repository URL</FormLabel>
                <Input
                  type="url"
                  placeholder="https://github.com/username/repo.git"
                  {...register('repositoryUrl', {
                    required: 'Repository URL is required.',
                    pattern: {
                      value: /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(\.git)?$/,
                      message: 'Enter a valid GitHub repository URL.',
                    },
                  })}
                />
                {errors.repositoryUrl && <span style={{ color: 'red' }}>{errors.repositoryUrl.message}</span>}
              </FormControl>
              <Button
                type="submit"
                colorScheme="teal"
                width="full"
                isLoading={connectRepoMutation.isPending}
              >
                Connect
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ConnectRepoModal;
