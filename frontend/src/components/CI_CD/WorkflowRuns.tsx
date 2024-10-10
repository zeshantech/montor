import {
    Box,
    Heading,
    List,
    ListItem,
    Spinner,
    Center,
    Text,
    Alert,
    AlertIcon,
    Progress,
    VStack,
} from '@chakra-ui/react';
import useFetchWorkflowRuns from '../../hooks/useFetchWorkflowRuns';

const WorkflowRuns = () => {
    const { data: runs, isLoading, isError } = useFetchWorkflowRuns();

    if (isLoading) {
        return (
            <Center>
                <Spinner size="lg" />
            </Center>
        );
    }

    if (isError) {
        return (
            <Alert status="error">
                <AlertIcon />
                Failed to load workflow runs.
            </Alert>
        );
    }

    return (
        <Box>
            <Heading size="md" mb={4}>
                Workflow Runs
            </Heading>
            {runs && runs.length > 0 ? (
                <List spacing={3}>
                    {runs.map((run) => (
                        <ListItem key={run.id} borderWidth={1} borderRadius="md" p={4}>
                            <VStack align="start" spacing={2}>
                                <VStack align="start">
                                    <Text fontWeight="bold">{`Workflow ID: ${run.id}`}</Text>
                                    <Text color="gray.500">{`Status: ${run.status}`}</Text>
                                </VStack>
                                <Progress value={/*run.progress*/10} size="sm" colorScheme="green" borderRadius="md" />
                                <Box>
                                    <strong>Started At:</strong> {new Date(run.startedAt).toLocaleString()}
                                </Box>
                                <Box>
                                    <strong>Completed At:</strong> {run.completedAt ? new Date(run.completedAt).toLocaleString() : 'In Progress'}
                                </Box>
                            </VStack>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Center>No workflow runs found.</Center>
            )}
        </Box>
    );
};

export default WorkflowRuns;
