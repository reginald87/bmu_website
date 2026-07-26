import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, Award, AlertTriangle,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { resultsApi, type SemesterResult } from '../../services/api';

const STATUS_COLORS: Record<string, string> = {
  excellent: 'bg-green-100 text-green-800',
  very_good: 'bg-blue-100 text-blue-800',
  good: 'bg-indigo-100 text-indigo-800',
  probation: 'bg-yellow-100 text-yellow-800',
  warning: 'bg-orange-100 text-orange-800',
  probation_warning: 'bg-orange-100 text-orange-800',
  probation_withdrawn: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<string, string> = {
  excellent: 'Excellent',
  very_good: 'Very Good',
  good: 'Good',
  probation: 'Probation',
  warning: 'Warning',
  probation_warning: 'Probation Warning',
  probation_withdrawn: 'Probation - Withdrawn',
};

const GRADE_COLORS: Record<string, string> = {
  A: 'text-green-600 bg-green-50',
  'B+': 'text-blue-600 bg-blue-50',
  B: 'text-indigo-600 bg-indigo-50',
  'C+': 'text-yellow-600 bg-yellow-50',
  C: 'text-orange-600 bg-orange-50',
  D: 'text-red-500 bg-red-50',
  E: 'text-red-600 bg-red-50',
  F: 'text-red-700 bg-red-100',
};

export const ResultViewer = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState<SemesterResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSemester, setExpandedSemester] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'student') {
      navigate('/portals/student', { replace: true });
      return;
    }
    resultsApi.getDetail()
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== 'student') return null;

  const semesterKey = (r: SemesterResult) => `${r.session}|${r.semester}`;

  return (
    <>
      <Helmet>
        <title>My Results - Bayelsa Medical University</title>
      </Helmet>

      <div>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-[#1E1E1E] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : results.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white p-12 text-center border border-gray-100">
              <GraduationCap className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">No Results Yet</h2>
              <p className="text-gray-500">Your academic results will appear here once published.</p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {results.map((semester, idx) => {
                const key = semesterKey(semester);
                const isExpanded = expandedSemester === key;
                return (
                  <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                    className="bg-white border border-gray-100 shadow-sm">
                    <button onClick={() => setExpandedSemester(isExpanded ? null : key)}
                      className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-[#1E1E1E]/5 flex items-center justify-center">
                          <Award className="w-7 h-7 text-[#1E1E1E]" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-bold text-gray-900">{semester.session} - {semester.semester} Semester</h3>
                          <p className="text-sm text-gray-500">Level {semester.level} • {semester.courses.length} Course{semester.courses.length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-sm text-gray-500">GPA</div>
                          <div className="text-xl font-bold text-[#1E1E1E]">{semester.gpa.toFixed(2)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">CGPA</div>
                          <div className="text-xl font-bold text-[#1E1E1E]">{semester.cgpa.toFixed(2)}</div>
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold ${STATUS_COLORS[semester.academic_status] || 'bg-gray-100 text-gray-700'}`}>
                          {STATUS_LABELS[semester.academic_status] || semester.academic_status}
                        </span>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-gray-100">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-50 border-b">
                                <th className="text-left px-6 py-3 font-semibold text-gray-700">S/N</th>
                                <th className="text-left px-6 py-3 font-semibold text-gray-700">Code</th>
                                <th className="text-left px-6 py-3 font-semibold text-gray-700">Course Title</th>
                                <th className="text-center px-4 py-3 font-semibold text-gray-700">Units</th>
                                <th className="text-center px-4 py-3 font-semibold text-gray-700">CA Score</th>
                                <th className="text-center px-4 py-3 font-semibold text-gray-700">Exam Score</th>
                                <th className="text-center px-4 py-3 font-semibold text-gray-700">Total</th>
                                <th className="text-center px-4 py-3 font-semibold text-gray-700">Grade</th>
                                <th className="text-center px-4 py-3 font-semibold text-gray-700">GP</th>
                              </tr>
                            </thead>
                            <tbody>
                              {semester.courses.map((course, ci) => (
                                <tr key={course.id} className="border-b hover:bg-gray-50">
                                  <td className="px-6 py-3 text-gray-500">{ci + 1}</td>
                                  <td className="px-6 py-3 font-medium text-gray-900">{course.course_code}</td>
                                  <td className="px-6 py-3 text-gray-700">{course.course_title}</td>
                                  <td className="px-4 py-3 text-center">{course.credit_units}</td>
                                  <td className="px-4 py-3 text-center">{course.assignment_score?.toFixed(1) ?? '-'}</td>
                                  <td className="px-4 py-3 text-center">{course.exam_score?.toFixed(1) ?? '-'}</td>
                                  <td className="px-4 py-3 text-center font-medium">{course.total_score?.toFixed(1) ?? '-'}</td>
                                  <td className="px-4 py-3 text-center">
                                    <span className={`inline-block px-2 py-0.5 text-xs font-bold ${GRADE_COLORS[course.grade] || 'bg-gray-100 text-gray-600'}`}>
                                      {course.grade || '-'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-center font-medium">{course.grade_point?.toFixed(2) ?? '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {semester.carryover.length > 0 && (
                          <div className="m-4 p-4 border border-yellow-200 bg-yellow-50">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-5 h-5 text-yellow-600" />
                              <h4 className="font-semibold text-yellow-800">Carryover Courses</h4>
                            </div>
                            <p className="text-sm text-yellow-700 mb-2">The following courses need to be retaken:</p>
                            <div className="flex flex-wrap gap-2">
                              {semester.carryover.map((c) => (
                                <span key={c.id} className="px-3 py-1 bg-white border border-yellow-300 text-sm text-yellow-800">
                                  {c.course_code} ({c.grade})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between text-sm">
                          <div className="text-gray-600">
                            <span className="font-semibold">Total Credit Units:</span> {semester.courses.reduce((s, c) => s + c.credit_units, 0)}
                          </div>
                          <div className="flex items-center gap-6">
                            <div><span className="text-gray-500">GPA:</span> <span className="font-bold text-[#1E1E1E]">{semester.gpa.toFixed(2)}</span></div>
                            <div><span className="text-gray-500">CGPA:</span> <span className="font-bold text-[#1E1E1E]">{semester.cgpa.toFixed(2)}</span></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
      </div>
    </>
  );
};
