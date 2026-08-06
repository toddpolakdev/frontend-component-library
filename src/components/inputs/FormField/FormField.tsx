import type { ChangeEvent } from 'react';

import { ErrorText, Field, Input, Label, RequiredMark } from './FormField.styles';

export interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  type?: 'text' | 'email' | 'tel';
  placeholder?: string;
  required?: boolean;
  error?: string;
  onChange: (value: string) => void;
}

export function FormField({
  id,
  label,
  value,
  type = 'text',
  placeholder,
  required = false,
  error,
  onChange,
}: FormFieldProps) {
  return (
    <Field>
      <Label htmlFor={id}>
        {label}
        {required && <RequiredMark> *</RequiredMark>}
      </Label>

      <Input
        $hasError={Boolean(error)}
        id={id}
        name={id}
        type={type}
        value={value}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
      />

      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </Field>
  );
}

FormField.displayName = 'FormField';

export default FormField;
