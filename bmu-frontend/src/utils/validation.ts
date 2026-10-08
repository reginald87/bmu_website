export interface ValidationError {
  field: string;
  message: string;
}

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

export const validatePhone = (phone: string): string | null => {
  const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
  if (!phone) return 'Phone number is required';
  if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
  return null;
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim() === '') return `${fieldName} is required`;
  return null;
};

export const validateDateOfBirth = (dob: string): string | null => {
  if (!dob) return 'Date of birth is required';
  const birthDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  if (age < 16) return 'You must be at least 16 years old';
  if (age > 100) return 'Please enter a valid date of birth';
  return null;
};

export const validatePersonalInfo = (data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  address?: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  const firstNameError = validateRequired(data.firstName || '', 'First name');
  if (firstNameError) errors.push({ field: 'firstName', message: firstNameError });

  const lastNameError = validateRequired(data.lastName || '', 'Last name');
  if (lastNameError) errors.push({ field: 'lastName', message: lastNameError });

  const emailError = validateEmail(data.email || '');
  if (emailError) errors.push({ field: 'email', message: emailError });

  const phoneError = validatePhone(data.phone || '');
  if (phoneError) errors.push({ field: 'phone', message: phoneError });

  const dobError = validateDateOfBirth(data.dob || '');
  if (dobError) errors.push({ field: 'dob', message: dobError });

  const genderError = validateRequired(data.gender || '', 'Gender');
  if (genderError) errors.push({ field: 'gender', message: genderError });

  const addressError = validateRequired(data.address || '', 'Address');
  if (addressError) errors.push({ field: 'address', message: addressError });

  return errors;
};

interface AcademicRecordInput {
  institution?: string;
  qualification?: string;
  gradYear?: string | number;
  grade?: string;
  subjects?: { subject?: string; grade?: string }[];
}

export function validateAcademicInfo(records: AcademicRecordInput[]): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!records || records.length === 0) {
    errors.push({ field: 'academicRecords', message: 'At least one academic record is required' });
    return errors;
  }

  records.forEach((record, idx) => {
    const prefix = `academicRecords.${idx}`;

    const institutionError = validateRequired(record.institution || '', 'Previous institution');
    if (institutionError) errors.push({ field: `${prefix}.institution`, message: institutionError });

    const qualError = validateRequired(record.qualification || '', 'Qualification');
    if (qualError) errors.push({ field: `${prefix}.qualification`, message: qualError });

    if (record.gradYear) {
      const year = parseInt(String(record.gradYear));
      const curYear = new Date().getFullYear();
      if (isNaN(year) || year < 1970 || year > curYear + 5) {
        errors.push({ field: `${prefix}.gradYear`, message: `Enter a valid year between 1970 and ${curYear + 5}` });
      }
    } else {
      errors.push({ field: `${prefix}.gradYear`, message: 'Year of graduation is required' });
    }

    if (record.qualification === 'ssce') {
      const subjects = record.subjects || [];
      if (subjects.length === 0) {
        errors.push({ field: `${prefix}.subjects`, message: 'At least one subject is required for SSCE' });
      } else {
        subjects.forEach((s, sIdx) => {
          if (!s.subject?.trim()) {
            errors.push({ field: `${prefix}.subjects.${sIdx}.subject`, message: 'Subject name is required' });
          }
          if (!s.grade) {
            errors.push({ field: `${prefix}.subjects.${sIdx}.grade`, message: 'Grade is required' });
          }
        });
      }
    } else if (record.qualification) {
      if (!record.grade) {
        errors.push({ field: `${prefix}.grade`, message: 'Grade/Class is required' });
      }
    }
  });

  return errors;
}

export const getFieldError = (errors: ValidationError[], field: string): string | null => {
  const error = errors.find(e => e.field === field);
  return error ? error.message : null;
};
