import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Catalogo = () => {
  return (
    <Container className="mt-3">
      <Row className="align-items-center">
        <Col>
          <h2><i className="bi-images me-2"></i> Catálogo</h2>
        </Col>
      </Row>
    </Container>
  );
};

export default Catalogo;