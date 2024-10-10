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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { FiRefreshCw } from 'react-icons/fi';
import useFetchJenkinsJobs, { JenkinsJob } from '../../hooks/useFetchJenkinsJobs';
import useTriggerJenkinsJob from '../../hooks/useTriggerJenkinsJob';
import useFetchJenkinsJobStatus from '../../hooks/useFetchJenkinsJobStatus';
import useJenkinsRealTimeUpdates from '../../hooks/useJenkinsRealTimeUpdates';
import { toast } from 'react-toastify';

const JenkinsJobsWidget = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedJob, setSelectedJob] = React.useState<string | null>(null);
  const { data, isLoading, isError, refetch } = useFetchJenkinsJobs();
  const triggerJobMutation = useTriggerJenkinsJob();
  const { data: jobStatus, isLoading: isStatusLoading, isError: isStatusError } = useFetchJenkinsJobStatus(selectedJob || '');

  // Initialize real-time updates
  useJenkinsRealTimeUpdates();

  const handleTrigger = (jobName: string) => {
    triggerJobMutation.mutate(jobName, {
      onSuccess: () => {
        toast.success(`Job "${jobName}" triggered successfully.`);
      },
      onError: () => {
        toast.error(`Failed to trigger job "${jobName}".`);
      },
    });
  };

  const handleViewStatus = (jobName: string) => {
    setSelectedJob(jobName);
    onOpen();
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
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Job Status</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isStatusLoading ? (
              <Center>
                <Spinner size="lg" />
              </Center>
            ) : isStatusError ? (
              <Alert status="error">
                <AlertIcon />
                Failed to load job status.
              </Alert>
            ) : jobStatus ? (
              <VStack align="start" spacing={2}>
                <Text><strong>Job:</strong> {selectedJob}</Text>
                <Text><strong>Result:</strong> {jobStatus.result || 'In Progress'}</Text>
                <Text><strong>Duration:</strong> {jobStatus.duration} ms</Text>
                <Text><strong>Timestamp:</strong> {new Date(jobStatus.timestamp).toLocaleString()}</Text>
              </VStack>
            ) : (
              <Text>No status available.</Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Card>
  );
};

export default JenkinsJobsWidget;
