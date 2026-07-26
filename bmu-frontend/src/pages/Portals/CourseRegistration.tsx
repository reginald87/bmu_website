import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Plus, Trash2, CheckCircle, AlertCircle, Loader2, Search,
  Send, Download, Clock, Ban
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { registrationApi, type AvailableCourse, type CurrentRegistration } from '../../services/api';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  submitted: 'bg-blue-100 text-blue-700',
  advisor_approved: 'bg-yellow-100 text-yellow-700',
  hod_approved: 'bg-purple-100 text-purple-700',
  dean_approved: 'bg-indigo-100 text-indigo-700',
  registered: 'bg-green-100 text-green-700',
};

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  advisor_approved: 'Advisor Approved',
  hod_approved: 'HOD Approved',
  dean_approved: 'Dean Approved',
  registered: 'Registered',
};

const STEPS = [
  { key: 'draft', label: 'Draft' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'advisor_approved', label: 'Advisor' },
  { key: 'hod_approved', label: 'HOD' },
  { key: 'dean_approved', label: 'Dean' },
  { key: 'registered', label: 'Registered' },
];

export const CourseRegistration = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [availableCourses, setAvailableCourses] = useState<AvailableCourse[]>([]);
  const [registration, setRegistration] = useState<CurrentRegistration | null>(null);
  const [allRegistrations, setAllRegistrations] = useState<CurrentRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [semesterFilter, setSemesterFilter] = useState<'first' | 'second' | 'all'>('all');

  const loadData = useCallback(async () => {
    try {
      const [courses, reg, allRegs] = await Promise.all([
        registrationApi.getAvailableCourses(),
        registrationApi.getCurrent(),
        registrationApi.listAll(),
      ]);
      setAvailableCourses(courses);
      setRegistration(reg);
      setAllRegistrations(allRegs);
    } catch {
      toast.error('Failed to load registration data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const selectedCourseIds = new Set(
    (registration?.courses || []).map((c) => c.course_id)
  );

  const selectedCourses = availableCourses.filter((c) => c.is_selected || selectedCourseIds.has(c.id));
  const unselectedCourses = availableCourses.filter((c) => !c.is_selected && !selectedCourseIds.has(c.id));

  const filteredCourses = unselectedCourses.filter((c) => {
    if (semesterFilter !== 'all' && c.semester !== semesterFilter) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.code.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalUnits = registration?.total_credit_units ?? selectedCourses.reduce((s, c) => s + c.credit_units, 0);
  const maxUnits = 24;
  const canSubmit = registration?.status === 'draft' && selectedCourses.length > 0;

  const statusIndex = STEPS.findIndex((s) => s.key === registration?.status);
  const currentStepIndex = statusIndex >= 0 ? statusIndex : 0;

  const isEditable = registration?.status === 'draft';

  const handleAddCourse = async (courseId: number) => {
    setActionLoading(`add-${courseId}`);
    try {
      const res = await registrationApi.addCourse(courseId);
      toast.success(res.message);
      await loadData();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      toast.error(e?.response?.data?.detail || 'Failed to add course');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveCourse = async (courseId: number) => {
    setActionLoading(`remove-${courseId}`);
    try {
      const res = await registrationApi.removeCourse(courseId);
      toast.success(res.message);
      await loadData();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      toast.error(e?.response?.data?.detail || 'Failed to remove course');
    } finally {
      setActionLoading(null);
    }
  };

  const handleInit = async () => {
    setActionLoading('init');
    try {
      await registrationApi.init();
      toast.success('Registration started');
      await loadData();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      toast.error(e?.response?.data?.detail || 'Failed to start registration');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubmit = async () => {
    setActionLoading('submit');
    try {
      const res = await registrationApi.submit();
      toast.success(res.message);
      await loadData();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      toast.error(e?.response?.data?.detail || 'Failed to submit registration');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownloadSlip = async (academicYear: string) => {
    const token = localStorage.getItem('bmu_access_token');
    if (!token) {
      toast.error('Not authenticated');
      return;
    }
    try {
      const res = await fetch(`/api/v1/portals/registration/slip/?academic_year=${academicYear}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text();
        toast.error(text || 'Failed to download slip');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `registration_slip_${academicYear.replace('/', '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to download slip');
    }
  };

  if (!isAuthenticated || user?.role !== 'student') {
    navigate('/portals/student', { replace: true });
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-[#A51C30] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Course Registration - Bayelsa Medical University</title>
      </Helmet>

      <div>
          {registration ? (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-200 p-5 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-bold text-gray-900">
                    {registration.academic_year} &mdash; {registration.semester === 'first' ? 'First' : 'Second'} Semester
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Level {registration.level}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium ${STATUS_COLORS[registration.status] || 'bg-gray-100 text-gray-700'}`}>
                    {registration.status === 'registered' && <CheckCircle className="w-4 h-4" />}
                    {registration.status === 'draft' && <Clock className="w-4 h-4" />}
                    {STATUS_LABELS[registration.status] || registration.status}
                  </span>
                  {registration.status === 'registered' && (
                    <button
                      onClick={() => handleDownloadSlip(registration.academic_year)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#A51C30] text-white text-sm font-medium hover:bg-[#A51C30]/90 transition cursor-pointer"
                    >
                      <Download className="w-4 h-4" /> Download Slip
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {STEPS.map((step, i) => {
                  const isActive = i <= currentStepIndex;
                  const isCurrent = i === currentStepIndex;
                  return (
                    <div key={step.key} className="flex-1 flex items-center">
                      <div className={`flex items-center gap-2 px-3 py-2 text-xs font-medium w-full justify-center ${isActive ? (isCurrent ? 'bg-[#1E1E1E] text-white' : 'bg-[#1E1E1E]/10 text-[#1E1E1E]') : 'bg-gray-100 text-gray-400'}`}>
                        {isActive && i < currentStepIndex ? <CheckCircle className="w-3.5 h-3.5" /> : null}
                        {isCurrent && registration.status === 'draft' ? <Clock className="w-3.5 h-3.5" /> : null}
                        {isCurrent && registration.status === 'submitted' ? <Send className="w-3.5 h-3.5" /> : null}
                        {isCurrent && registration.status === 'registered' ? <CheckCircle className="w-3.5 h-3.5" /> : null}
                        {step.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-200 p-8 mb-6 text-center">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-gray-900 mb-2">No Current Registration</h2>
              <p className="text-sm text-gray-500 mb-6">Start a new course registration for the current semester.</p>
              <button
                onClick={handleInit}
                disabled={actionLoading === 'init'}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E1E1E] text-white font-medium hover:bg-[#1E1E1E]/90 transition disabled:opacity-50"
              >
                {actionLoading === 'init' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Start Registration
              </button>
            </motion.div>
          )}

          {registration && isEditable && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-200">
                  <div className="px-5 py-4 border-b flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-bold text-gray-900">Available Courses</h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search courses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-3 py-2 text-sm border border-gray-200 focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent outline-none w-48"
                      />
                    </div>
                  </div>

                  <div className="px-5 py-3 border-b bg-gray-50 flex gap-2">
                    {(['all', 'first', 'second'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSemesterFilter(s)}
                        className={`px-4 py-1.5 text-xs font-medium transition ${semesterFilter === s ? 'bg-[#1E1E1E] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'}`}
                      >
                        {s === 'all' ? 'All' : s === 'first' ? 'First Semester' : 'Second Semester'}
                      </button>
                    ))}
                    <span className="ml-auto text-xs text-gray-400 self-center">
                      {unselectedCourses.length} available &middot; {filteredCourses.length} shown
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 text-left">
                          <th className="px-5 py-3 font-medium text-gray-600 text-xs uppercase">Code</th>
                          <th className="px-5 py-3 font-medium text-gray-600 text-xs uppercase">Course Title</th>
                          <th className="px-5 py-3 font-medium text-gray-600 text-xs uppercase text-center">CU</th>
                          <th className="px-5 py-3 font-medium text-gray-600 text-xs uppercase text-center">Slots</th>
                          <th className="px-5 py-3 font-medium text-gray-600 text-xs uppercase text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredCourses.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-sm">
                              {search ? 'No courses match your search.' : 'No courses available for this semester.'}
                            </td>
                          </tr>
                        ) : filteredCourses.map((course) => {
                          const isFull = course.available_slots <= 0;
                          const prereqFail = !course.has_prerequisites_met;
                          const hasConflict = course.has_conflict;
                          const blocked = isFull || prereqFail || hasConflict;
                          return (
                            <tr key={course.id} className="hover:bg-gray-50 transition">
                              <td className="px-5 py-3 font-medium text-gray-900">{course.code}</td>
                              <td className="px-5 py-3 text-gray-700">{course.title}</td>
                              <td className="px-5 py-3 text-center text-gray-900">{course.credit_units}</td>
                              <td className="px-5 py-3 text-center">
                                {isFull ? (
                                  <span className="inline-flex items-center gap-1 text-xs text-red-600"><Ban className="w-3 h-3" /> Full</span>
                                ) : (
                                  <span className="text-xs text-gray-500">{course.available_slots} left</span>
                                )}
                              </td>
                              <td className="px-5 py-3 text-center">
                                {blocked ? (
                                  <span className="text-xs text-gray-400" title={
                                    isFull ? 'Course is full' : prereqFail ? 'Prerequisites not met' : 'Timetable conflict'
                                  }>
                                    {isFull ? 'Full' : prereqFail ? 'Prereq' : 'Conflict'}
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleAddCourse(course.id)}
                                    disabled={actionLoading === `add-${course.id}`}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1E1E1E] text-white text-xs font-medium hover:bg-[#1E1E1E]/90 transition disabled:opacity-50"
                                  >
                                    {actionLoading === `add-${course.id}` ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Plus className="w-3 h-3" />
                                    )}
                                    Add
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </div>

              <div className="lg:col-span-1">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-gray-200">
                  <div className="px-5 py-4 border-b">
                    <h2 className="font-bold text-gray-900">Selected Courses</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 bg-gray-200 h-2">
                        <div
                          className="h-2 bg-[#1E1E1E] transition-all"
                          style={{ width: `${Math.min((totalUnits / maxUnits) * 100, 100)}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold ${totalUnits > maxUnits ? 'text-red-600' : 'text-gray-900'}`}>
                        {totalUnits}/{maxUnits}
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                    {selectedCourses.length === 0 ? (
                      <div className="px-5 py-8 text-center text-gray-400 text-sm">
                        No courses selected yet.
                      </div>
                    ) : selectedCourses.map((course) => (
                      <div key={course.id} className="px-5 py-3 flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{course.code}</p>
                          <p className="text-xs text-gray-500 truncate">{course.title}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-sm font-medium text-gray-700">{course.credit_units} CU</span>
                          <button
                            onClick={() => handleRemoveCourse(course.id)}
                            disabled={actionLoading === `remove-${course.id}`}
                            className="p-1 text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                            title="Remove course"
                          >
                            {actionLoading === `remove-${course.id}` ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-5 py-4 border-t bg-gray-50">
                    <button
                      onClick={handleSubmit}
                      disabled={!canSubmit || actionLoading === 'submit'}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#A51C30] text-white font-medium hover:bg-[#A51C30]/90 transition disabled:opacity-50 text-sm"
                    >
                      {actionLoading === 'submit' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Submit Registration
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {registration && !isEditable && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-200 mb-8">
              <div className="px-5 py-4 border-b">
                <h2 className="font-bold text-gray-900">
                  Registered Courses &mdash; {registration.academic_year} {registration.semester === 'first' ? 'First' : 'Second'} Semester
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-5 py-3 font-medium text-gray-600 text-xs uppercase">Code</th>
                      <th className="px-5 py-3 font-medium text-gray-600 text-xs uppercase">Course Title</th>
                      <th className="px-5 py-3 font-medium text-gray-600 text-xs uppercase text-center">CU</th>
                      <th className="px-5 py-3 font-medium text-gray-600 text-xs uppercase text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {registration.courses.length === 0 ? (
                      <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400 text-sm">No courses registered.</td></tr>
                    ) : registration.courses.map((rc) => (
                      <tr key={rc.id} className="hover:bg-gray-50 transition">
                        <td className="px-5 py-3 font-medium text-gray-900">{rc.course_code}</td>
                        <td className="px-5 py-3 text-gray-700">{rc.course_title}</td>
                        <td className="px-5 py-3 text-center text-gray-900">{rc.credit_units}</td>
                        <td className="px-5 py-3 text-center">
                          <span className={`inline-block px-2 py-0.5 text-xs font-medium ${rc.approval_status === 'approved' ? 'bg-green-100 text-green-700' : rc.approval_status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                            {rc.approval_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-medium">
                      <td colSpan={2} className="px-5 py-3 text-sm text-right text-gray-700">Total Credit Units</td>
                      <td className="px-5 py-3 text-center text-sm text-gray-900">{registration.total_credit_units}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </motion.div>
          )}

          {/* Registration History */}
          {allRegistrations.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border border-gray-200">
              <div className="px-5 py-4 border-b">
                <h2 className="font-bold text-gray-900">All Registrations</h2>
                <p className="text-xs text-gray-500 mt-1">Download registration slips for any academic year.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-5 py-3 font-medium text-gray-600 text-xs uppercase">Academic Year</th>
                      <th className="px-5 py-3 font-medium text-gray-600 text-xs uppercase">Semester</th>
                      <th className="px-5 py-3 font-medium text-gray-600 text-xs uppercase text-center">Level</th>
                      <th className="px-5 py-3 font-medium text-gray-600 text-xs uppercase text-center">Courses</th>
                      <th className="px-5 py-3 font-medium text-gray-600 text-xs uppercase text-center">Total CU</th>
                      <th className="px-5 py-3 font-medium text-gray-600 text-xs uppercase text-center">Status</th>
                      <th className="px-5 py-3 font-medium text-gray-600 text-xs uppercase text-center">Slip</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {allRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-gray-50 transition">
                        <td className="px-5 py-3 font-medium text-gray-900">{reg.academic_year}</td>
                        <td className="px-5 py-3 text-gray-700 capitalize">{reg.semester}</td>
                        <td className="px-5 py-3 text-center text-gray-700">{reg.level}</td>
                        <td className="px-5 py-3 text-center text-gray-700">{reg.courses.length}</td>
                        <td className="px-5 py-3 text-center text-gray-900 font-medium">{reg.total_credit_units}</td>
                        <td className="px-5 py-3 text-center">
                          <span className={`inline-block px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[reg.status] || 'bg-gray-100 text-gray-600'}`}>
                            {STATUS_LABELS[reg.status] || reg.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-center">
                          {reg.status === 'registered' ? (
                            <button
                              onClick={() => handleDownloadSlip(reg.academic_year)}
                              className="inline-flex items-center gap-1 text-xs text-[#A51C30] hover:text-[#A51C30]/80 font-medium cursor-pointer"
                              title="Download registration slip"
                            >
                              <Download className="w-3.5 h-3.5" /> PDF
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">--</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
      </div>
    </>
  );
};
