import { useNavigate } from 'react-router-dom';
import { PasswordReset } from './PasswordReset';

export const PasswordResetPage = () => {
  const navigate = useNavigate();
  return <PasswordReset portal="student" onBack={() => navigate('/portals/login')} />;
};
