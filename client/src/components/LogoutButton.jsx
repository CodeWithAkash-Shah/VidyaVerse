import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully!');
    navigate('/signin');
  };

  return (
    <Button onClick={handleLogout} variant="outline" className={"bg-gray-800 text-white hover:bg-red-600 hover:text-white cursor-pointer"}>
      Logout
    </Button>
  );
};

export default LogoutButton;