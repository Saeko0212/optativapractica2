import React from "react";
import { Table, Button } from "react-bootstrap";

const TablaProductos = ({ productos, categorias, abrirModalEdicion, abrirModalEliminacion, copiarProducto, generarQRImagen }) => {
  
  // Función auxiliar para obtener el nombre de la categoría por su ID
  const obtenerNombreCategoria = (id) => {
    const categoria = categorias.find((cat) => cat.id_categoria === id);
    return categoria ? (categoria.nombre || categoria.nombre_categoria) : "Sin categoría";
  };

  return (
    <Table striped bordered hover responsive className="shadow-sm bg-white">
      <thead className="table-dark">
        <tr>
          <th className="text-center">#</th>
          <th className="text-center">Imagen</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Descripción</th>
          <th className="text-center">Precio</th>
          <th className="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((producto, index) => (
          <tr key={producto.id_producto}>
            <td className="text-center align-middle">{index + 1}</td>
            <td className="text-center align-middle">
              {producto.url_imagen ? (
                <img 
                  src={producto.url_imagen} 
                  alt={producto.nombre} 
                  style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
                />
              ) : (
                <span className="text-muted small">Sin imagen</span>
              )}
            </td>
            <td className="align-middle fw-bold">{producto.nombre}</td>
            <td className="align-middle">{obtenerNombreCategoria(producto.categoria_id)}</td>
            <td className="align-middle text-truncate" style={{ maxWidth: "200px" }}>
              {producto.descripcion || "Sin descripción"}
            </td>
            <td className="text-center align-middle text-success fw-bold">
              ${producto.precio?.toFixed(2)}
            </td>
            <td className="text-center align-middle">
              <Button variant="warning" size="sm" className="me-2" onClick={() => abrirModalEdicion(producto)}>
                <i className="bi bi-pencil-square"></i>
              </Button>
              <Button variant="danger" size="sm" onClick={() => abrirModalEliminacion(producto)}>
                <i className="bi bi-trash"></i>
              </Button>
              <Button variant="outline-success" size="sm" className="m-1" onClick={() => copiarProducto(producto)} title="Copiar al portapapeles">
                <i className="bi bi-clipboard"></i>
              </Button>
              <Button variant="outline-primary" size="sm" className="m-1" onClick={() => generarQRImagen(producto)} title="Generar código QR de la imagen">
                <i className="bi bi-qr-code"></i>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TablaProductos;