import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { EventData } from '../../services/mockData';

interface UpcomingEventsProps {
  events: EventData[];
}

export const UpcomingEvents = ({ events }: UpcomingEventsProps) => {
  const { t } = useTranslation();
  const displayEvents = events.slice(0, 4);

  if (displayEvents.length === 0) {
    return (
      <div className="bg-white p-6">
        <h3 className="text-xl font-bold mb-4 text-ink-900">
          {t('home.upcomingEvents.title')}
        </h3>
        <p className="text-gray-500">{t('home.upcomingEvents.noEvents')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6">
      <h3 className="text-xl font-bold mb-4 text-ink-900">
        {t('home.upcomingEvents.title')}
      </h3>
      <div className="space-y-4">
        {displayEvents.map((event) => (
          <Link
            key={event.id}
            to={`/events/${event.slug}`}
            className="flex items-start gap-4 p-4 hover:bg-gray-50 transition"
          >
            <div className="flex-shrink-0 w-16 h-16 flex flex-col items-center justify-center text-white bg-primary-600">
              <span className="text-2xl font-bold">{new Date(event.event_date).getDate()}</span>
              <span className="text-xs uppercase">
                {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' })}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{event.title}</h4>
              <p className="text-sm text-gray-500">
                {event.location} &bull; {event.event_type_display}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
