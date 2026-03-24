import { Navigate } from 'react-router-dom';

const RutaProtegida = ({ children }) => {
  // Verificamos si existe el usuario en el localStorage según la guía [cite: 57, 58]
  const usuario = localStorage.getItem('usuario-supabase');

  if (!usuario) {
    // Si no hay usuario, redirigir al login [cite: 54]
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ESTA LÍNEA ES LA QUE FALTA O ESTÁ MAL:
export default RutaProtegida;