// src/pages/Dashboard.tsx

import React from 'react';
import { Box, Flex, Grid, GridItem } from '@chakra-ui/react';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import JenkinsJobsWidget from '../components/Widgets/JenkinsJobsWidget';
import DockerContainersWidget from '../components/Widgets/DockerContainersWidget';
import SystemMetricsWidget from '../components/Widgets/SystemMetricsWidget';
// Import additional widgets as needed

const Dashboard = () => {
  return (
    <Flex direction="column" height="100vh">
      <Header />
      <Flex flex="1">
        <Sidebar />
        <Box flex="1" p={4} overflowY="auto">
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
            <GridItem>
              <JenkinsJobsWidget />
            </GridItem>
            <GridItem>
              <DockerContainersWidget />
            </GridItem>
            <GridItem>
              <SystemMetricsWidget />
            </GridItem>
            {/* Add more GridItems with widgets here */}
          </Grid>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Dashboard;
