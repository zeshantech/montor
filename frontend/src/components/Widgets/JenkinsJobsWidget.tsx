// src/components/Widgets/JenkinsJobsWidget.tsx

import React from 'react';
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
  VStack,
} from '@chakra-ui/react';
import { FiRefreshCw } from 'react-icons/fi';
import useFetchJenkinsJobs from '../../hooks/useFetchJenkinsJobs';
import useTriggerJenkinsJob from '../../hooks/useTriggerJenkinsJob';
import useFetchJenkinsJobStatus from '../../hooks/useFetchJenkinsJobStatus';

interface JenkinsJob {
  name: string;
  color: string;
}

const JenkinsJobsWidget = () => {
  const { data, isLoading, isError, refetch } = useFetchJenkinsJobs();
  const triggerJobMutation = useTriggerJenkinsJob();
  const [selectedJob, setSelectedJob] = React.useState<string | null>(null);
  const { data: jobStatus, isLoading: isStatusLoading, isError: isStatusError } = useFetchJenkinsJobStatus(selectedJob || '');

  const handleTrigger = (jobName: string) => {
    triggerJobMutation.mutate(jobName);
  };

  const handleViewStatus = (jobName: string) => {
    setSelectedJob(jobName);
  };

  return (
    <Card>
      <CardHeader display="flex" justifyContent="space-between" alignItems="center">
        <Heading size="md">Jenkins Jobs</Heading>
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
            Failed to load Jenkins jobs.
          </Alert>
        )}
        {!isLoading && !isError && (
          <List spacing={3}>
            {data && data.length > 0 ? (
              data.map((job: JenkinsJob) => (
                <ListItem key={job.name} display="flex" justifyContent="space-between" alignItems="center">
                  <VStack align="start">
                    <Text fontWeight="bold">{job.name}</Text>
                    <Text color="gray.500">{`Status: ${job.color.replace(/_/g, ' ')}`}</Text>
                  </VStack>
                  <HStack spacing={2}>
                    <Button
                      colorScheme="teal"
                      size="sm"
                      onClick={() => handleTrigger(job.name)}
                      isLoading={triggerJobMutation.isPending && triggerJobMutation.variables === job.name}
                    >
                      Trigger
                    </Button>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => handleViewStatus(job.name)}
                    >
                      Status
                    </Button>
                  </HStack>
                </ListItem>
              ))
            ) : (
              <Center>No Jenkins jobs found.</Center>
            )}
          </List>
        )}
      </CardBody>

      {/* Status Modal */}
      {selectedJob && (
        <Alert status={isStatusError ? 'error' : 'info'} variant="left-accent" mb={4}>
          <AlertIcon />
          {isStatusLoading ? (
            <Spinner size="sm" />
          ) : isStatusError ? (
            'Failed to load job status.'
          ) : (
            <>
              <Text><strong>Job:</strong> {selectedJob}</Text>
              <Text><strong>Result:</strong> {jobStatus?.result || 'N/A'}</Text>
              <Text><strong>Duration:</strong> {jobStatus?.duration}ms</Text>
              <Text><strong>Timestamp:</strong> {new Date(jobStatus?.timestamp || 0).toLocaleString()}</Text>
            </>
          )}
        </Alert>
      )}
    </Card>
  );
};

export default JenkinsJobsWidget;
