import { Navigate } from 'react-router-dom';

const RutaProtegida = ({ children }) => {
  const usuario = localStorage.getItem('usuario-supabase');

  if (!usuario) {
    // Si no hay usuario, mandarlo al login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RutaProtegida;