import React, { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  FormLabel,
  ButtonGroup,
  Stack,
  Center,
  Spinner,
  AlertIcon,
  Alert,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import useCreateProject from "../../hooks/useCreateProject";
import useUpdateProject from "../../hooks/useUpdateProject";
import InputField from "../UI/InputField";
import TextareaField from "../UI/TextareaField";
import { FaGithub } from "react-icons/fa";
import { AiOutlineLock } from "react-icons/ai";
import useFetchProject from "../../hooks/useFetchProject";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
}

interface FormData {
  name: string;
  repositoryUrl: string;
  description?: string;
  isPrivate: boolean;
  token?: string;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  projectId,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      description: "",
      repositoryUrl: "",
      isPrivate: false,
      token: "",
    },
  });

  const {
    data: project,
    isLoading,
    isError,
  } = useFetchProject(projectId ?? "");
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();

  console.log(isLoading, projectId, "------------------------");
  

  const watchIsPrivate = watch("isPrivate", false);

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        description: project.description || "",
        repositoryUrl: project.repositoryUrl,
        isPrivate: project.isPrivate,
        token: project.accessToken,
      });
    } else {
      reset({
        name: "",
        description: "",
        repositoryUrl: "",
        isPrivate: false,
        token: "",
      });
    }
  }, [project, reset]);

  const onSubmit = (data: FormData) => {
    const payload = {
      name: data.name,
      description: data.description,
      repositoryUrl: data.repositoryUrl,
      isPrivate: data.isPrivate,
      accessToken: data.token,
    };

    if (project) {
      updateProjectMutation.mutate({ id: project.id, data: payload });
    } else {
      createProjectMutation.mutate(payload);
    }
    onClose();
  };

  const validateGithubUrl = (value: string) => {
    const regex = /^https:\/\/(?:[^@]+@)?github\.com\/.+\/.+$/;
    return regex.test(value) || "Enter a valid GitHub repository URL";
  };

  if (projectId && isLoading) {
    return (
      <Center><Spinner size="lg" /></Center>
    );
  }

  if (projectId && isError) {
    return (
      <Alert status="error"><AlertIcon />Failed to load webhooks.</Alert>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"3xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{project ? "Edit Project" : "Create Project"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              <InputField
                label="Project Name"
                placeholder="Enter project name"
                error={errors.name}
                register={register("name", {
                  required: "Project name is required",
                })}
              />

              <InputField
                label="Repository URL"
                placeholder="https://github.com/user/repo.git"
                error={errors.repositoryUrl}
                register={register("repositoryUrl", {
                  required: false,
                  validate: validateGithubUrl,
                })}
                rightIcon={<FaGithub />}
              />

              <Stack
                alignItems="center"
                direction={"row"}
                justify={"space-between"}
                width="100%"
              >
                <FormLabel mb="0">Repository Type</FormLabel>
                <ButtonGroup size="sm" isAttached variant="outline">
                  <Button
                    onClick={() => setValue("isPrivate", false)}
                    variant={!watchIsPrivate ? "solid" : "outline"}
                  >
                    Public
                  </Button>
                  <Button
                    onClick={() => setValue("isPrivate", true)}
                    variant={watchIsPrivate ? "solid" : "outline"}
                  >
                    Private
                  </Button>
                </ButtonGroup>
              </Stack>

              {watchIsPrivate && (
                <InputField
                  label="GitHub Access Token"
                  placeholder="Enter GitHub access token"
                  error={errors.token}
                  register={register("token", {
                    required:
                      "GitHub access token is required for private repositories",
                  })}
                  rightIcon={<AiOutlineLock />}
                  type="password"
                />
              )}

              <TextareaField
                label="Description"
                placeholder="Enter project description"
                register={register("description")}
                error={errors.description}
              />

              <Button
                type="submit"
                colorScheme="teal"
                width="full"
                isLoading={
                  createProjectMutation.isPending ||
                  updateProjectMutation.isPending
                }
              >
                {project ? "Update Project" : "Create Project"}
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProjectFormModal;
