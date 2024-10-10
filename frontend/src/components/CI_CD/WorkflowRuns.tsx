// src/components/CI_CD/WorkflowRuns.tsx

import React from 'react';
import {
  Box,
  Heading,
  List,
  ListItem,
  ListIcon,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Text,
} from '@chakra-ui/react';
import { FiActivity } from 'react-icons/fi';
import useFetchWorkflowRuns, { WorkflowRun } from '../../hooks/useFetchWorkflowRuns';

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
          {runs.map((run: WorkflowRun) => (
            <ListItem key={run.id}>
              <ListIcon as={FiActivity} color="teal.500" />
              <Text><strong>ID:</strong> {run.id}</Text>
              <Text><strong>Status:</strong> {run.status}</Text>
              <Text><strong>Started At:</strong> {new Date(run.startedAt).toLocaleString()}</Text>
              <Text><strong>Completed At:</strong> {new Date(run.completedAt).toLocaleString()}</Text>
              <Text><strong>Result:</strong> {run.result}</Text>
            </ListItem>
          ))}
        </List>
      ) : (
        <Text>No workflow runs found.</Text>
      )}
    </Box>
  );
};

export default WorkflowRuns;
