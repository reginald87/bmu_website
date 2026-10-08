import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { User, MapPin, Phone, Users, GraduationCap, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';
import { apiClient } from '../../services/api';

interface StudentProfileData {
  user: {
    full_name: string;
    email: string;
    phone: string;
    student_id: string;
    program: string;
    address: string;
    city: string;
    state: string;
    profile_image: string | null;
  };
  profile: {
    matric_number: string;
    current_level: number;
    current_semester: string;
    admission_type: string;
    entry_mode: string;
    admission_date: string | null;
    state_of_origin: string;
    lga_of_origin: string;
    nationality: string;
    nok_full_name: string;
    nok_relationship: string;
    nok_phone: string;
    nok_email: string;
    nok_address: string;
  };
}

export const StudentProfile = () => {
  const { user } = useAuth();
  const [data, setData] = useState<StudentProfileData | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    apiClient.get('/auth/student/profile')
      .then((res) => {
        setData(res.data);
        const base: Record<string, string> = {
          phone: res.data.user?.phone || '',
          address: res.data.user?.address || '',
          city: res.data.user?.city || '',
          state: res.data.user?.state || '',
          state_of_origin: res.data.profile?.state_of_origin || '',
          lga_of_origin: res.data.profile?.lga_of_origin || '',
          nationality: res.data.profile?.nationality || '',
          nok_full_name: res.data.profile?.nok_full_name || '',
          nok_relationship: res.data.profile?.nok_relationship || '',
          nok_phone: res.data.profile?.nok_phone || '',
          nok_email: res.data.profile?.nok_email || '',
          nok_address: res.data.profile?.nok_address || '',
        };
        setForm(base);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await apiClient.put('/auth/student/profile', form);
      setMessage({ type: 'success', text: res.data?.message || 'Profile updated successfully' });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string; detail?: string } } };
      setMessage({ type: 'error', text: e?.response?.data?.error || e?.response?.data?.detail || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full px-3 py-2.5 border border-gray-200 focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition text-sm';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5';

  return (
    <>
      <Helmet>
        <title>Student Profile | BMU</title>
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
      </div>

      {message && (
        <div className={`mb-6 p-4 flex items-center gap-2 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary */}
          <div className="space-y-6">
            <div className="bg-white p-6 shadow-sm border border-gray-100 rounded">
              <div className="w-20 h-20 bg-ink-900/10 flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-ink-900" />
              </div>
              <h2 className="font-bold text-lg text-gray-900">{data?.user?.full_name || user?.full_name}</h2>
              <p className="text-sm text-primary-600">{data?.user?.program || 'MBBS (Medicine & Surgery)'}</p>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  {data?.profile?.matric_number || data?.user?.student_id || '—'}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  Level {data?.profile?.current_level ?? '—'}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {[data?.user?.address, data?.user?.city, data?.user?.state].filter(Boolean).join(', ') || '—'}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {data?.user?.phone || '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Edit form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 shadow-sm border border-gray-100 rounded">
              <h3 className="font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Phone</label>
                  <input className={inputCls} value={form.phone || ''} onChange={handleChange('phone')} placeholder="080..." />
                </div>
                <div>
                  <label className={labelCls}>State</label>
                  <input className={inputCls} value={form.state || ''} onChange={handleChange('state')} placeholder="Bayelsa" />
                </div>
                <div>
                  <label className={labelCls}>City</label>
                  <input className={inputCls} value={form.city || ''} onChange={handleChange('city')} placeholder="Yenagoa" />
                </div>
                <div>
                  <label className={labelCls}>Address</label>
                  <input className={inputCls} value={form.address || ''} onChange={handleChange('address')} placeholder="Street address" />
                </div>
                <div>
                  <label className={labelCls}>State of Origin</label>
                  <input className={inputCls} value={form.state_of_origin || ''} onChange={handleChange('state_of_origin')} placeholder="Bayelsa" />
                </div>
                <div>
                  <label className={labelCls}>LGA</label>
                  <input className={inputCls} value={form.lga_of_origin || ''} onChange={handleChange('lga_of_origin')} placeholder="Yenagoa" />
                </div>
                <div>
                  <label className={labelCls}>Nationality</label>
                  <input className={inputCls} value={form.nationality || ''} onChange={handleChange('nationality')} placeholder="Nigerian" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 shadow-sm border border-gray-100 rounded">
              <h3 className="font-bold text-gray-900 mb-4">Next of Kin</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Full Name</label>
                  <input className={inputCls} value={form.nok_full_name || ''} onChange={handleChange('nok_full_name')} />
                </div>
                <div>
                  <label className={labelCls}>Relationship</label>
                  <select className={inputCls} value={form.nok_relationship || ''} onChange={handleChange('nok_relationship')}>
                    <option value="">Select</option>
                    <option>father</option>
                    <option>mother</option>
                    <option>guardian</option>
                    <option>spouse</option>
                    <option>sibling</option>
                    <option>other</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input className={inputCls} value={form.nok_phone || ''} onChange={handleChange('nok_phone')} />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input className={inputCls} type="email" value={form.nok_email || ''} onChange={handleChange('nok_email')} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Address</label>
                  <textarea className={inputCls} rows={2} value={form.nok_address || ''} onChange={handleChange('nok_address')} />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-ink-900 text-white font-semibold hover:bg-primary-600 transition inline-flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
