import { Outlet, useParams } from 'react-router-dom';

export const CollegeLayout = () => {
  const { collegeSlug } = useParams();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-bmu-blue text-white py-8">
        <div className="container-custom">
          <h1 className="text-3xl font-bold capitalize">{collegeSlug?.replace(/-/g, ' ')} College</h1>
        </div>
      </div>
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};
