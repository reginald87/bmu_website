import { useTranslation } from 'react-i18next';

const fallbackSdgs = [
  { number: 3, titleKey: 'home.sdg.goodHealth', color: '#4c9f38' },
  { number: 4, titleKey: 'home.sdg.qualityEducation', color: '#c5192d' },
  { number: 5, titleKey: 'home.sdg.genderEquality', color: '#ff3a21' },
  { number: 17, titleKey: 'home.sdg.partnerships', color: '#19486a' },
];

export const SDGSnapshot = ({ sections: homeSections }: { sections?: Array<{ section_key: string; data: unknown }> }) => {
  const { t } = useTranslation();

  const sdgs = (homeSections?.find(s => s.section_key === 'sdgs')?.data as typeof fallbackSdgs || fallbackSdgs);

  return (
    <div className="bg-white p-6">
      <h3 className="text-xl font-bold mb-2 text-ink-900">
        {t('home.sdg.title')}
      </h3>
      <p className="text-sm text-gray-700 mb-4">
        {t('home.sdg.subtitle')}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {sdgs.map((sdg) => (
          <a
            key={sdg.number}
            href="/impact/sdg-dashboard"
            className="flex items-center gap-3 p-3 hover:opacity-90 transition"
            style={{ backgroundColor: sdg.color + '20' }}
          >
            <div className="w-8 h-8 flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: sdg.color }}>
              {sdg.number}
            </div>
            <span className="text-sm font-medium text-gray-700">{t(sdg.titleKey)}</span>
          </a>
        ))}
      </div>

      <a
        href="/impact/sdg-dashboard"
        className="mt-4 block w-full text-center py-2 font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
      >
        {t('home.sdg.viewDashboard')}
      </a>
    </div>
  );
};
