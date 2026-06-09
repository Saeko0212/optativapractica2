import React from "react";
import { Card, Button, Row, Col, Badge } from "react-bootstrap";

const TarjetaProducto = ({ productos, categorias, abrirModalEdicion, abrirModalEliminacion, copiarProducto, generarQRImagen }) => {
  
  const obtenerNombreCategoria = (id) => {
    const categoria = categorias.find((cat) => cat.id_categoria === id);
    return categoria ? (categoria.nombre || categoria.nombre_categoria) : "Sin categoría";
  };

  return (
    <Row>
      {productos.map((producto) => (
        <Col xs={12} sm={6} key={producto.id_producto} className="mb-3">
          <Card className="shadow-sm h-100 border-0" style={{ borderRadius: "12px" }}>
            <div className="text-center pt-3">
              {producto.url_imagen ? (
                <img 
                  src={producto.url_imagen} 
                  alt={producto.nombre} 
                  style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "10px" }}
                />
              ) : (
                <div className="bg-light d-inline-flex align-items-center justify-content-center" style={{ width: "120px", height: "120px", borderRadius: "10px" }}>
                  <i className="bi bi-image text-muted" style={{ fontSize: "2rem" }}></i>
                </div>
              )}
            </div>
            <Card.Body>
              <Card.Title className="fw-bold">{producto.nombre}</Card.Title>
              <Badge bg="secondary" className="mb-2">{obtenerNombreCategoria(producto.categoria_id)}</Badge>
              <Card.Text className="text-muted small mb-2 text-truncate" style={{ maxHeight: "40px" }}>
                {producto.descripcion || "Sin descripción"}
              </Card.Text>
              <h5 className="text-success fw-bold">${producto.precio?.toFixed(2)}</h5>
              
              <div className="d-flex justify-content-end mt-3 border-top pt-3">
                <Button variant="warning" size="sm" className="me-2" onClick={() => abrirModalEdicion(producto)}>
                  <i className="bi bi-pencil-square me-1"></i> Editar
                </Button>
                <Button variant="danger" size="sm" onClick={() => abrirModalEliminacion(producto)}>
                  <i className="bi bi-trash me-1"></i> Eliminar
                </Button>
                <Button variant="outline-success" size="sm" className="ms-2" onClick={() => copiarProducto(producto)} title="Copiar al portapapeles">
                  <i className="bi bi-clipboard"></i>
                </Button>
                <Button variant="outline-primary" size="sm" className="ms-2" onClick={() => generarQRImagen(producto)} title="Generar código QR de la imagen">
                  <i className="bi bi-qr-code"></i>
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default TarjetaProducto;