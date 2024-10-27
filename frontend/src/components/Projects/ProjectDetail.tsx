import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  VStack,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import useFetchProject from "../../hooks/useFetchProject";
import ProjectFormModal from "./ProjectFormModal";
import ConnectRepoModal from "./ConnectRepoModal.tsx";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading, isError } = useFetchProject(id || "");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConnectRepoModalOpen, setIsConnectRepoModalOpen] = useState(false);

  if (isLoading) {
    return (
      <Center h="100%">
        <Spinner size="lg" />
      </Center>
    );
  }

  if (isError || !project) {
    return (
      <Center h="100%">
        <Alert status="error">
          <AlertIcon />
          Failed to load project details.
        </Alert>
      </Center>
    );
  }

  return (
    <Box p={6}>
      <VStack align="start" spacing={4}>
        <Heading>{project.name}</Heading>
        <Text>{project.description || "No description provided."}</Text>
        <Text>
          <strong>Created At:</strong>{" "}
          {new Date(project.createdAt).toLocaleString()}
        </Text>
        <Button colorScheme="yellow" onClick={() => setIsEditModalOpen(true)}>
          Edit Project
        </Button>
        <Button
          colorScheme="blue"
          onClick={() => setIsConnectRepoModalOpen(true)}
        >
          Connect Repository
        </Button>
        <Button colorScheme="red" onClick={() => navigate(-1)}>
          Back to Projects
        </Button>
      </VStack>

      {/* Edit Project Modal */}
      <ProjectFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        projectId={project.id}
      />

      {/* Connect Repository Modal */}
      <ConnectRepoModal
        isOpen={isConnectRepoModalOpen}
        onClose={() => setIsConnectRepoModalOpen(false)}
        projectId={project.id}
      />
    </Box>
  );
};

export default ProjectDetail;
