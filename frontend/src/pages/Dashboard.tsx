// src/pages/Dashboard.tsx

import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import JenkinsJobsWidget from '../components/Widgets/JenkinsJobsWidget';
// import DockerContainersWidget from '../components/Widgets/DockerContainersWidget';
// import SystemMetricsWidget from '../components/Widgets/SystemMetricsWidget';
// Import additional widgets as needed

const Dashboard = () => {
  return (
    <Flex direction="column" height="100vh">
      <Header />
      <Flex flex="1">
        <Sidebar />
        <Box flex="1" p={4} overflowY="auto">
          <Flex direction="column" gap={4}>
            <JenkinsJobsWidget />
            {/* <DockerContainersWidget />
            <SystemMetricsWidget /> */}
            {/* Add more widgets here */}
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Dashboard;
