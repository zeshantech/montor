// src/components/UI/InputField.tsx

import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputProps,
} from "@chakra-ui/react";
import { FieldError, FieldValues, Path, UseFormRegisterReturn } from "react-hook-form";

export interface InputFieldProps<T extends FieldValues> extends InputProps {
  id: string;
  label: string;
  error?: FieldError;
  register: UseFormRegisterReturn<Path<T>>;
}

const InputField = <T extends FieldValues>({
  id,
  label,
  error,
  register,
  ...restProps
}: InputFieldProps<T>) => {
  return (
    <FormControl id={id} isInvalid={!!error} isRequired>
      <FormLabel>{label}</FormLabel>
      <Input {...register} {...restProps} />
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export default React.memo(InputField);
