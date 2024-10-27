import { useState } from "react";
import { Box, Heading, List, ListItem, Spinner, Center, Text, Alert, AlertIcon, VStack, Badge, Button, IconButton, HStack, Divider } from "@chakra-ui/react";
import { RepeatIcon, ExternalLinkIcon, CloseIcon } from "@chakra-ui/icons";
import useFetchWorkflowRuns from "../../hooks/useFetchWorkflowRuns";
import { useParams } from "react-router-dom";
import { formatDistanceToNow, differenceInMonths } from "date-fns";
import useRerunWorkflow from "../../hooks/useRerunWorkflow";
import useCancelWorkflow from "../../hooks/useCancelWorkflow";
import LogsViewer from "./LogsViewer";

const WorkflowRuns = () => {
  const { id } = useParams<{ id: string }>();
  const { data: runs, isLoading, error, isError } = useFetchWorkflowRuns(id!);
  const { mutate: rerunWorkflow, isPending: isRerunLoading } = useRerunWorkflow();
  const { mutate: cancelWorkflow, isPending: isCancelLoading } = useCancelWorkflow();

  const [selectedWorkflowRunId, setSelectedWorkflowRunId] = useState<number | null>(null);

  const handleRerun = (workflowRunId: number) => {
    rerunWorkflow({ projectId: id!, workflowRunId });
  };

  const handleCancel = (workflowRunId: number) => {
    cancelWorkflow({ projectId: id!, workflowRunId });
  };

  const toggleLogs = (workflowRunId: number) => {
    setSelectedWorkflowRunId(workflowRunId === selectedWorkflowRunId ? null : workflowRunId);
  };

  const canRerun = (created_at: string) => {
    return differenceInMonths(new Date(), new Date(created_at)) < 1;
  };

  const canCancel = (status: string) => {
    return status === "in_progress" || status === "queued";
  };

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
        {error?.message}
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
            <ListItem key={run.id} borderWidth={1} borderRadius="md" p={4} boxShadow="lg">
              <VStack align="start" spacing={2}>
                <Heading size="sm" color="blue.500">
                  {run.name || `Run #${run.run_number}`}
                </Heading>
                <Text>
                  <strong>Branch:</strong> {run.head_branch || "N/A"}
                </Text>
                <Text>
                  <strong>Commit:</strong> {run.head_sha.slice(0, 7)}
                </Text>

                <HStack>
                  <Text>
                    <strong>Status:</strong>
                  </Text>
                  <Badge colorScheme={run.status === "completed" ? "green" : "yellow"}>{run.status}</Badge>
                  <Text>
                    <strong>Conclusion:</strong>
                  </Text>
                  <Badge colorScheme={run.conclusion === "success" ? "green" : "red"}>{run.conclusion || "N/A"}</Badge>
                </HStack>

                <HStack>
                  <Text>
                    <strong>Started:</strong> {formatDistanceToNow(new Date(run.created_at))} ago
                  </Text>
                  <Text>
                    <strong>Updated:</strong> {formatDistanceToNow(new Date(run.updated_at))} ago
                  </Text>
                </HStack>

                <Divider />

                <HStack spacing={4}>
                  <Button as="a" href={run.html_url} target="_blank" rel="noopener noreferrer" leftIcon={<ExternalLinkIcon />} colorScheme="blue">
                    View on GitHub
                  </Button>

                  {canRerun(run.created_at) ? <IconButton aria-label="Rerun Workflow" onClick={() => handleRerun(run.id)} isLoading={isRerunLoading} icon={<RepeatIcon />} colorScheme="yellow" /> : <Text color="gray.500">Rerun unavailable (older than 1 month)</Text>}
                  {canCancel(run.status) ? <IconButton aria-label="Cancel Workflow" onClick={() => handleCancel(run.id)} isLoading={isCancelLoading} icon={<CloseIcon />} colorScheme="red" /> : <Text color="gray.500">Cannot cancel (status: {run.status})</Text>}

                  {run.status === "completed" && (
                    <Button colorScheme="purple" onClick={() => toggleLogs(run.id)}>
                      {selectedWorkflowRunId === run.id ? "Hide" : "View Logs"}
                    </Button>
                  )}
                </HStack>

                {selectedWorkflowRunId === run.id && <LogsViewer projectId={id!} workflowRunId={run.id} />}
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
