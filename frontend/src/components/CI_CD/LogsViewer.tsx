// frontend/src/components/CI_CD/LogsViewer.tsx

import React, { useEffect, useMemo, useState } from "react";
import { Box, Heading, Spinner, Text, Input, HStack, Button } from "@chakra-ui/react";
import useDownloadWorkflowLogs, { LogEntry } from "../../hooks/useDownloadWorkflowLogs";
import { CopyIcon } from "@chakra-ui/icons";
import { saveAs } from "file-saver";

interface LogsViewerProps {
  projectId: string;
  workflowRunId: number;
}

const LogsViewer: React.FC<LogsViewerProps> = ({ projectId, workflowRunId }) => {
  const { mutateAsync: downloadWorkflowLogsMutateAsync, isPending: isLogsLoading, data: logsData, error } = useDownloadWorkflowLogs();

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    downloadWorkflowLogsMutateAsync({ projectId, workflowRunId });
  }, [projectId, workflowRunId, downloadWorkflowLogsMutateAsync]);

  // Function to download logs as a text file
  const handleDownloadLogs = () => {
    if (logsData && logsData.logs) {
      const blob = new Blob([logsData.logs.map((log) => `${log.timestamp}Z [${log.level.toUpperCase()}] ${log.message}`).join("\n")], { type: "text/plain;charset=utf-8" });
      saveAs(blob, `workflow-logs-${workflowRunId}.txt`);
    }
  };

  // Filtered logs based on search term
  const filteredLogs: LogEntry[] = useMemo(() => {
    if (!logsData || !logsData.logs) return [];

    return logsData.logs.filter((log) => log.message.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [logsData, searchTerm]);

  // Function to get color based on log level
  const getColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "error":
        return "red.500";
      case "warning":
        return "yellow.500";
      case "info":
        return "blue.500";
      case "debug":
        return "cyan.500";
      case "success":
        return "green.500";
      default:
        return "gray.500";
    }
  };

  return (
    <Box mt={4} width="100%">
      <Heading size="md" mb={4}>
        Workflow Logs
      </Heading>

      {isLogsLoading ? (
        <Spinner />
      ) : error ? (
        <Text color="red.500">Failed to load logs: {error.message}</Text>
      ) : logsData && logsData.logs.length > 0 ? (
        <>
          <HStack mb={4}>
            <Input placeholder="Search logs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} width="300px" />
            <Button leftIcon={<CopyIcon />} onClick={handleDownloadLogs} colorScheme="teal">
              Download Logs
            </Button>
          </HStack>
          <Box maxHeight="600px" overflowY="auto" bg="gray.800" p={4} borderRadius="md" fontFamily="monospace" whiteSpace="pre-wrap" color="white">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, index) => (
                <Text key={index} color={getColor(log.level)} fontSize="sm">
                  <strong>{log.timestamp}Z</strong> [{log.level.toUpperCase()}] {log.message}
                </Text>
              ))
            ) : (
              <Text>No matching logs found.</Text>
            )}
          </Box>
        </>
      ) : (
        <Text>No logs available.</Text>
      )}
    </Box>
  );
};

export default LogsViewer;
