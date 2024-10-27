// src/components/Widgets/SystemMetricsWidget.tsx

import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  VStack,
  Progress,
} from "@chakra-ui/react";
import useFetchSystemMetrics from "../../hooks/useFetchSystemMetrics";

const SystemMetricsWidget = () => {
  const { data, isLoading, isError } = useFetchSystemMetrics();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Heading size="md">System Metrics</Heading>
        </CardHeader>
        <CardBody>
          <Center>
            <Spinner size="lg" />
          </Center>
        </CardBody>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <Heading size="md">System Metrics</Heading>
        </CardHeader>
        <CardBody>
          <Alert status="error">
            <AlertIcon />
            Failed to load system metrics.
          </Alert>
        </CardBody>
      </Card>
    );
  }

  if (!data) {
    return <Text>No Data found</Text>;
  }

  return (
    <Card>
      <CardHeader>
        <Heading size="md">System Metrics</Heading>
      </CardHeader>
      <CardBody>
        <VStack align="start" spacing={3}>
          <Text>
            <strong>CPU Load Averages:</strong>{" "}
            {data.cpuLoad.loadAverages
              .map((load) => load.toFixed(2))
              .join(", ")}
          </Text>
          <Text>
            <strong>Cores: </strong> {data.cpuLoad.cores}
          </Text>
          <Text>
            <strong>Memory Usage:</strong>{" "}
            {(data.usedMemory / 1024 ** 3).toFixed(2)} GB /{" "}
            {(data.totalMemory / 1024 ** 3).toFixed(2)} GB
          </Text>
          <Progress
            value={(data.usedMemory / data.totalMemory) * 100}
            size="sm"
            colorScheme="green"
            borderRadius="md"
          />
          <Text>
            <strong>Free Memory:</strong>{" "}
            {(data.freeMemory / 1024 ** 3).toFixed(2)} GB
          </Text>
          <Text>
            <strong>Uptime:</strong> {Math.floor(data.uptime / 3600)}h{" "}
            {Math.floor((data.uptime % 3600) / 60)}m
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default SystemMetricsWidget;
