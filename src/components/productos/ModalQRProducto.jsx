import React from "react";
import { Modal, Button } from "react-bootstrap";
import QRCode from "react-qr-code";

const ModalQRProducto = ({
  mostrar,
  onHide,
  producto
}) => {
  if (!producto) return null;

  // Adaptación a los nombres de tu base de datos
  const nombre = producto.nombre || producto.nombre_producto;

  return (
    <Modal show={mostrar} onHide={onHide} centered size="sm">
      <Modal.Header closeButton>
        <Modal.Title className="fs-5">
          QR - {nombre}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center py-4">
        {producto.url_imagen ? (
          <>
            <QRCode
              value={producto.url_imagen}
              size={230}
              className="mx-auto shadow-sm"
            />
            <p className="text-muted mt-3 small mb-1">
              Escanea para ver la imagen del producto
            </p>
            <p className="text-primary small">
              {nombre}
            </p>
          </>
        ) : (
          <p className="text-danger">No hay imagen disponible</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalQRProducto;