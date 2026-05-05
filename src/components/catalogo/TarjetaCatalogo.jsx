import React, { useState } from "react";
import { Card, Badge, Modal, Button } from "react-bootstrap";

const TarjetaCatalogo = ({ producto, categoriaNombre }) => {
  // Variables para el manejo del modal
  const [mostrarModal, setMostrarModal] = useState(false);

  // Variables para la longitud de la descripción
  const descripcion = producto.descripcion || "";
  const previsualizacionTexto = descripcion.length > 50 
    ? descripcion.substring(0, 50) + "..." 
    : descripcion;
  
  const tieneMasTexto = descripcion.length > 50;

  return (
    <>
      <Card
        className="h-100 border-0 shadow-lg overflow-hidden position-relative cursor-pointer"
        style={{ transition: "transform 0.3s, box-shadow 0.3s", cursor: "pointer" }}
        role="button"
        tabIndex={0}
        onClick={() => setMostrarModal(true)}
        onKeyDown={(e) => e.key === "Enter" && setMostrarModal(true)}
        aria-labelledby={`producto-${producto.id_productos}-title`}
      >
        {/* Visualización de la imagen del producto */}
        <div className="ratio ratio-1x1 bg-light" style={{ overflow: "hidden" }}>
          {producto.url_imagen ? (
            <img
              src={producto.url_imagen}
              alt={producto.nombre}
              className="card-img-top object-fit-cover"
              loading="lazy"
              style={{ transition: "transform 0.4s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100 bg-secondary-subtle">
              <i className="bi bi-image text-muted fs-1"></i>
            </div>
          )}
        </div>

        {/* Cuerpo de la tarjeta */}
        <Card.Body className="d-flex flex-column p-3">
          <Card.Title
            id={`producto-${producto.id_productos}-title`}
            className="h6 fw-bold text-dark mb-2"
          >
            {producto.nombre}
          </Card.Title>

          {descripcion && (
            <Card.Text className="text-muted small flex-grow-1">
              {previsualizacionTexto}
              {tieneMasTexto && (
                <span className="text-primary fw-medium ms-1">
                  {" Leer más"}
                </span>
              )}

              <div className="mt-2">
                <Badge bg="secondary" pill size="sm">
                  {categoriaNombre || "Sin categoría"}
                </Badge>
              </div>
            </Card.Text>
          )}
          <hr />
          <div className="mt-auto pt-2">
            <h4 className="text-success fw-bold mb-0">
              ${parseFloat(producto.precio).toFixed(2)}
            </h4>
          </div>
        </Card.Body>
      </Card>

      {/* Modal para mostrar detalles completos */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold fs-4">
            {producto.nombre}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="pt-3">
          <div className="row g-4">
            <div className="col-md-5">
              {producto.url_imagen ? (
                <img
                  src={producto.url_imagen}
                  alt={producto.nombre}
                  className="img-fluid rounded shadow-sm"
                  style={{ maxHeight: "400px", objectFit: "contain", width: "100%" }}
                />
              ) : (
                <div className="bg-secondary-subtle rounded d-flex align-items-center justify-content-center" style={{ height: "400px" }}>
                  <i className="bi bi-image text-muted fs-1"></i>
                </div>
              )}
            </div>

            {/* Detalles a la derecha */}
            <div className="col-md-7">
              <div className="d-flex align-items-center mb-3">
                <Badge bg="secondary" pill className="me-2">
                  {categoriaNombre || "Sin categoría"}
                </Badge>
              </div>

              <h3 className="text-success fw-bold mb-4">
                ${parseFloat(producto.precio).toFixed(2)}
              </h3>

              {descripcion && (
                <>
                  <h5 className="fw-semibold mb-2">Descripción</h5>
                  <p className="text-muted lead" style={{ lineHeight: "1.2" }}>
                    {descripcion}
                  </p>
                </>
              )}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TarjetaCatalogo;