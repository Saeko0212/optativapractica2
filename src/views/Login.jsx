import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import FormularioLogin from '../components/login/FormularioLogin'; // Ajusta la ruta si es necesario

const Login = () => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">
                <i className="bi-person-circle me-2"></i>
                Iniciar Sesión
              </h2>
              <FormularioLogin />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;