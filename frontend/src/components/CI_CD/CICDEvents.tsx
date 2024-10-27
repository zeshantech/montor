import { Box, Heading, List, ListItem, ListIcon, Spinner, Center, Alert, AlertIcon, Text, VStack, Badge, HStack } from "@chakra-ui/react";
import { FiActivity } from "react-icons/fi";
import { useParams } from "react-router-dom";
import useFetchCICDEvents, { CICDEvent } from "../../hooks/useFetchCICDEvents";

const CICDEvents = () => {
  const { id } = useParams<{ id: string }>();
  const { data: events, isLoading, isError, error } = useFetchCICDEvents(id!);

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
        {error?.message || "Failed to load CI/CD events."}
      </Alert>
    );
  }

  return (
    <Box>
      <Heading size="md" mb={4}>
        CI/CD Events
      </Heading>
      {events && events.length > 0 ? (
        <List spacing={3}>
          {events.map((event: CICDEvent) => (
            <ListItem key={event.id} borderWidth={1} borderRadius="md" p={4} boxShadow="lg">
              <VStack align="start" spacing={2}>
                <HStack>
                  <ListIcon as={FiActivity} color="teal.500" />
                  <Text fontWeight="bold">{event.eventType}</Text>
                  <Badge colorScheme={getStatusColor(event.status)}>{event.status}</Badge>
                </HStack>
                <Text>
                  <strong>Timestamp:</strong> {new Date(event.createdAt).toLocaleString()}
                </Text>
                <Text>
                  <strong>Commit SHA:</strong> {event.commitSha}
                </Text>
                <Text>
                  <strong>Branch:</strong> {event.branch}
                </Text>
                <Text>
                  <strong>Details:</strong> {event.details}
                </Text>
              </VStack>
            </ListItem>
          ))}
        </List>
      ) : (
        <Center>
          <Text>No CI/CD events found for this project.</Text>
        </Center>
      )}
    </Box>
  );
};

// Helper function to determine badge color based on event status
const getStatusColor = (status: string) => {
  switch (status) {
    case "SUCCESS":
      return "green";
    case "FAILURE":
      return "red";
    case "IN_PROGRESS":
      return "yellow";
    default:
      return "gray";
  }
};

export default CICDEvents;
