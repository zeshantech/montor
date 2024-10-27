// src/components/UI/InputField.tsx
import React, { ReactNode } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputProps,
  InputRightElement,
  InputLeftElement,
  InputGroup,
} from "@chakra-ui/react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegisterReturn,
} from "react-hook-form";

export interface InputFieldProps<T extends FieldValues> extends InputProps {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  label: string;
  error?: FieldError;
  register: UseFormRegisterReturn<Path<T>>;
}

const InputField = <T extends FieldValues>({
  id,
  label,
  error,
  leftIcon,
  rightIcon,
  register,
  ...restProps
}: InputFieldProps<T>) => {
  return (
    <FormControl id={id} isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <InputGroup>
        {leftIcon && (
          <InputLeftElement pointerEvents="none">{leftIcon}</InputLeftElement>
        )}
        <Input {...register} {...restProps} />
        {rightIcon && (
          <InputRightElement pointerEvents="none">
            {rightIcon}
          </InputRightElement>
        )}
      </InputGroup>
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export default React.memo(InputField);
