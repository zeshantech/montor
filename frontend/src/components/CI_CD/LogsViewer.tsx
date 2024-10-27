import React, { useEffect } from "react";
import { Box, Heading, VStack, Spinner, Text } from "@chakra-ui/react";
import useDownloadWorkflowLogs from "../../hooks/useDownloadWorkflowLogs";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface LogsViewerProps {
  projectId: string;
  workflowRunId: number;
}

const LogsViewer: React.FC<LogsViewerProps> = ({ projectId, workflowRunId }) => {
  const { mutateAsync: downloadWorkflowLogsMutateAsync, isPending: isLogsLoading, data: logsData, error } = useDownloadWorkflowLogs();

  useEffect(() => {
    downloadWorkflowLogsMutateAsync({ projectId, workflowRunId });
  }, [projectId, workflowRunId, downloadWorkflowLogsMutateAsync]);

  return (
    <Box mt={4}>
      <Heading size="md" mb={4}>
        Workflow Logs
      </Heading>

      <VStack spacing={4} align="start" width="100%">
        {isLogsLoading ? (
          <Spinner />
        ) : error ? (
          <Text color="red.500">Failed to load logs: {error.message}</Text>
        ) : logsData && logsData.logs ? (
          <Box width="100%" maxHeight="600px" overflowY="auto">
            <SyntaxHighlighter language="bash" style={dracula}>
              {logsData.logs}
            </SyntaxHighlighter>
          </Box>
        ) : (
          <Text>No logs available.</Text>
        )}
      </VStack>
    </Box>
  );
};

export default LogsViewer;
