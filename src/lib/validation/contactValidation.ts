export type ContactValidationInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  category: string;
};

export type ContactValidationErrors = Partial<
  Record<keyof ContactValidationInput, string>
>;

export type ContactValidationResult = {
  isValid: boolean;
  errors: ContactValidationErrors;
  values: ContactValidationInput;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getPhoneDigits(phone: string) {
  return phone.replace(/\D/g, '');
}

export function formatPhoneNumber(value: string) {
  const digits = getPhoneDigits(value).slice(0, 10);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function validateContact(
  input: ContactValidationInput,
): ContactValidationResult {
  const values: ContactValidationInput = {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: formatPhoneNumber(input.phone),
    company: input.company.trim(),
    category: input.category.trim(),
  };

  const errors: ContactValidationErrors = {};
  const phoneDigits = getPhoneDigits(values.phone);

  if (!values.firstName) {
    errors.firstName = 'First name is required.';
  }

  if (!values.lastName) {
    errors.lastName = 'Last name is required.';
  }

  if (!values.email) {
    errors.email = 'Email is required.';
  } else if (!emailPattern.test(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.phone) {
    errors.phone = 'Phone number is required.';
  } else if (phoneDigits.length !== 10) {
    errors.phone = 'Phone number must include a 10-digit number with area code.';
  }

  if (!values.company) {
    errors.company = 'Company is required.';
  }

  if (!values.category) {
    errors.category = 'Contact type is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    values,
  };
}
