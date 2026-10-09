import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Globe, ExternalLink, Search, Filter, ChevronDown, BarChart3, ChevronRight } from 'lucide-react';
import { useFundingOrganizations, useFundedProjects, useFundingStats } from '../../services/apiHooks';

const brandGradients = ['var(--color-primary-600)', 'var(--color-ink-900)'];

const statusColors: Record<string, string> = {
  ongoing: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
};

const formatCurrency = (amount: number) => {
  if (amount >= 1_000_000_000) return `₦${(amount / 1_000_000_000).toFixed(2)}B`;
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(0)}M`;
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}K`;
  return `₦${amount}`;
};

export function ExternalPartners() {
  const { data: organizations } = useFundingOrganizations();
  const { data: projects } = useFundedProjects();
  const { data: stats } = useFundingStats();
  const [search, setSearch] = useState('');
  const [filterOrg, setFilterOrg] = useState<number | ''>('');
  const [filterYear, setFilterYear] = useState<number | ''>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedOrg, setExpandedOrg] = useState<number | null>(null);

  const years = useMemo(() => [...new Set(projects?.map(p => p.year) ?? [])].sort((a, b) => b - a), [projects]);

  const filteredProjects = useMemo(() => (projects ?? []).filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterOrg !== '' && p.organization_id !== filterOrg) return false;
    if (filterYear !== '' && p.year !== filterYear) return false;
    if (filterStatus && p.status !== filterStatus) return false;
    return true;
  }), [projects, search, filterOrg, filterYear, filterStatus]);

  const orgFundingByYear = useMemo(() => {
    if (!organizations || !projects) return [];
    return organizations.map(org => {
      const orgProjects = projects.filter(p => p.organization_id === org.id);
      const yearMap: Record<number, number> = {};
      orgProjects.forEach(p => {
        yearMap[p.year] = (yearMap[p.year] || 0) + Number(p.amount);
      });
      const yearly = Object.entries(yearMap).map(([year, total]) => ({ year: Number(year), total }));
      yearly.sort((a, b) => b.year - a.year);
      return { ...org, yearly };
    });
  }, [organizations, projects]);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative pt-[180px] pb-20 overflow-hidden" style={{ backgroundColor: 'var(--color-ink-900)' }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="container-custom relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
              <Link to="/impact" className="hover:text-white transition">Impact</Link>
              <span>/</span>
              <span className="text-white font-medium">External Partners</span>
            </div>
            <h1 className="text-display text-white mb-6">
              External <span className="text-primary-600">Partners</span>
            </h1>
            <p className="text-lead text-white/80 max-w-2xl">
              BMU partners with leading national and international organizations to advance healthcare education, research, and community development.
            </p>
          </motion.div>
        </div>
      </section>

      {stats && (
        <div className="container-custom mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Total Funding', value: formatCurrency(stats.total_funding), icon: '₦' },
              { label: 'Active Projects', value: stats.project_count.toString(), icon: '📋' },
              { label: 'Partner Organizations', value: stats.organization_count.toString(), icon: '🤝' },
            ].map((s, i) => (
              <motion.div key={s.label} className="bg-white border border-gray-100 shadow-sm p-6 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-3xl font-bold text-primary-600">{s.value}</div>
                <div className="text-gray-600 mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="container-custom py-16">
        {organizations && organizations.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Partner Organizations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {organizations.map((org, i) => (
                <motion.div key={org.id} className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      {org.logo ? (
                        <img loading="lazy" decoding="async" src={org.logo} alt={org.name} className="w-14 h-14 object-contain rounded-lg" />
                      ) : (
                        <div className="w-14 h-14 flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: brandGradients[i % brandGradients.length] }}>
                          {org.acronym.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">{org.name}</h3>
                        <span className="text-sm text-primary-600 font-medium">{org.acronym}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{org.description}</p>
                    <div className="flex items-center justify-between py-3 border-t border-gray-100">
                      <span className="text-gray-500 text-sm">{org.project_count} project{org.project_count !== 1 ? 's' : ''}</span>
                      <span className="font-bold text-primary-600">{formatCurrency(org.total_funding)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <a href={org.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-600/80">
                        <Globe className="w-4 h-4" /> Website <ExternalLink className="w-3 h-3" />
                      </a>
                      <button onClick={() => setExpandedOrg(expandedOrg === org.id ? null : org.id)} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                        <BarChart3 className="w-4 h-4" /> Funding by year <ChevronRight className={`w-3 h-3 transition-transform ${expandedOrg === org.id ? 'rotate-90' : ''}`} />
                      </button>
                    </div>
                  </div>
                  <AnimatePresence>
                    {expandedOrg === org.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-gray-100 bg-gray-50 overflow-hidden">
                        <div className="p-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">Funding Breakdown by Year</h4>
                          <div className="space-y-2">
                            {(orgFundingByYear.find(o => o.id === org.id)?.yearly ?? []).map(y => (
                              <div key={y.year} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 text-sm">
                                <span className="font-medium text-gray-700">{y.year}</span>
                                <div className="flex items-center gap-3">
                                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary-600 rounded-full" style={{ width: `${Math.min(100, (y.total / Math.max(...(orgFundingByYear.find(o => o.id === org.id)?.yearly.map(yy => yy.total) ?? [1]))) * 100)}%` }} />
                                  </div>
                                  <span className="font-semibold text-gray-800 w-24 text-right">{formatCurrency(y.total)}</span>
                                </div>
                              </div>
                            ))}
                            {orgFundingByYear.find(o => o.id === org.id)?.yearly.length === 0 && (
                              <p className="text-sm text-gray-400 text-center py-2">No funding data available.</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </>
        )}

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Funded Projects</h2>

        <div className="mb-6 space-y-3">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700">
              <Filter className="w-4 h-4" /> Filters <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <motion.div className="flex flex-wrap gap-3" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <select value={filterOrg} onChange={e => setFilterOrg(e.target.value ? Number(e.target.value) : '')} className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-600 outline-none text-sm">
                <option value="">All Organizations</option>
                {organizations?.map(o => <option key={o.id} value={o.id}>{o.acronym} - {o.name}</option>)}
              </select>
              <select value={filterYear} onChange={e => setFilterYear(e.target.value ? Number(e.target.value) : '')} className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-600 outline-none text-sm">
                <option value="">All Years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-600 outline-none text-sm">
                <option value="">All Statuses</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((p, i) => {
            const orgIndex = organizations?.findIndex(o => o.id === p.organization_id) ?? 0;
            return (
            <motion.div key={p.id} className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
              <Link to={`/impact/external-partners/${p.id}`} className="block">
                {p.image ? (
                  <img loading="lazy" decoding="async" src={p.image} alt={p.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center" style={{ backgroundColor: brandGradients[orgIndex % brandGradients.length] }}>
                    <div className="text-center text-white">
                      <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <span className="text-sm font-medium opacity-70">{p.organization_name}</span>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[p.status] || 'bg-gray-100 text-gray-800'}`}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</span>
                    <span className="text-sm text-gray-400">{p.year}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{p.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{p.description}</p>
                  <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
                    <span className="text-primary-600 font-medium">{p.organization_name}</span>
                    <span className="font-bold text-gray-800 text-base">{formatCurrency(Number(p.amount))}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 text-gray-500">No projects match your filters.</div>
        )}
      </div>
    </div>
  );
}
