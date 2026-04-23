import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

const CuadroBusquedas = ({ busqueda, setBusqueda }) => {
  return (
    <InputGroup className="mb-3">
      <InputGroup.Text id="basic-addon1">
        <i className="bi bi-search"></i>
      </InputGroup.Text>
      <Form.Control
        placeholder="Buscar..."
        aria-label="Buscar"
        aria-describedby="basic-addon1"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
    </InputGroup>
  );
};

export default CuadroBusquedas;