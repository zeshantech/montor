// src/components/CI_CD/CICDEvents.tsx

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
import { useParams } from 'react-router-dom';
import useFetchCICDEvents, { CICDEvent } from '../../hooks/useFetchCICDEvents';

const CICDEvents = () => {
  const { id } = useParams<{ id: string }>();
  const { data: events, isLoading, isError } = useFetchCICDEvents(id!);

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
        Failed to load CI_CD events.
      </Alert>
    );
  }

  return (
    <Box>
      <Heading size="md" mb={4}>
        CI_CD Events
      </Heading>
      {events && events.length > 0 ? (
        <List spacing={3}>
          {events.map((event: CICDEvent) => (
            <ListItem key={event.id}>
              <ListIcon as={FiActivity} color="teal.500" />
              <Text><strong>Type:</strong> {event.eventType}</Text>
              <Text><strong>Timestamp:</strong> {new Date(event.timestamp).toLocaleString()}</Text>
              <Text><strong>Details:</strong> {event.details}</Text>
            </ListItem>
          ))}
        </List>
      ) : (
        <Text>No CI_CD events found for this project.</Text>
      )}
    </Box>
  );
};

export default CICDEvents;
