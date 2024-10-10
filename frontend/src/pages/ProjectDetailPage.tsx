// src/pages/ProjectDetailPage.tsx

import React from 'react';
import { Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import ProjectDetail from '../components/Projects/ProjectDetail';
import CICDEvents from '../components/CI_CD/CICDEvents';
import WorkflowRuns from '../components/CI_CD/WorkflowRuns';

const ProjectDetailPage = () => {
  return (
    <Box p={6}>
      <Heading mb={6}>Project Details</Heading>
      <ProjectDetail />
      <Tabs mt={6} variant="enclosed">
        <TabList>
          <Tab>CI_CD Events</Tab>
          <Tab>Workflow Runs</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <CICDEvents />
          </TabPanel>
          <TabPanel>
            <WorkflowRuns />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ProjectDetailPage;
