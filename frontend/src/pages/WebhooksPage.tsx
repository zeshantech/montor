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
import useFetchWebhooks from '../hooks/useFetchWebhooks';

const WebhooksPage = () => {
  const { data: webhooks, isLoading, isError } = useFetchWebhooks();

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
        Failed to load webhooks.
      </Alert>
    );
  }

  return (
    <Box p={6}>
      <Heading mb={6}>GitHub Webhooks</Heading>
      {webhooks && webhooks.length > 0 ? (
        <List spacing={3}>
          {webhooks.map((hook: any) => (
            <ListItem key={hook.id} borderWidth={1} borderRadius="md" p={4}>
              <ListIcon as={FiActivity} color="teal.500" />
              <Text><strong>Event:</strong> {hook.eventType}</Text>
              <Text><strong>Repository:</strong> {hook.repositoryUrl}</Text>
              <Text><strong>Timestamp:</strong> {new Date(hook.timestamp).toLocaleString()}</Text>
              <Text><strong>Details:</strong> {hook.details}</Text>
            </ListItem>
          ))}
        </List>
      ) : (
        <Text>No webhooks received yet.</Text>
      )}
    </Box>
  );
};

export default WebhooksPage;
