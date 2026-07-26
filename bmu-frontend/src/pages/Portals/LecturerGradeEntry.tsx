import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  BookOpen, Save, Send, Loader2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { lecturerApi, type LecturerCourse, type CourseResult, type GradeUploadPayload } from '../../services/api';

export const LecturerGradeEntry = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<LecturerCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [students, setStudents] = useState<CourseResult[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [session] = useState('2024/2025');
  const [semester] = useState('First');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !['faculty', 'staff', 'admin'].includes(user?.role || '')) {
      navigate('/portals/student', { replace: true });
      return;
    }
    lecturerApi.getCourses(session, semester)
      .then(setCourses)
      .catch(() => toast.error('Failed to load courses'))
      .finally(() => setLoadingCourses(false));
  }, [isAuthenticated, user, navigate, session, semester]);

  useEffect(() => {
    if (!selectedCourse) {
      setStudents([]);
      return;
    }
    setLoadingStudents(true);
    lecturerApi.getCourseStudents(session, semester, selectedCourse)
      .then(setStudents)
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoadingStudents(false));
  }, [selectedCourse, session, semester]);

  const updateScore = (
    studentId: number,
    field: 'assignment_score' | 'exam_score' | 'attendance_percentage',
    value: string
  ) => {
    setStudents(prev => prev.map(s =>
      s.id === studentId || s.student_id === studentId
        ? { ...s, [field]: value === '' ? null : parseFloat(value) || 0 }
        : s
    ));
  };

  const buildPayload = (): GradeUploadPayload | null => {
    if (!selectedCourse) return null;
    const scores = students.map(s => ({
      student_id: s.student_id,
      assignment_score: s.assignment_score ?? null,
      exam_score: s.exam_score ?? null,
      attendance_percentage: s.attendance_percentage ?? null,
    }));
    return { session, semester, course_id: selectedCourse, scores };
  };

  const handleSave = async () => {
    const payload = buildPayload();
    if (!payload) return;
    setSaving(true);
    try {
      const res = await lecturerApi.saveGrades(payload);
      toast.success(res.message);
    } catch {
      toast.error('Failed to save grades');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    const payload = buildPayload();
    if (!payload) return;
    setSaving(true);
    try {
      const res = await lecturerApi.submitGrades(payload);
      toast.success(res.message);
    } catch {
      toast.error('Failed to submit grades');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated || !['faculty', 'staff', 'admin'].includes(user?.role || '')) return null;

  return (
    <>
      <Helmet>
        <title>Grade Entry - Bayelsa Medical University</title>
      </Helmet>

      <div>
          {/* Course selector */}
          <div className="bg-white p-4 border border-gray-100 shadow-sm mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
            {loadingCourses ? (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading courses...
              </div>
            ) : courses.length === 0 ? (
              <p className="text-sm text-gray-400">No courses assigned for this session/semester.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {courses.map(c => (
                  <button key={c.id} onClick={() => setSelectedCourse(c.id)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border transition ${
                      selectedCourse === c.id
                        ? 'bg-[#1E1E1E] text-white border-[#1E1E1E]'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-[#1E1E1E]'
                    }`}>
                    <BookOpen className="w-4 h-4" />
                    {c.code} - {c.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Students table */}
          {selectedCourse && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-100 shadow-sm">
              {loadingStudents ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : students.length === 0 ? (
                <div className="p-8 text-center text-gray-400">No student enrollments found for this course.</div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">S/N</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Matric No</th>
                          <th className="text-left px-4 py-3 font-semibold text-gray-700">Student Name</th>
                          <th className="text-center px-3 py-3 font-semibold text-gray-700">Attendance (%)</th>
                          <th className="text-center px-3 py-3 font-semibold text-gray-700">CA Score</th>
                          <th className="text-center px-3 py-3 font-semibold text-gray-700">Exam Score</th>
                          <th className="text-center px-3 py-3 font-semibold text-gray-700">Total</th>
                          <th className="text-center px-3 py-3 font-semibold text-gray-700">Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((s, i) => {
                          const total = (s.assignment_score ?? 0) + (s.exam_score ?? 0);
                          return (
                            <tr key={s.id || i} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                              <td className="px-4 py-2 font-medium text-gray-900">{s.matric_number}</td>
                              <td className="px-4 py-2 text-gray-700">{s.student_name}</td>
                              <td className="px-3 py-2">
                                <input type="number" min="0" max="100" step="0.1"
                                  value={s.attendance_percentage ?? ''}
                                  onChange={e => updateScore(s.student_id, 'attendance_percentage', e.target.value)}
                                  className="w-20 px-2 py-1 text-center border border-gray-200 focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent outline-none text-sm" />
                              </td>
                              <td className="px-3 py-2">
                                <input type="number" min="0" max="100" step="0.1"
                                  value={s.assignment_score ?? ''}
                                  onChange={e => updateScore(s.student_id, 'assignment_score', e.target.value)}
                                  className="w-20 px-2 py-1 text-center border border-gray-200 focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent outline-none text-sm" />
                              </td>
                              <td className="px-3 py-2">
                                <input type="number" min="0" max="100" step="0.1"
                                  value={s.exam_score ?? ''}
                                  onChange={e => updateScore(s.student_id, 'exam_score', e.target.value)}
                                  className="w-20 px-2 py-1 text-center border border-gray-200 focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent outline-none text-sm" />
                              </td>
                              <td className="px-3 py-2 text-center font-medium">{total > 0 ? total.toFixed(1) : '-'}</td>
                              <td className="px-3 py-2 text-center">
                                <span className={`inline-block px-2 py-0.5 text-xs font-bold ${
                                  total >= 70 ? 'text-green-600 bg-green-50' :
                                  total >= 60 ? 'text-blue-600 bg-blue-50' :
                                  total >= 50 ? 'text-orange-600 bg-orange-50' :
                                  total > 0 ? 'text-red-600 bg-red-50' : 'text-gray-400'
                                }`}>
                                  {total >= 70 ? 'A' : total >= 60 ? 'B' : total >= 50 ? 'C' : total > 0 ? 'F' : '-'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="px-4 py-4 bg-gray-50 border-t flex items-center justify-end gap-3">
                    <button onClick={handleSave} disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-[#1E1E1E] text-white font-medium hover:bg-[#1E1E1E]/90 transition disabled:opacity-50">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save as Draft
                    </button>
                    <button onClick={handleSubmit} disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-[#A51C30] text-white font-medium hover:bg-[#A51C30]/90 transition disabled:opacity-50">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Submit for Approval
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
      </div>
    </>
  );
};
