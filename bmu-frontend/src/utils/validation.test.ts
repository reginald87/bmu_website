import { describe, expect, it } from 'vitest'
import {
  getFieldError,
  validateAcademicInfo,
  validateEmail,
  validatePersonalInfo,
  validatePhone,
  validateRequired,
} from './validation'

describe('validateEmail', () => {
  it('rejects empty input', () => {
    expect(validateEmail('')).toBe('Email is required')
  })

  it('rejects malformed addresses', () => {
    expect(validateEmail('not-an-email')).toBe('Please enter a valid email address')
    expect(validateEmail('a@b')).toBe('Please enter a valid email address')
  })

  it('accepts valid addresses', () => {
    expect(validateEmail('student@bmu.edu.ng')).toBeNull()
  })
})

describe('validatePhone', () => {
  it('requires a value', () => {
    expect(validatePhone('')).toBe('Phone number is required')
  })

  it('rejects values shorter than 10 digits', () => {
    expect(validatePhone('12345')).toBe('Please enter a valid phone number')
  })

  it('accepts international formats', () => {
    expect(validatePhone('+234 803 123 4567')).toBeNull()
    expect(validatePhone('(080) 3123-4567')).toBeNull()
  })
})

describe('validateRequired', () => {
  it('flags empty and whitespace-only values', () => {
    expect(validateRequired('', 'First name')).toBe('First name is required')
    expect(validateRequired('   ', 'First name')).toBe('First name is required')
  })

  it('passes for real values', () => {
    expect(validateRequired('Ada', 'First name')).toBeNull()
  })
})

describe('validatePersonalInfo', () => {
  it('collects an error per invalid field', () => {
    const errors = validatePersonalInfo({})
    const fields = errors.map((e) => e.field)
    expect(fields).toEqual(
      expect.arrayContaining(['firstName', 'lastName', 'email', 'phone', 'dob', 'gender', 'address']),
    )
  })

  it('returns no errors for complete valid input', () => {
    const errors = validatePersonalInfo({
      firstName: 'Ada',
      lastName: 'Okafor',
      email: 'ada@bmu.edu.ng',
      phone: '+2348031234567',
      dob: '2000-01-01',
      gender: 'female',
      address: 'Yenagoa, Bayelsa',
    })
    expect(errors).toEqual([])
  })
})

describe('validateAcademicInfo', () => {
  it('requires at least one record', () => {
    expect(validateAcademicInfo([])).toEqual([
      { field: 'academicRecords', message: 'At least one academic record is required' },
    ])
  })

  it('requires subjects for SSCE records', () => {
    const errors = validateAcademicInfo([
      { institution: 'BMU', qualification: 'ssce', gradYear: 2020, subjects: [] },
    ])
    expect(getFieldError(errors, 'academicRecords.0.subjects')).toBe('At least one subject is required for SSCE')
  })

  it('accepts a complete SSCE record', () => {
    const errors = validateAcademicInfo([
      {
        institution: 'BMU',
        qualification: 'ssce',
        gradYear: 2020,
        subjects: [{ subject: 'Biology', grade: 'A1' }],
      },
    ])
    expect(errors).toEqual([])
  })
})

describe('getFieldError', () => {
  it('returns the message for a known field and null otherwise', () => {
    const errors = [{ field: 'email', message: 'bad' }]
    expect(getFieldError(errors, 'email')).toBe('bad')
    expect(getFieldError(errors, 'phone')).toBeNull()
  })
})
