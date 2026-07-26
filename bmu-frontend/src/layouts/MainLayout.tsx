import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { ScrollToTop } from '../components/common/ScrollToTop';
import { AnnouncementModal } from '../components/announcements/AnnouncementModal';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <AnnouncementModal />
    </div>
  );
};
