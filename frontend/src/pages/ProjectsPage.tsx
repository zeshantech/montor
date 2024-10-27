import { Box, Heading } from '@chakra-ui/react';
import ProjectList from '../components/Projects/ProjectList';

const ProjectsPage = () => {
  return (
    <Box p={6}>
      <Heading mb={6}>Projects</Heading>
      <ProjectList />
    </Box>
  );
};

export default ProjectsPage;
