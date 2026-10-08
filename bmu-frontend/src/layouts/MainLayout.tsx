import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { ScrollToTop } from '../components/common/ScrollToTop';
import { AnnouncementModal } from '../components/announcements/AnnouncementModal';
import { SkipLink } from '../components/ui';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <SkipLink />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-grow focus:outline-none">
        <Outlet />
      </main>
      <Footer />
      <AnnouncementModal />
    </div>
  );
};
