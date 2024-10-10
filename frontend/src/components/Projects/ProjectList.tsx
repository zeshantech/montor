import { useState } from 'react';
import {
    Box,
    Button,
    Heading,
    List,
    ListItem,
    Text,
    Spinner,
    Center,
    Alert,
    AlertIcon,
    HStack,
    VStack,
} from '@chakra-ui/react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import useFetchProjects, { Project } from '../../hooks/useFetchProjects';
import useDeleteProject from '../../hooks/useDeleteProject';
import ProjectFormModal from './ProjectFormModal';

const ProjectList = () => {
    const { data: projects, isLoading, isError } = useFetchProjects();
    const deleteProjectMutation = useDeleteProject();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            deleteProjectMutation.mutate(id);
        }
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingProject(null);
        setIsModalOpen(true);
    };

    return (
        <Box>
            <HStack justifyContent="space-between" mb={4}>
                <Heading size="md">Projects</Heading>
                <Button leftIcon={<FiPlus />} colorScheme="teal" onClick={handleCreate}>
                    Create Project
                </Button>
            </HStack>
            {isLoading && (
                <Center>
                    <Spinner size="lg" />
                </Center>
            )}
            {isError && (
                <Alert status="error">
                    <AlertIcon />
                    Failed to load projects.
                </Alert>
            )}
            {!isLoading && !isError && (
                <List spacing={3}>
                    {projects && projects.length > 0 ? (
                        projects.map((project) => (
                            <ListItem key={project.id} borderWidth={1} borderRadius="md" p={4}>
                                <HStack justifyContent="space-between">
                                    <VStack align="start">
                                        <Text fontWeight="bold">{project.name}</Text>
                                        <Text color="gray.500">{project.description || 'No description provided.'}</Text>
                                    </VStack>
                                    <HStack spacing={2}>
                                        <Button
                                            size="sm"
                                            colorScheme="yellow"
                                            leftIcon={<FiEdit />}
                                            onClick={() => handleEdit(project)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            colorScheme="red"
                                            leftIcon={<FiTrash2 />}
                                            onClick={() => handleDelete(project.id)}
                                            isLoading={deleteProjectMutation.isPending && deleteProjectMutation.variables === project.id}
                                        >
                                            Delete
                                        </Button>
                                    </HStack>
                                </HStack>
                            </ListItem>
                        ))
                    ) : (
                        <Center>No projects found.</Center>
                    )}
                </List>
            )}
            {/* Project Form Modal */}
            <ProjectFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                project={editingProject}
            />
        </Box>
    );
};

export default ProjectList;
