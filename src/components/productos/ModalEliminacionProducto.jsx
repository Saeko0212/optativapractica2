import React, { useState } from "react";
import { Modal, Button, Alert } from "react-bootstrap";

const ModalEliminacionProducto = ({ mostrarModalEliminacion, setMostrarModalEliminacion, eliminarProducto, producto }) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const manejarEliminacion = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await eliminarProducto();
    setDeshabilitado(false);
  };

  return (
    <Modal show={mostrarModalEliminacion} onHide={() => setMostrarModalEliminacion(false)} centered backdrop="static">
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title><i className="bi bi-exclamation-triangle-fill me-2"></i>Eliminar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="warning" className="text-center">
          ¿Estás seguro de que deseas eliminar permanentemente el producto <strong>{producto?.nombre}</strong>?
        </Alert>
        <p className="text-muted text-center small">Esta acción no se puede deshacer y eliminará la imagen asociada.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModalEliminacion(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={manejarEliminacion} disabled={deshabilitado}>
          {deshabilitado ? "Eliminando..." : "Sí, eliminar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionProducto;