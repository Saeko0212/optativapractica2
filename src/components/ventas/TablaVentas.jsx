import React from "react";
import { Table, Button, Badge } from "react-bootstrap";

const TablaVentas = ({ ventas, abrirEdicion }) => {
  return (
    <Table striped hover responsive className="align-middle shadow-sm bg-white rounded">
      <thead className="bg-light">
        <tr>
          <th>ID</th>
          <th>Fecha y Hora</th>
          <th>Cliente</th>
          <th>Empleado</th>
          <th>Pago</th>
          <th className="text-end">Total</th>
          <th className="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {ventas.length === 0 ? (
          <tr>
            <td colSpan="7" className="text-center text-muted py-4">
              No hay ventas registradas.
            </td>
          </tr>
        ) : (
          ventas.map((v) => (
            <tr key={v.id_venta}>
              <td>
                <strong>#{v.id_venta}</strong>
              </td>
              <td>
                {new Date(v.fecha_venta).toLocaleString("es-NI", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit"
                })}
              </td>
              <td>
                {v.clientes ? `${v.clientes.nombre_cliente} ${v.clientes.apellido_cliente || ""}` : "Cliente eliminado"}
              </td>
              <td>
                {v.empleados ? `${v.empleados.nombre_empleado}` : "Empleado eliminado"}
              </td>
              <td>
                <Badge bg={v.metodo_pago === 'efectivo' ? 'success' : v.metodo_pago === 'tarjeta' ? 'info' : 'primary'}>
                  {v.metodo_pago}
                </Badge>
              </td>
              <td className="text-end fw-bold text-success">
                C$ {v.total ? v.total.toFixed(2) : "0.00"}
              </td>
              <td className="text-center">
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => abrirEdicion(v)}
                  title="Editar Venta"
                >
                  <i className="bi bi-pencil"></i>
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};

export default TablaVentas;