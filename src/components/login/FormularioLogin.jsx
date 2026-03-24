import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../database/supabaseconfig';

const FormularioLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const manejarLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Guardamos el usuario en localStorage como pide la práctica
      localStorage.setItem('usuario-supabase', data.user.email);
      
      // Redirigimos al inicio
      navigate('/');
    } catch (err) {
      setError("Credenciales incorrectas o error de conexión.");
    }
  };

  return (
    <Form onSubmit={manejarLogin}>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form.Group className="mb-3">
        <Form.Label>Correo electrónico</Form.Label>
        <Form.Control 
          type="email" 
          placeholder="ejemplo@correo.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control 
          type="password" 
          placeholder="********" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100">
        Ingresar
      </Button>
    </Form>
  );
};

export default FormularioLogin;