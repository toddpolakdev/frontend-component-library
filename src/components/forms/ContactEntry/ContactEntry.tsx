import { useState, type FormEvent } from 'react';

import { FormField, PrimaryButton, SelectField } from '../../inputs';
import { formatPhoneNumber, validateContact } from '../../../lib/validation/contactValidation';
import { Actions, CategoryField, Form, FullWidth, Grid, PhoneField } from './ContactEntry.styles';

export type ContactCategory = 'Client' | 'Lead' | 'Vendor' | 'Partner';

export interface ContactEntryValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  category: ContactCategory;
  notes: string;
}

type ContactEntryErrors = Partial<Record<keyof ContactEntryValues, string>>;

export interface ContactEntryProps {
  initialValues?: ContactEntryValues;
  submitLabel?: string;
  onSubmit: (values: ContactEntryValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  compact?: boolean;
}

const categoryOptions = [
  { label: 'Client', value: 'Client' },
  { label: 'Lead', value: 'Lead' },
  { label: 'Vendor', value: 'Vendor' },
  { label: 'Partner', value: 'Partner' },
];

const defaultValues: ContactEntryValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  category: 'Client',
  notes: '',
};

export function ContactEntry({
  initialValues,
  submitLabel = 'Save Contact',
  onSubmit,
  onCancel,
  isSubmitting = false,
  compact = false,
}: ContactEntryProps) {
  const [values, setValues] = useState<ContactEntryValues>(initialValues ?? defaultValues);
  const [errors, setErrors] = useState<ContactEntryErrors>({});

  function updateField(field: keyof ContactEntryValues, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationResult = validateContact(values);
    setErrors(validationResult.errors);

    if (!validationResult.isValid) {
      return;
    }

    onSubmit({
      firstName: validationResult.values.firstName,
      lastName: validationResult.values.lastName,
      email: validationResult.values.email,
      phone: validationResult.values.phone,
      company: validationResult.values.company,
      category: values.category,
      notes: values.notes.trim(),
    });

    setValues(defaultValues);
  }

  return (
    <Form $compact={compact} onSubmit={handleSubmit}>
      <Grid>
        <FormField
          id="firstName"
          label="First Name"
          value={values.firstName}
          placeholder="Jordan"
          required
          error={errors.firstName}
          onChange={(value) => updateField('firstName', value)}
        />

        <FormField
          id="lastName"
          label="Last Name"
          value={values.lastName}
          placeholder="Smith"
          required
          error={errors.lastName}
          onChange={(value) => updateField('lastName', value)}
        />

        <FormField
          id="email"
          label="Email"
          type="email"
          value={values.email}
          placeholder="jordan@example.com"
          required
          error={errors.email}
          onChange={(value) => updateField('email', value)}
        />

        <PhoneField>
          <FormField
            id="phone"
            label="Phone"
            type="tel"
            value={values.phone}
            placeholder="(614) 555-0142"
            required
            error={errors.phone}
            onChange={(value) => updateField('phone', formatPhoneNumber(value))}
          />
        </PhoneField>

        <FormField
          id="company"
          label="Company"
          value={values.company}
          placeholder="Brightside Consulting"
          required
          error={errors.company}
          onChange={(value) => updateField('company', value)}
        />

        <CategoryField>
          <SelectField
            id="category"
            label="Contact Type"
            value={values.category}
            options={categoryOptions}
            required
            error={errors.category}
            onChange={(value) => updateField('category', value as ContactCategory)}
          />
        </CategoryField>

        <FullWidth>
          <FormField
            id="notes"
            label="Notes"
            value={values.notes}
            placeholder="Optional contact notes"
            onChange={(value) => updateField('notes', value)}
          />
        </FullWidth>
      </Grid>

      <Actions>
        <PrimaryButton type="submit" fullWidthOnMobile={false} disabled={isSubmitting}>
          {submitLabel}
        </PrimaryButton>

        <PrimaryButton
          type="button"
          variant="secondary"
          fullWidthOnMobile={false}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </PrimaryButton>
      </Actions>
    </Form>
  );
}

ContactEntry.displayName = 'ContactEntry';

export default ContactEntry;
