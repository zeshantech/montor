import { Card, CardHeader, CardBody, Heading, List, ListItem, Button, Spinner, Center, Alert, AlertIcon, Text } from '@chakra-ui/react';
import { FiRefreshCw } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import API from '../../services/api';

interface JenkinsJob {
  name: string;
  color: string;
}

const JenkinsJobsWidget = () => {
  // const { authTokens } = useAuth();

  const { data, isLoading, isError, refetch } = useQuery<JenkinsJob[]>({
    queryKey: ['jenkinsJobs'],
    queryFn: async () => {
      const response = await API.get('/jenkins/jobs');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1
  });

  const triggerJob = async (jobName: string) => {
    try {
      await API.post(`/jenkins/trigger/${encodeURIComponent(jobName)}`);
      alert(`Job "${jobName}" triggered successfully.`);
      refetch();
    } catch (error: any) {
      console.error(`Failed to trigger job "${jobName}":`, error);
      alert(`Failed to trigger job "${jobName}".`);
    }
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
              data.map((job) => (
                <ListItem key={job.name} display="flex" justifyContent="space-between" alignItems="center">
                  <Text
                    // primary={job.name}
                    // secondary={`Status: ${job.color.replace(/_/g, ' ')}`}
                  >{job.name}</Text>
                  <Button colorScheme="teal" size="sm" onClick={() => triggerJob(job.name)}>
                    Trigger
                  </Button>
                </ListItem>
              ))
            ) : (
              <Center>No Jenkins jobs found.</Center>
            )}
          </List>
        )}
      </CardBody>
    </Card>
  );
};

export default JenkinsJobsWidget;
