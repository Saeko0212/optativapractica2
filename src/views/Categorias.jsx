import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
import NotificacionOperacion from "../components/NotificacionOperacion";

const Categorias = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre_categoria: "", descripcion_categoria: "" });

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria((prev) => ({ ...prev, [name]: value }));
  };

  const agregarCategoria = async () => {
    try {
      if (!nuevaCategoria.nombre_categoria.trim() || !nuevaCategoria.descripcion_categoria.trim()) {
        setToast({ mostrar: true, mensaje: "Debe llenar todos los campos.", tipo: "advertencia" });
        return;
      }

      const { error } = await supabase.from("categorias").insert([
        { 
          // Usamos 'nombre' y 'descripcion' porque así están en tu imagen
          nombre: nuevaCategoria.nombre_categoria, 
          descripcion: nuevaCategoria.descripcion_categoria 
        },
      ]);

      if (error) throw error;

      setToast({ 
        mostrar: true, 
        mensaje: `Categoría "${nuevaCategoria.nombre_categoria}" registrada exitosamente.`, 
        tipo: "exito" 
      });
      setNuevaCategoria({ nombre_categoria: "", descripcion_categoria: "" });
      setMostrarModal(false);

    } catch (err) {
      setToast({ mostrar: true, mensaje: "Error al registrar categoría.", tipo: "error" });
    }
  };

  return (
    <Container className="mt-3">
      <Row className="align-items-center mb-3">
        <Col xs={9}>
          <h3><i className="bi-bookmark-plus-fill me-2"></i> Categorías</h3>
        </Col>
        <Col xs={3} className="text-end">
          <Button onClick={() => setMostrarModal(true)}>
            <i className="bi-plus-lg"></i> <span className="d-none d-sm-inline ms-2">Nueva Categoría</span>
          </Button>
        </Col>
      </Row>
      <hr />
      <ModalRegistroCategoria 
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevaCategoria={nuevaCategoria}
        manejoCambioInput={manejoCambioInput}
        agregarCategoria={agregarCategoria}
      />
      <NotificacionOperacion 
        {...toast}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />
    </Container>
  );
};

export default Categorias;