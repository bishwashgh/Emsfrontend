import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './services/api';

export default function Signout() {
  const navigate = useNavigate();
  useEffect(() => {
    auth.logout();
    navigate('/login');
  }, []);
  return null;
}