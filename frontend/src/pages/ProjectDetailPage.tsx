import { Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Button, HStack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import ProjectDetail from '../components/Projects/ProjectDetail';
import CICDEvents from '../components/CI_CD/CICDEvents';
import WorkflowRuns from '../components/CI_CD/WorkflowRuns';
import useTriggerWorkflow from '../hooks/useTriggerWorkflow';
import { useForm } from 'react-hook-form';
import { FiPlay } from 'react-icons/fi';

interface TriggerWorkflowForm {
    workflowName: string;
}

const ProjectDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const {mutateAsync} = useTriggerWorkflow();
    const { register, handleSubmit, reset } = useForm<TriggerWorkflowForm>();

    const onSubmit = (data: TriggerWorkflowForm) => {
        if (id) {
            mutateAsync(
                { projectId: id, workflowName: data.workflowName },
                {
                    onSuccess: () => {
                        reset();
                    },
                }
            );
        }
    };

    return (
        <Box p={6}>
            <Heading mb={6}>Project Details</Heading>
            <ProjectDetail />
            <Tabs mt={6} variant="enclosed">
                <TabList>
                    <Tab>CI/CD Events</Tab>
                    <Tab>Workflow Runs</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <CICDEvents />
                    </TabPanel>
                    <TabPanel>
                        <HStack mb={4}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <HStack spacing={2}>
                                    <input
                                        type="text"
                                        placeholder="Workflow Name"
                                        {...register('workflowName', { required: 'Workflow name is required.' })}
                                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                    <Button type="submit" leftIcon={<FiPlay />} colorScheme="teal">
                                        Trigger Workflow
                                    </Button>
                                </HStack>
                            </form>
                        </HStack>
                        <WorkflowRuns />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
};

export default ProjectDetailPage;
