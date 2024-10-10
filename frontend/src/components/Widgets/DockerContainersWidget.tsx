// src/components/Widgets/DockerContainersWidget.tsx

import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Heading,
    List,
    ListItem,
    Button,
    Spinner,
    Center,
    Alert,
    AlertIcon,
    HStack,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Box,
    VStack,
} from '@chakra-ui/react';
import { FiLogIn, FiRefreshCw } from 'react-icons/fi';
import useFetchDockerContainers from '../../hooks/useFetchDockerContainers';
import useStartDockerContainer from '../../hooks/useStartDockerContainer';
import useStopDockerContainer from '../../hooks/useStopDockerContainer';
import useRemoveDockerContainer from '../../hooks/useRemoveDockerContainer';
import useFetchDockerLogs from '../../hooks/useFetchDockerLogs';

interface DockerContainer {
    Id: string;
    Names: string[];
    Image: string;
    Command: string;
    Created: number;
    State: string;
    Status: string;
    Ports: any[];
    Labels: { [key: string]: string };
    SizeRw: number;
    SizeRootFs: number;
}

const DockerContainersWidget = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedContainerId, setSelectedContainerId] = useState<string | null>(null);
    const { data, isLoading, isError, refetch } = useFetchDockerContainers();
    const startMutation = useStartDockerContainer();
    const stopMutation = useStopDockerContainer();
    const removeMutation = useRemoveDockerContainer();
    const { data: logs, isLoading: isLogsLoading, isError: isLogsError } = useFetchDockerLogs(selectedContainerId || '');

    const handleStart = (id: string) => {
        startMutation.mutate(id);
    };

    const handleStop = (id: string) => {
        stopMutation.mutate(id);
    };

    const handleRemove = (id: string) => {
        if (window.confirm('Are you sure you want to remove this container?')) {
            removeMutation.mutate(id);
        }
    };

    const handleViewLogs = (id: string) => {
        setSelectedContainerId(id);
        onOpen();
    };

    return (
        <Card>
            <CardHeader display="flex" justifyContent="space-between" alignItems="center">
                <Heading size="md">Docker Containers</Heading>
                <Button leftIcon={<FiRefreshCw />} onClick={() => refetch()}>
                    Refresh
                </Button>
            </CardHeader>
            <CardBody>
                {isLoading && (
                    <Center>
                        <Spinner size="lg" />
                    </Center>
                )}
                {isError && (
                    <Alert status="error">
                        <AlertIcon />
                        Failed to load Docker containers.
                    </Alert>
                )}
                {!isLoading && !isError && (
                    <List spacing={3}>
                        {data && data.length > 0 ? (
                            data.map((container: DockerContainer) => (
                                <ListItem key={container.Id} display="flex" justifyContent="space-between" alignItems="center">

                                    <VStack align="start">
                                        <Text fontWeight="bold">{container.Names[0]}</Text>
                                        <Text color="gray.500">{`Status: ${container.Status}`}</Text>
                                    </VStack>
                                    <HStack spacing={2}>
                                        <Button
                                            colorScheme="green"
                                            size="sm"
                                            onClick={() => handleStart(container.Id)}
                                            isLoading={startMutation.isPending && startMutation.variables === container.Id}
                                            disabled={container.State === 'running'}
                                        >
                                            Start
                                        </Button>
                                        <Button
                                            colorScheme="yellow"
                                            size="sm"
                                            onClick={() => handleStop(container.Id)}
                                            isLoading={stopMutation.isPending && stopMutation.variables === container.Id}
                                            disabled={container.State !== 'running'}
                                        >
                                            Stop
                                        </Button>
                                        <Button
                                            colorScheme="red"
                                            size="sm"
                                            onClick={() => handleRemove(container.Id)}
                                            isLoading={removeMutation.isPending && removeMutation.variables === container.Id}
                                        >
                                            Remove
                                        </Button>
                                        <Button
                                            colorScheme="blue"
                                            size="sm"
                                            onClick={() => handleViewLogs(container.Id)}
                                            leftIcon={<FiLogIn />}
                                        >
                                            Logs
                                        </Button>
                                    </HStack>
                                </ListItem>
                            ))
                        ) : (
                            <Center>No Docker containers found.</Center>
                        )}
                    </List>
                )}
            </CardBody>

            {/* Logs Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Container Logs</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {isLogsLoading && (
                            <Center>
                                <Spinner size="lg" />
                            </Center>
                        )}
                        {isLogsError && (
                            <Alert status="error">
                                <AlertIcon />
                                Failed to load logs for this container.
                            </Alert>
                        )}
                        {!isLogsLoading && !isLogsError && logs && (
                            <Box
                                as="pre"
                                bg="gray.800"
                                color="white"
                                p={4}
                                borderRadius="md"
                                overflowX="auto"
                                maxH="60vh"
                            >
                                {logs}
                            </Box>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Card>
    );
};

export default DockerContainersWidget;
