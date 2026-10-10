import { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  GraduationCap,
  User,
  FileText,
  CreditCard,
  Search,
  Upload,
  Phone,
  Mail,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { validatePersonalInfo, validateAcademicInfo, validateApplicantOrigin, getFieldError, type ValidationError } from '../../utils/validation';
import { useSubmitApplication } from '../../services/apiHooks';
import { NIGERIAN_STATES, getLgas } from '../../data/nigeriaLGAs';
import { uploadApplicationDocument, fetchApplyPrograms } from '../../services/api';
import { useAuth } from '../../contexts/useAuth';

// Step configuration
const STEPS = [
  { id: 1, name: 'Student Type', icon: User },
  { id: 2, name: 'Select Program', icon: GraduationCap },
  { id: 3, name: 'Personal Info', icon: FileText },
  { id: 4, name: 'Academic Info', icon: FileText },
  { id: 5, name: 'Documents', icon: Upload },
  { id: 6, name: 'Review & Pay', icon: CreditCard },
];

// Student types
const studentTypes = [
  {
    type: 'LOCAL',
    title: 'Nigerian Student',
    description: 'For Nigerian citizens and permanent residents',
    fee: '₦10,000',
    color: 'green'
  },
  {
    type: 'INTL',
    title: 'International Student',
    description: 'For non-Nigerian citizens from any country',
    fee: '$50 USD',
    color: 'blue'
  }
];

// Program levels
const programLevels = [
  { id: 'UG', name: 'Undergraduate', description: 'Bachelor degrees' },
  { id: 'PG', name: 'Masters', description: 'Postgraduate degrees' },
  { id: 'PHD', name: 'PhD', description: 'Doctoral programs' },
  { id: 'CERT', name: 'Certificate', description: 'Professional courses' }
];

interface ApplyProgram {
  id: number;
  title: string;
  level: 'UG' | 'PG' | 'PHD' | 'CERT';
  duration: string;
  college?: string;
  feeLocal: number;
  feeIntl: number;
}

const LEVEL_TO_TAB: Record<string, 'UG' | 'PG' | 'PHD' | 'CERT'> = {
  undergraduate: 'UG',
  masters: 'PG',
  professional: 'PG',
  phd: 'PHD',
  certificate: 'CERT',
};

// Document requirements
const requiredDocuments = [
  { name: 'Passport Photograph', required: true },
  { name: 'Birth Certificate', required: true },
  { name: 'Academic Transcripts', required: true },
  { name: 'Certificate of Origin', required: true },
  { name: 'English Proficiency (INTL)', required: false },
  { name: 'Reference Letters', required: false }
];

// Step 1: Student Type Selector
const StudentTypeStep = ({ selected, onSelect }: { selected: string | null, onSelect: (type: string) => void }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Select Your Student Type</h2>
    <p className="text-gray-600">This determines your application fee and requirements</p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {studentTypes.map((type) => (
        <button
          key={type.type}
          onClick={() => onSelect(type.type)}
          className={`p-6 border-2 text-left transition-all ${ selected === type.type ? 'border-primary-600 bg-primary-600/5' : 'border-gray-200 hover:border-gray-300' }`}
        >
          <div className="text-3xl mb-3">{type.type === 'LOCAL' ? '🇳🇬' : '🌍'}</div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{type.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{type.description}</p>
          <div className="text-sm font-semibold text-ink-900">
            Application Fee: {type.fee}
          </div>
        </button>
      ))}
    </div>
  </div>
);

// Step 2: Program Selector
const ProgramStep = ({ 
  programs,
  loading,
  studentType, 
  selected, 
  onSelect 
}: { 
  programs: ApplyProgram[],
  loading?: boolean,
  studentType: string | null, 
  selected: ApplyProgram | null, 
  onSelect: (program: ApplyProgram) => void 
}) => {
  const [level, setLevel] = useState('UG');
  const [search, setSearch] = useState('');
  
  const filteredPrograms = programs.filter(p => 
    p.level === level && 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Select Your Program</h2>
      <p className="text-gray-600">
        {studentType === 'INTL' ? 'International students: Check program-specific requirements' : 'Choose from our accredited programs'}
      </p>

      {/* Level Tabs */}
      <div className="flex flex-wrap gap-2">
        {programLevels.map(l => (
          <button
            key={l.id}
            onClick={() => setLevel(l.id)}
            className={`px-4 py-2 text-sm font-medium transition-all ${ level === l.id ? 'bg-ink-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200' }`}
          >
            {l.name}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search programs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border focus:outline-none focus:ring-2 focus:ring-primary-600"
        />
      </div>

      {/* Programs List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {loading && (
          <p className="text-sm text-gray-500 py-6 text-center">Loading programs…</p>
        )}
        {!loading && filteredPrograms.length === 0 && (
          <p className="text-sm text-gray-500 py-6 text-center">
            No programs are currently open for this level.
          </p>
        )}
        {filteredPrograms.map((program) => (
          <button
            key={program.id}
            onClick={() => onSelect(program)}
            className={`w-full text-left p-4 border-2 transition-all ${ selected?.id === program.id ? 'border-primary-600 bg-primary-600/5' : 'border-gray-200 hover:border-gray-300' }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{program.title}</h3>
                <p className="text-sm text-gray-500">{program.college || 'Direct Entry'}</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span>⏱️ {program.duration}</span>
                  <span>💰 {studentType === 'INTL' ? `$${program.feeIntl}` : `₦${program.feeLocal.toLocaleString()}`}</span>
                </div>
              </div>
              {selected?.id === program.id && (
                <CheckCircle className="text-primary-600 w-6 h-6" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Step 3: Personal Info
interface PersonalInfoForm {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  address?: string;
  country?: string;
  originState?: string;
  lga?: string;
}

const PersonalInfoStep = ({ 
  data, 
  studentType,
  onChange,
  errors,
  touched 
}: { 
  data: PersonalInfoForm, 
  studentType: string | null,
  onChange: (field: string, value: string) => void,
  errors: ValidationError[],
  touched: Record<string, boolean>
}) => {
  const getError = (field: string) => touched[field] ? getFieldError(errors, field) : null;
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
      <p className="text-gray-600">Enter your personal details as they appear on official documents</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
          <input
            type="text"
            value={data.firstName || ''}
            onChange={(e) => onChange('firstName', e.target.value)}
            className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-primary-600 ${ getError('firstName') ? 'border-red-500' : '' }`}
            placeholder="Enter first name"
            aria-invalid={!!getError('firstName')}
            aria-describedby={getError('firstName') ? 'firstName-error' : undefined}
          />
          {getError('firstName') && (
            <p id="firstName-error" className="mt-1 text-sm text-red-600">{getError('firstName')}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
          <input
            type="text"
            value={data.lastName || ''}
            onChange={(e) => onChange('lastName', e.target.value)}
            className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-primary-600 ${ getError('lastName') ? 'border-red-500' : '' }`}
            placeholder="Enter last name"
            aria-invalid={!!getError('lastName')}
            aria-describedby={getError('lastName') ? 'lastName-error' : undefined}
          />
          {getError('lastName') && (
            <p id="lastName-error" className="mt-1 text-sm text-red-600">{getError('lastName')}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-primary-600 ${ getError('email') ? 'border-red-500' : '' }`}
            placeholder="your@email.com"
            aria-invalid={!!getError('email')}
            aria-describedby={getError('email') ? 'email-error' : undefined}
          />
          {getError('email') && (
            <p id="email-error" className="mt-1 text-sm text-red-600">{getError('email')}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
          <input
            type="tel"
            value={data.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-primary-600 ${ getError('phone') ? 'border-red-500' : '' }`}
            placeholder="+234 XXX XXX XXXX"
            aria-invalid={!!getError('phone')}
            aria-describedby={getError('phone') ? 'phone-error' : undefined}
          />
          {getError('phone') && (
            <p id="phone-error" className="mt-1 text-sm text-red-600">{getError('phone')}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
          <input
            type="date"
            value={data.dob || ''}
            onChange={(e) => onChange('dob', e.target.value)}
            className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-primary-600 ${ getError('dob') ? 'border-red-500' : '' }`}
            aria-invalid={!!getError('dob')}
            aria-describedby={getError('dob') ? 'dob-error' : undefined}
          />
          {getError('dob') && (
            <p id="dob-error" className="mt-1 text-sm text-red-600">{getError('dob')}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
          <select
            value={data.gender || ''}
            onChange={(e) => onChange('gender', e.target.value)}
            className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-primary-600 ${ getError('gender') ? 'border-red-500' : '' }`}
            aria-invalid={!!getError('gender')}
            aria-describedby={getError('gender') ? 'gender-error' : undefined}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {getError('gender') && (
            <p id="gender-error" className="mt-1 text-sm text-red-600">{getError('gender')}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
        <textarea
          value={data.address || ''}
          onChange={(e) => onChange('address', e.target.value)}
          className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-primary-600 ${ getError('address') ? 'border-red-500' : '' }`}
          rows={3}
          placeholder="Enter your current address"
          aria-invalid={!!getError('address')}
          aria-describedby={getError('address') ? 'address-error' : undefined}
        />
        {getError('address') && (
          <p id="address-error" className="mt-1 text-sm text-red-600">{getError('address')}</p>
        )}
      </div>

      {/* Nationality & Origin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {studentType === 'INTL' ? 'Country *' : 'Country'}
          </label>
          {studentType === 'INTL' ? (
            <input
              type="text"
              value={data.country || ''}
              onChange={(e) => onChange('country', e.target.value)}
              className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-primary-600 ${ getError('country') ? 'border-red-500' : '' }`}
              placeholder="e.g. Ghana, United Kingdom"
              aria-invalid={!!getError('country')}
            />
          ) : (
            <input
              type="text"
              value="Nigeria"
              readOnly
              className="w-full px-4 py-3 border bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          )}
          {getError('country') && (
            <p className="mt-1 text-sm text-red-600">{getError('country')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {studentType === 'INTL' ? 'State / Province *' : 'State of Origin *'}
          </label>
          {studentType === 'INTL' ? (
            <input
              type="text"
              value={data.originState || ''}
              onChange={(e) => onChange('originState', e.target.value)}
              className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-primary-600 ${ getError('originState') ? 'border-red-500' : '' }`}
              placeholder="e.g. Greater Accra, England"
              aria-invalid={!!getError('originState')}
            />
          ) : (
            <select
              value={data.originState || ''}
              onChange={(e) => { onChange('originState', e.target.value); onChange('lga', ''); }}
              className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-primary-600 ${ getError('originState') ? 'border-red-500' : '' }`}
              aria-invalid={!!getError('originState')}
            >
              <option value="">Select state of origin</option>
              {NIGERIAN_STATES.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          )}
          {getError('originState') && (
            <p className="mt-1 text-sm text-red-600">{getError('originState')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {studentType === 'INTL' ? 'County / Region' : 'Local Government Area *'}
          </label>
          {studentType === 'INTL' ? (
            <input
              type="text"
              value={data.lga || ''}
              onChange={(e) => onChange('lga', e.target.value)}
              className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-primary-600 ${ getError('lga') ? 'border-red-500' : '' }`}
              placeholder="e.g. Devon, Ontario (optional)"
              aria-invalid={!!getError('lga')}
            />
          ) : (
            <select
              value={data.lga || ''}
              onChange={(e) => onChange('lga', e.target.value)}
              disabled={!data.originState}
              className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-primary-600 disabled:bg-gray-100 disabled:cursor-not-allowed ${ getError('lga') ? 'border-red-500' : '' }`}
              aria-invalid={!!getError('lga')}
            >
              <option value="">{data.originState ? 'Select your LGA' : 'Select state of origin first'}</option>
              {getLgas(data.originState || '').map((lga) => (
                <option key={lga} value={lga}>{lga}</option>
              ))}
            </select>
          )}
          {getError('lga') && (
            <p className="mt-1 text-sm text-red-600">{getError('lga')}</p>
          )}
        </div>
      </div>

      {studentType === 'LOCAL' && data.originState && (
        <p className={`text-sm ${ data.originState === 'Bayelsa' ? 'text-green-700' : 'text-gray-600' }`}>
          {data.originState === 'Bayelsa'
            ? 'Classified as a Bayelsa State indigene.'
            : 'Classified as a non-indigene (state of origin is not Bayelsa).'}
        </p>
      )}
    </div>
  );
};

// Academic type constants
const ACADEMIC_TYPES = [
  { value: 'ssce', label: 'SSCE/WAEC/NECO' },
  { value: 'bsc', label: "Bachelor's Degree" },
  { value: 'msc', label: "Master's Degree" },
  { value: 'other', label: 'Other' },
];

const SSCE_GRADES = ['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'];

const DEGREE_GRADES = [
  { value: 'first', label: 'First Class' },
  { value: 'second_upper', label: 'Second Class Upper' },
  { value: 'second_lower', label: 'Second Class Lower' },
  { value: 'third', label: 'Third Class' },
  { value: 'pass', label: 'Pass' },
  { value: 'distinction', label: 'Distinction' },
  { value: 'merit', label: 'Merit' },
];

// Step 4: Academic Info
interface AcademicRecordForm {
  institution: string;
  qualification: string;
  gradYear: string;
  grade: string;
  subjects: { subject: string; grade: string }[];
}

const AcademicInfoStep = ({ 
  data, 
  onChange,
  errors,
  touched 
}: { 
  data: AcademicRecordForm[], 
  onChange: (field: string, value: AcademicRecordForm[]) => void,
  errors: ValidationError[],
  touched: Record<string, boolean>
}) => {
  const getError = (field: string) => touched[field] ? getFieldError(errors, field) : null;

  const addRecord = () => {
    onChange('academicRecords', [...data, { institution: '', qualification: '', gradYear: '', grade: '', subjects: [{ subject: '', grade: '' }] }]);
  };

  const removeRecord = (index: number) => {
    onChange('academicRecords', data.filter((_, i) => i !== index));
  };

  const updateRecord = (index: number, field: string, value: string) => {
    const updated = [...data];
    if (field === 'qualification') {
      updated[index] = { ...updated[index], qualification: value, grade: '', subjects: [{ subject: '', grade: '' }] };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    onChange('academicRecords', updated);
  };

  const addSubject = (recordIndex: number) => {
    const updated = [...data];
    updated[recordIndex].subjects.push({ subject: '', grade: '' });
    onChange('academicRecords', updated);
  };

  const removeSubject = (recordIndex: number, subjectIndex: number) => {
    const updated = [...data];
    updated[recordIndex].subjects = updated[recordIndex].subjects.filter((_, i) => i !== subjectIndex);
    onChange('academicRecords', updated);
  };

  const updateSubject = (recordIndex: number, subjectIndex: number, field: string, value: string) => {
    const updated = [...data];
    updated[recordIndex].subjects[subjectIndex] = { ...updated[recordIndex].subjects[subjectIndex], [field]: value };
    onChange('academicRecords', updated);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Academic Information</h2>
        <p className="text-gray-600">Provide your academic background and qualifications</p>
      </div>

      {data.map((record, index) => (
        <div key={index} className="border-2 border-gray-200 p-6 space-y-4 relative">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-800">Record {index + 1}</h3>
            {data.length > 1 && (
              <button
                type="button"
                onClick={() => removeRecord(index)}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Previous Institution *</label>
              <input
                type="text"
                value={record.institution}
                onChange={(e) => updateRecord(index, 'institution', e.target.value)}
                className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-primary-600 ${ getError(`academicRecords.${index}.institution`) ? 'border-red-500' : '' }`}
                placeholder="Name of school/university"
              />
              {getError(`academicRecords.${index}.institution`) && (
                <p className="mt-1 text-sm text-red-600">{getError(`academicRecords.${index}.institution`)}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualification *</label>
              <select
                value={record.qualification}
                onChange={(e) => updateRecord(index, 'qualification', e.target.value)}
                className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-primary-600 ${ getError(`academicRecords.${index}.qualification`) ? 'border-red-500' : '' }`}
              >
                <option value="">Select qualification</option>
                {ACADEMIC_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              {getError(`academicRecords.${index}.qualification`) && (
                <p className="mt-1 text-sm text-red-600">{getError(`academicRecords.${index}.qualification`)}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year of Graduation *</label>
              <input
                type="number"
                value={record.gradYear}
                onChange={(e) => updateRecord(index, 'gradYear', e.target.value)}
                className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-primary-600 ${ getError(`academicRecords.${index}.gradYear`) ? 'border-red-500' : '' }`}
                placeholder="YYYY"
              />
              {getError(`academicRecords.${index}.gradYear`) && (
                <p className="mt-1 text-sm text-red-600">{getError(`academicRecords.${index}.gradYear`)}</p>
              )}
            </div>
          </div>

          {record.qualification === 'ssce' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Subjects & Grades</label>
                <button
                  type="button"
                  onClick={() => addSubject(index)}
                  className="text-sm text-primary-600 hover:underline"
                >
                  + Add Subject
                </button>
              </div>
              {getError(`academicRecords.${index}.subjects`) && (
                <p className="text-sm text-red-600">{getError(`academicRecords.${index}.subjects`)}</p>
              )}
              <div className="space-y-2">
                {record.subjects.map((subj, sIdx) => (
                  <div key={sIdx} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={subj.subject}
                        onChange={(e) => updateSubject(index, sIdx, 'subject', e.target.value)}
                        className={`w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-primary-600 ${ getError(`academicRecords.${index}.subjects.${sIdx}.subject`) ? 'border-red-500' : '' }`}
                        placeholder="Subject name"
                      />
                      {getError(`academicRecords.${index}.subjects.${sIdx}.subject`) && (
                        <p className="mt-1 text-sm text-red-600">{getError(`academicRecords.${index}.subjects.${sIdx}.subject`)}</p>
                      )}
                    </div>
                    <div className="w-28">
                      <select
                        value={subj.grade}
                        onChange={(e) => updateSubject(index, sIdx, 'grade', e.target.value)}
                        className={`w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-primary-600 ${ getError(`academicRecords.${index}.subjects.${sIdx}.grade`) ? 'border-red-500' : '' }`}
                      >
                        <option value="">Grade</option>
                        {SSCE_GRADES.map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                      {getError(`academicRecords.${index}.subjects.${sIdx}.grade`) && (
                        <p className="mt-1 text-sm text-red-600">{getError(`academicRecords.${index}.subjects.${sIdx}.grade`)}</p>
                      )}
                    </div>
                    {record.subjects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSubject(index, sIdx)}
                        className="text-red-500 hover:text-red-700 p-2 mt-1"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {record.qualification && record.qualification !== 'ssce' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade/Class *</label>
              <select
                value={record.grade}
                onChange={(e) => updateRecord(index, 'grade', e.target.value)}
                className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-primary-600 ${ getError(`academicRecords.${index}.grade`) ? 'border-red-500' : '' }`}
              >
                <option value="">Select grade</option>
                {DEGREE_GRADES.map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
              {getError(`academicRecords.${index}.grade`) && (
                <p className="mt-1 text-sm text-red-600">{getError(`academicRecords.${index}.grade`)}</p>
              )}
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addRecord}
        className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 hover:border-primary-600 hover:text-primary-600 transition font-medium"
      >
        + Add Another Academic Record
      </button>
    </div>
  );
};

const DOCUMENT_TYPE_MAP: Record<string, string> = {
  'Passport Photograph': 'passport_photo',
  'Birth Certificate': 'birth_certificate',
  'Academic Transcripts': 'academic_transcripts',
  'Certificate of Origin': 'certificate_of_origin',
  'English Proficiency (INTL)': 'english_proficiency',
  'Reference Letters': 'reference_letters',
};

// Step 5: Documents
const DocumentsStep = ({
  files,
  onFileSelect,
}: {
  files: Record<string, File>;
  onFileSelect: (docName: string, file: File | null) => void;
}) => {
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Upload Documents</h2>
      <p className="text-gray-600">Upload all required documents for your application</p>

      <div className="space-y-3">
        {requiredDocuments.map((doc) => {
          const hasFile = !!files[doc.name];
          return (
            <div
              key={doc.name}
              className={`flex items-center justify-between p-4 border-2 ${hasFile ? 'border-primary-600 bg-primary-600/5' : 'border-gray-200'}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 flex items-center justify-center shrink-0 ${hasFile ? 'bg-primary-600/20' : 'bg-gray-100'}`}>
                  {hasFile ? (
                    <CheckCircle className="w-5 h-5 text-primary-600" />
                  ) : (
                    <FileText className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className="text-sm text-gray-500">
                    {doc.required ? 'Required' : 'Optional'}
                  </p>
                  {hasFile && (
                    <p className="text-xs text-gray-400 truncate max-w-[200px]">{files[doc.name].name}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  ref={(el) => { fileInputRefs.current[doc.name] = el; }}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    onFileSelect(doc.name, file);
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRefs.current[doc.name]?.click()}
                  className={`px-4 py-2 text-sm font-medium transition-all ${hasFile ? 'bg-primary-600/20 text-ink-900' : 'bg-ink-900 text-white hover:bg-ink-900/90'}`}
                >
                  {hasFile ? 'Change' : 'Upload'}
                </button>
                {hasFile && (
                  <button
                    type="button"
                    onClick={() => {
                      onFileSelect(doc.name, null);
                      if (fileInputRefs.current[doc.name]) {
                        fileInputRefs.current[doc.name]!.value = '';
                      }
                    }}
                    className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-yellow-50 p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> All documents must be clear and legible. Accepted formats: PDF, JPG, PNG (max 5MB each)
        </p>
      </div>
    </div>
  );
};

// Step 6: Review & Pay
const ReviewPayStep = ({ 
  data, 
  onSubmit,
  isSubmitting,
  submitError
}: { 
  data: { studentType: string | null, program: ApplyProgram | null, personal: PersonalInfoForm },
  onSubmit: () => void,
  isSubmitting?: boolean,
  submitError?: string | null
}) => {
  const fee = data.studentType === 'INTL' 
    ? `$${data.program?.feeIntl || 50}` 
    : `₦${(data.program?.feeLocal || 10000).toLocaleString()}`;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Review & Payment</h2>
      <p className="text-gray-600">Review your application details before payment</p>
      
      {/* Summary */}
      <div className="bg-gray-50 p-6 space-y-4">
        <div className="flex justify-between items-center pb-4 border-b">
          <span className="text-gray-600">Student Type</span>
          <span className="font-medium">{data.studentType === 'LOCAL' ? 'Nigerian Student' : 'International Student'}</span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b">
          <span className="text-gray-600">Selected Program</span>
          <span className="font-medium text-right">{data.program?.title}</span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b">
          <span className="text-gray-600">Applicant Name</span>
          <span className="font-medium">{data.personal.firstName} {data.personal.lastName}</span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b">
          <span className="text-gray-600">Email</span>
          <span className="font-medium">{data.personal.email}</span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b">
          <span className="text-gray-600">{data.studentType === 'INTL' ? 'Country' : 'State of Origin'}</span>
          <span className="font-medium text-right">
            {data.studentType === 'INTL' ? data.personal.country : data.personal.originState}
          </span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b">
          <span className="text-gray-600">{data.studentType === 'INTL' ? 'State / County' : 'Local Government Area'}</span>
          <span className="font-medium text-right">{data.personal.lga}</span>
        </div>
        {data.studentType === 'LOCAL' && (
          <div className="flex justify-between items-center pb-4 border-b">
            <span className="text-gray-600">Indigene Status</span>
            <span className="font-medium">
              {data.personal.originState === 'Bayelsa' ? 'Indigene' : 'Non-indigene'}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center pt-2">
          <span className="text-lg font-semibold">Application Fee</span>
          <span className="text-2xl font-bold text-ink-900">{fee}</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 border-2 border-primary-600 bg-primary-600/5 text-left">
            <div className="font-medium">Paystack</div>
            <div className="text-sm text-gray-500">Card, Bank Transfer, USSD</div>
          </button>
          <button className="p-4 border-2 border-gray-200 hover:border-gray-300 text-left">
            <div className="font-medium">Bank Deposit</div>
            <div className="text-sm text-gray-500">Pay at any bank branch</div>
          </button>
        </div>
      </div>

      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          {submitError}
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full py-4 bg-ink-900 text-white font-bold hover:bg-ink-900/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          `Pay ${fee} & Submit Application`
        )}
      </button>
      
      <p className="text-center text-sm text-gray-500">
        By submitting, you agree to our terms and conditions
      </p>
    </div>
  );
};

const DRAFT_KEY = 'bmu_application_draft';

interface ApplicationFormData {
  studentType: string | null;
  program: ApplyProgram | null;
  personal: PersonalInfoForm;
  academicRecords: AcademicRecordForm[];
  documents: Record<string, File>;
}

function loadDraft(): ApplicationFormData | null {
  try {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Don't restore File objects (can't be serialized)
      return { ...parsed, documents: {} } as ApplicationFormData;
    }
  } catch {
    // corrupted draft in storage — ignore and start fresh
  }
  return null;
}

function saveDraft(data: ApplicationFormData) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data, (key, value) => (key === 'documents' ? undefined : value)));
  } catch {
    // storage unavailable (private mode / quota) — draft saving is best-effort
  }
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

export const ApplicationPortal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const submitApplication = useSubmitApplication();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [programs, setPrograms] = useState<ApplyProgram[]>([]);
  const [programsLoading, setProgramsLoading] = useState(true);
  const savedDraft = loadDraft();
  const [formData, setFormData] = useState<ApplicationFormData>(() => savedDraft || {
    studentType: null,
    program: null,
    personal: {},
    academicRecords: [],
    documents: {}
  });

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  // Load the programs that are currently open for applications.
  useEffect(() => {
    let active = true;
    fetchApplyPrograms()
      .then((rows) => {
        if (!active) return;
        const mapped: ApplyProgram[] = rows.map((p) => ({
          id: p.id,
          title: p.title,
          level: LEVEL_TO_TAB[p.level] || 'UG',
          duration: p.duration,
          college: p.college_name || undefined,
          feeLocal: p.application_fee_local,
          feeIntl: p.application_fee_intl,
        }));
        setPrograms(mapped);
        // Drop a saved draft's program if it is no longer open.
        setFormData((prev) =>
          prev.program && !mapped.some((p) => p.id === prev.program!.id)
            ? { ...prev, program: null }
            : prev
        );
      })
      .finally(() => {
        if (active) setProgramsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (user && (user.first_name || user.last_name || user.email || user.phone)) {
      setFormData((prev: typeof formData) => ({
        ...prev,
        personal: {
          ...prev.personal,
          firstName: prev.personal.firstName || user.first_name || '',
          lastName: prev.personal.lastName || user.last_name || '',
          email: prev.personal.email || user.email || '',
          phone: prev.personal.phone || user.phone || '',
        },
      }));
    }
  }, [user]);

  // Auto-save draft on form data change
  useEffect(() => {
    if (formData.personal.firstName || formData.academicRecords.length > 0) {
      saveDraft(formData);
    }
  }, [formData]);

  const validateStep = (step: number): boolean => {
    let stepErrors: ValidationError[] = [];
    
    switch (step) {
      case 3:
        stepErrors = [
          ...validatePersonalInfo(formData.personal),
          ...validateApplicantOrigin(formData.personal, formData.studentType),
        ];
        break;
      case 4:
        stepErrors = validateAcademicInfo(formData.academicRecords);
        break;
    }
    
    setErrors(stepErrors);
    
    // Mark all fields as touched when trying to proceed
    if (stepErrors.length > 0) {
      const newTouched: Record<string, boolean> = {};
      stepErrors.forEach(error => {
        newTouched[error.field] = true;
      });
      setTouched(prev => ({ ...prev, ...newTouched }));
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    // Validate current step before proceeding
    if (currentStep === 3 || currentStep === 4) {
      if (!validateStep(currentStep)) {
        return;
      }
    }
    
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      setErrors([]);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const academicRecordsPayload = formData.academicRecords.map((r: AcademicRecordForm) => ({
        institution: r.institution,
        qualification: r.qualification,
        year_of_completion: parseInt(r.gradYear),
        grade: r.qualification === 'ssce' ? '' : (r.grade || ''),
        subjects: r.qualification === 'ssce' ? (r.subjects || []).filter(s => s.subject && s.grade).map(s => ({ subject: s.subject, grade: s.grade })) : undefined,
      }));
      const result = await submitApplication.mutateAsync({
        first_name: formData.personal.firstName || '',
        last_name: formData.personal.lastName || '',
        email: formData.personal.email || '',
        phone: formData.personal.phone || '',
        date_of_birth: formData.personal.dob || '',
        gender: formData.personal.gender || '',
        address: formData.personal.address || '',
        nationality: formData.studentType === 'INTL' ? (formData.personal.country || '') : 'Nigeria',
        state_of_origin: formData.personal.originState || '',
        lga: formData.personal.lga || '',
        program_id: formData.program?.id || 0,
        student_type: formData.studentType || '',
        academic_records: academicRecordsPayload,
      });

      // Upload documents after application is created.
      // public_id (UUID) is required — the sequential ID is not accepted
      // by the public upload/status endpoints.
      const appKey = result.public_id || result.id;
      const uploadPromises = Object.entries(formData.documents).map(async ([docName, file]) => {
        const docType = DOCUMENT_TYPE_MAP[docName];
        if (docType && file instanceof File) {
          return uploadApplicationDocument(appKey, docType, file);
        }
      });
      await Promise.all(uploadPromises);

      clearDraft();
      navigate(`/apply/status/${appKey}`);
    } catch {
      setSubmitError('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!formData.studentType;
      case 2: return !!formData.program;
      case 3: return !!(formData.personal.firstName && formData.personal.lastName && formData.personal.email)
        && !!formData.personal.originState
        && !!(formData.studentType === 'INTL' ? formData.personal.country : formData.personal.lga);
      case 4: return formData.academicRecords.length > 0 && formData.academicRecords.some(r => r.institution && r.qualification);
      case 5: {
        const requiredDocNames = requiredDocuments.filter(d => d.required).map(d => d.name);
        return requiredDocNames.every(name => formData.documents[name] instanceof File);
      }
      default: return true;
    }
  };

  return (
    <>
      <Helmet>
        <title>Application Portal | Bayelsa Medical University</title>
        <meta name="description" content="Complete your application to Bayelsa Medical University. Multi-step application form for undergraduate, postgraduate, and professional programs." />
      </Helmet>

      <div className="bg-gray-50 min-h-screen pt-[180px] pb-12">
        <div className="container-custom max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-ink-900 mb-2">
              Apply to Bayelsa Medical University
            </h1>
            <p className="text-gray-600">
              Complete your application in {STEPS.length} easy steps
            </p>
          </div>

          {/* Progress Bar */}
          <div className="bg-white shadow-sm p-4 mb-8">
            <div className="flex justify-between mb-2">
              {STEPS.map((step) => (
                <div 
                  key={step.id}
                  className={`text-center flex-1 ${currentStep >= step.id ? 'text-primary-600' : 'text-gray-400'}`}
                >
                  <div className={`w-10 h-10 mx-auto flex items-center justify-center transition-all ${ currentStep > step.id ? 'bg-primary-600 text-white' : currentStep === step.id ? 'bg-ink-900 text-white ring-4 ring-ink-900/20' : 'bg-gray-200 text-gray-500' }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="text-xs mt-2 hidden md:block font-medium">{step.name}</div>
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 h-2">
              <div 
                className="bg-primary-600 h-2 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white shadow-sm p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 1 && (
                  <StudentTypeStep 
                    selected={formData.studentType} 
                    onSelect={(type) => {
                      setFormData({ ...formData, studentType: type });
                      setTimeout(handleNext, 300);
                    }} 
                  />
                )}
                
                {currentStep === 2 && (
                  <ProgramStep 
                    programs={programs}
                    loading={programsLoading}
                    studentType={formData.studentType}
                    selected={formData.program}
                    onSelect={(program) => {
                      setFormData({ ...formData, program });
                    }}
                  />
                )}
                
                {currentStep === 3 && (
                  <PersonalInfoStep 
                    data={formData.personal}
                    studentType={formData.studentType}
                    onChange={(field, value) => {
                      setFormData(prev => ({
                        ...prev,
                        personal: { ...prev.personal, [field]: value },
                      }));
                      // Mark field as touched
                      setTouched(prev => ({ ...prev, [field]: true }));
                    }}
                    errors={errors}
                    touched={touched}
                  />
                )}
                
                {currentStep === 4 && (
                  <AcademicInfoStep 
                    data={formData.academicRecords}
                    onChange={(_field, value) => {
                      setFormData({ 
                        ...formData, 
                        academicRecords: value 
                      });
                      // Mark all relevant fields as touched
                      if (Array.isArray(value)) {
                        const newTouched: Record<string, boolean> = {};
                        value.forEach((_, idx) => {
                          newTouched[`academicRecords.${idx}.institution`] = true;
                          newTouched[`academicRecords.${idx}.qualification`] = true;
                          newTouched[`academicRecords.${idx}.gradYear`] = true;
                        });
                        setTouched(prev => ({ ...prev, ...newTouched }));
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                )}
                
                {currentStep === 5 && (
                  <DocumentsStep 
                    files={formData.documents}
                    onFileSelect={(docName, file) => {
                      setFormData({
                        ...formData,
                        documents: file
                          ? { ...formData.documents, [docName]: file }
                          : Object.fromEntries(
                              Object.entries(formData.documents).filter(([k]) => k !== docName)
                            ),
                      });
                    }}
                  />
                )}
                
                {currentStep === 6 && (
                  <ReviewPayStep 
                    data={formData}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    submitError={submitError}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            {currentStep < 6 && (
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-6 py-3 font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 px-6 py-3 font-medium bg-ink-900 text-white hover:bg-ink-900/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Help Section */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p className="mb-2">Need help with your application?</p>
            <div className="flex justify-center gap-4">
              <a href="tel:+2348031110020" className="flex items-center gap-1 text-ink-900 hover:underline">
                <Phone className="w-4 h-4" />
                +234 803 111 0020
              </a>
              <a href="mailto:admissions@bmu.edu.ng" className="flex items-center gap-1 text-ink-900 hover:underline">
                <Mail className="w-4 h-4" />
                admissions@bmu.edu.ng
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

