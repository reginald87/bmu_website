import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, HelpCircle, Mail, Phone, Loader2 } from 'lucide-react';
import { fetchFAQs, type FAQData } from '../../services/api';

const CATEGORY_ORDER = ['admissions', 'academics', 'financial', 'campus', 'international', 'general'];

const groupFAQs = (faqs: FAQData[]): { label: string; items: FAQData[] }[] => {
  const byCategory = new Map<string, FAQData[]>();
  for (const faq of faqs) {
    const list = byCategory.get(faq.category) || [];
    list.push(faq);
    byCategory.set(faq.category, list);
  }
  const labels = new Map<string, string>();
  faqs.forEach((f) => labels.set(f.category, f.category_display || f.category));
  return CATEGORY_ORDER
    .filter((c) => byCategory.has(c))
    .concat([...byCategory.keys()].filter((c) => !CATEGORY_ORDER.includes(c)))
    .map((c) => ({ label: labels.get(c) || c, items: byCategory.get(c) || [] }));
};

export const FAQPage = () => {
  const { data: faqs, isLoading } = useQuery<FAQData[]>({
    queryKey: ['faqs'],
    queryFn: () => fetchFAQs(),
  });

  const groups = useMemo(() => (faqs?.length ? groupFAQs(faqs) : []), [faqs]);
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions | Bayelsa Medical University</title>
        <meta name="description" content="Answers to the most common questions about admissions, academics, fees, campus life and international study at Bayelsa Medical University." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-[140px] pb-20 overflow-hidden" style={{ backgroundColor: 'var(--color-ink-900)' }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <span className="text-white font-medium">FAQ</span>
            </div>
            <h1 className="text-display text-white mb-6">
              Frequently Asked <span className="text-primary-600">Questions</span>
            </h1>
            <p className="text-lead text-white/80 max-w-2xl">
              Answers to the questions prospective students and visitors ask us most often.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container-custom max-w-4xl">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-10 h-10 text-ink-900 animate-spin" />
            </div>
          ) : groups.length === 0 ? (
            <div className="text-center py-24">
              <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No FAQs published yet</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                We are preparing answers to common questions. Please reach out and our team will be happy to help.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {groups.map((group) => (
                <div key={group.label}>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    {group.label}
                  </h2>
                  <div className="bg-white shadow-sm divide-y divide-gray-100">
                    {group.items.map((faq) => {
                      const key = `${faq.category}-${faq.id}`;
                      const isOpen = openIndex === key;
                      return (
                        <div key={faq.id}>
                          <button
                            type="button"
                            onClick={() => setOpenIndex(isOpen ? null : key)}
                            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition"
                            aria-expanded={isOpen}
                          >
                            <span className="font-medium text-gray-900">{faq.question}</span>
                            <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {isOpen && (
                            <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contact CTA */}
          <div className="mt-16 bg-ink-900 text-white p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-2">Still have questions?</h2>
            <p className="text-white/80 mb-6">Our admissions and support teams are ready to assist you.</p>
            <div className="flex flex-col md:flex-row gap-4">
              <a
                href="mailto:admissions@bmu.edu.ng"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-ink-900 font-semibold hover:bg-white/90 transition"
              >
                <Mail className="w-5 h-5" />
                admissions@bmu.edu.ng
              </a>
              <a
                href="tel:+2348031110000"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white font-semibold hover:bg-white/10 transition"
              >
                <Phone className="w-5 h-5" />
                +234 803 111 0000
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};