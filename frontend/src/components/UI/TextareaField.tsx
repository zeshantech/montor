// src/components/UI/TextareaField.tsx
import React from "react";
import {
  FormControl,
  FormLabel,
  Textarea,
  FormErrorMessage,
  TextareaProps,
} from "@chakra-ui/react";
import { FieldError, FieldValues, Path, UseFormRegisterReturn } from "react-hook-form";

export interface TextareaFieldProps<T extends FieldValues> extends TextareaProps {
  label: string;
  error?: FieldError;
  register: UseFormRegisterReturn<Path<T>>;
}

const TextareaField = <T extends FieldValues>({
  id,
  label,
  error,
  register,
  ...restProps
}: TextareaFieldProps<T>) => {
  return (
    <FormControl id={id} isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <Textarea {...register} {...restProps} />
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export default React.memo(TextareaField);
