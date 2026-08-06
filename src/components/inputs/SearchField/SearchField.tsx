import type { ChangeEvent } from 'react';

import { Field, Input, Label } from './SearchField.styles';

export interface SearchFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export function SearchField({ id, label, placeholder, value, onChange }: SearchFieldProps) {
  return (
    <Field>
      <Label htmlFor={id}>{label}</Label>

      <Input
        id={id}
        name={id}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
      />
    </Field>
  );
}

SearchField.displayName = 'SearchField';

export default SearchField;
