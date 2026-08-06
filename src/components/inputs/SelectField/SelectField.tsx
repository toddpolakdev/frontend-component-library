import type { ChangeEvent } from 'react';

import { ErrorText, Field, Label, RequiredMark, Select } from './SelectField.styles';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  required?: boolean;
  error?: string;
  onChange: (value: string) => void;
}

export function SelectField({
  id,
  label,
  value,
  options,
  required = false,
  error,
  onChange,
}: SelectFieldProps) {
  return (
    <Field>
      <Label htmlFor={id}>
        {label}
        {required && <RequiredMark> *</RequiredMark>}
      </Label>

      <Select
        $hasError={Boolean(error)}
        id={id}
        name={id}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </Field>
  );
}

SelectField.displayName = 'SelectField';

export default SelectField;
