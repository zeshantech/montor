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
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import useCreateProject from "../../hooks/useCreateProject";
import useUpdateProject from "../../hooks/useUpdateProject";
import InputField from "../UI/InputField";
import TextareaField from "../UI/TextareaField";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any | null;
}

interface FormData {
  name: string;
  description?: string;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        description: project.description || "",
      });
    } else {
      reset({
        name: "",
        description: "",
      });
    }
  }, [project, reset]);

  const onSubmit = (data: FormData) => {
    if (project) {
      updateProjectMutation.mutate({ id: project.id, data });
    } else {
      createProjectMutation.mutate(data);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{project ? "Edit Project" : "Create Project"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              <InputField
                aria-label="Project Name"
                id="name"
                label="Project Name"
                placeholder="Enter project name"
                error={errors.name}
                register={register("name", {
                  required: "Project name is required.",
                })}
              />
              <TextareaField
                aria-label="Description Name"
                id="description"
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
