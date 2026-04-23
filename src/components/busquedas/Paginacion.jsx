import React from 'react';
import { Pagination } from 'react-bootstrap';

const Paginacion = ({ paginas, paginaActual, setPaginaActual }) => {
  return (
    <Pagination className="justify-content-center mt-4">
      <Pagination.Prev 
        onClick={() => setPaginaActual(paginaActual - 1)} 
        disabled={paginaActual === 1} 
      />
      
      {paginas.map(numero => (
        <Pagination.Item 
          key={numero} 
          active={numero === paginaActual}
          onClick={() => setPaginaActual(numero)}
        >
          {numero}
        </Pagination.Item>
      ))}

      <Pagination.Next 
        onClick={() => setPaginaActual(paginaActual + 1)} 
        disabled={paginaActual === paginas.length} 
      />
    </Pagination>
  );
};

export default Paginacion;