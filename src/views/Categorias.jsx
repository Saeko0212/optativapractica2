import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import TablaCategorias from "../components/categorias/TablaCategorias";
import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState({
    id_categoria: "",
    nombre_categoria: "",
    descripcion_categoria: "",
  });
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  // Estados y lógica que tenías originalmente para el Registro
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre_categoria: "",
    descripcion_categoria: "",
  });

  const abrirModalEdicion = (categoria) => {
    setCategoriaEditar(categoria);
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (categoria) => {
    setCategoriaAEliminar(categoria);
    setMostrarModalEliminacion(true);
  };

  const cargarCategorias = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("id_categoria", { ascending: true });

      if (error) {
        console.error("Error al cargar categorías:", error.message);
        setToast({ mostrar: true, mensaje: "Error al cargar categorías.", tipo: "error" });
        return;
      }
      setCategorias(data || []);
    } catch (err) {
      console.error("Excepción al cargar categorías:", err.message);
      setToast({ mostrar: true, mensaje: "Error inesperado al cargar categorías.", tipo: "error" });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria({ ...nuevaCategoria, [name]: value });
  };

  const agregarCategoria = async () => {
    try {
      const { error } = await supabase.from("categorias").insert([
        {
          nombre: nuevaCategoria.nombre_categoria,
          descripcion: nuevaCategoria.descripcion_categoria,
        },
      ]);
      if (error) {
        console.error("Error al agregar:", error.message);
        return;
      }
      setMostrarModalRegistro(false);
      setNuevaCategoria({ nombre_categoria: "", descripcion_categoria: "" });
      await cargarCategorias();
    } catch (err) {
      console.error("Excepción al agregar:", err.message);
    }
  };

  return (
    <Container className="margen-superior-main">
      <Row className="mb-3 align-items-center">
        <Col>
          <h2>Gestión de Categorías</h2>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => setMostrarModalRegistro(true)}>
            <i className="bi bi-plus-circle me-2"></i> Agregar Categoría
          </Button>
        </Col>
      </Row>
      <hr />

      {cargando && (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" variant="success" size="lg" />
            <p className="mt-3 text-muted">Cargando categorías...</p>
          </Col>
        </Row>
      )}

      {!cargando && categorias.length > 0 && (
        <Row>
          <Col lg={12}>
            <TablaCategorias
              categorias={categorias}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
        </Row>
      )}
      
      {!cargando && categorias.length === 0 && (
        <div className="text-center mt-5 text-muted">
          <h4>No hay categorías registradas</h4>
        </div>
      )}

      <ModalRegistroCategoria
        mostrarModal={mostrarModalRegistro}
        setMostrarModal={setMostrarModalRegistro}
        nuevaCategoria={nuevaCategoria}
        manejoCambioInput={manejoCambioInput}
        agregarCategoria={agregarCategoria}
      />
    </Container>
  );
};

export default Categorias;