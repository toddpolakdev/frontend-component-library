import { describe, expect, it } from 'vitest';

import { formatPhoneNumber, getPhoneDigits, validateContact } from './contactValidation';

const validInput = {
  firstName: 'Jordan',
  lastName: 'Smith',
  email: 'JORDAN@example.com',
  phone: '6145550142',
  company: 'Brightside',
  category: 'Client',
};

describe('formatPhoneNumber', () => {
  it('progressively formats digits into a US phone number', () => {
    expect(formatPhoneNumber('61')).toBe('61');
    expect(formatPhoneNumber('614')).toBe('614');
    expect(formatPhoneNumber('614555')).toBe('(614) 555');
    expect(formatPhoneNumber('6145550142')).toBe('(614) 555-0142');
  });

  it('strips non-digits and caps at 10 digits', () => {
    expect(formatPhoneNumber('(614) 555-0142 x99')).toBe('(614) 555-0142');
    expect(getPhoneDigits('(614) 555-0142')).toBe('6145550142');
  });
});

describe('validateContact', () => {
  it('accepts and normalizes a valid contact', () => {
    const result = validateContact(validInput);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
    expect(result.values.email).toBe('jordan@example.com');
    expect(result.values.phone).toBe('(614) 555-0142');
  });

  it('flags missing required fields', () => {
    const result = validateContact({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      category: '',
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.firstName).toBeDefined();
    expect(result.errors.email).toBe('Email is required.');
    expect(result.errors.phone).toBe('Phone number is required.');
  });

  it('rejects malformed email and short phone numbers', () => {
    const result = validateContact({ ...validInput, email: 'nope', phone: '614555' });

    expect(result.errors.email).toBe('Enter a valid email address.');
    expect(result.errors.phone).toBe(
      'Phone number must include a 10-digit number with area code.',
    );
  });
});
