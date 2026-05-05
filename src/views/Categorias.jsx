import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Button, Alert } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import TablaCategorias from "../components/categorias/TablaCategorias";
import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
import TarjetaCategoria from "../components/categorias/TarjetaCategoria";
import ModalEdicionCategoria from "../components/categorias/ModalEdicionCategoria";
import ModalEliminacionCategoria from "../components/categorias/ModalEliminacionCategoria";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

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

  const [busqueda, setBusqueda] = useState("");
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [categoriasPaginadas, setCategoriasPaginadas] = useState([]);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(5);

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
      
      const dataMapeada = (data || []).map((cat) => ({
        ...cat,
        id_categoria: cat.id_categoria,
        nombre: cat.nombre,
        descripcion: cat.descripcion,
      }));
      setCategorias(dataMapeada);
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

  // Método para controlar la búsqueda
  const manejarBusqueda = (texto) => {
    setBusqueda(texto);
    setPaginaActual(1); // Reiniciar a la página 1 al buscar
    if (texto === "") {
      setCategoriasFiltradas(categorias);
    } else {
      const resultados = categorias.filter(
        (cat) =>
          cat.nombre.toLowerCase().includes(texto.toLowerCase()) ||
          cat.descripcion.toLowerCase().includes(texto.toLowerCase())
      );
      setCategoriasFiltradas(resultados);
    }
  };

  // Función para el cálculo de las páginas a mostrar
  const calcularPaginacion = () => {
    const indiceUltimoRegistro = paginaActual * registrosPorPagina;
    const indicePrimerRegistro = indiceUltimoRegistro - registrosPorPagina;
    const registrosActuales = categoriasFiltradas.slice(indicePrimerRegistro, indiceUltimoRegistro);
    
    setCategoriasPaginadas(registrosActuales);
  };

  // Carga inicial y filtrado cuando cambia 'categorias'
  useEffect(() => {
    setCategoriasFiltradas(categorias);
    manejarBusqueda(busqueda); 
  }, [categorias]);

  // Recalcular páginas cuando cambia el filtro o la página actual
  useEffect(() => {
    calcularPaginacion();
  }, [categoriasFiltradas, paginaActual, registrosPorPagina]);

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

  // Manejo de cambios en el formulario de edición
  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setCategoriaEditar((prev) => ({ ...prev, [name]: value }));
  };

  // Método para ACTUALIZAR en Supabase
  const actualizarCategoria = async () => {
    try {
      const { error } = await supabase
        .from("categorias")
        .update({
          nombre: categoriaEditar.nombre,
          descripcion: categoriaEditar.descripcion,
        })
        .eq("id_categoria", categoriaEditar.id_categoria);

      if (error) throw error;

      await cargarCategorias();
      setMostrarModalEdicion(false);
      setToast({ mostrar: true, mensaje: "Categoría actualizada exitosamente.", tipo: "exito" });
    } catch (err) {
      setToast({ mostrar: true, mensaje: "Error al actualizar.", tipo: "error" });
    }
  };

  // Método para ELIMINAR en Supabase
  const eliminarCategoria = async () => {
    try {
      const { error } = await supabase
        .from("categorias")
        .delete()
        .eq("id_categoria", categoriaAEliminar.id_categoria);

      if (error) throw error;

      await cargarCategorias();
      setMostrarModalEliminacion(false);
      setToast({ mostrar: true, mensaje: "Categoría eliminada exitosamente.", tipo: "exito" });
    } catch (err) {
      setToast({ mostrar: true, mensaje: "Error al eliminar.", tipo: "error" });
    }
  };

  return (
    <Container className="mt-3">
      <Row className="align-items-center mb-3">
        <Col className="d-flex align-items-center">
          <h3 className="mb-0">
            <i className="bi-tags-fill me-2"></i> Categorías
          </h3>
        </Col>

        <Col xs={3} sm={5} md={5} lg={5} className="text-end">
          <Button onClick={() => setMostrarModalRegistro(true)} size="md">
            <i className="bi-plus-lg"></i>
            <span className="d-none d-sm-inline ms-2">Nueva Categoría</span>
          </Button>
        </Col>
      </Row>
      <hr />

      {/* Implementación del buscador */}
      <Row className="mb-3 justify-content-start">
        <Col xs={12} md={6} lg={4}>
          <CuadroBusquedas busqueda={busqueda} setBusqueda={manejarBusqueda} />
        </Col>
      </Row>

      {cargando && (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" variant="success" size="lg" />
            <p className="mt-3 text-muted">Cargando categorías...</p>
          </Col>
        </Row>
      )}

      {/* Alerta si no hay resultados */}
      {categoriasFiltradas.length === 0 && !cargando && (
        <Alert variant="info" className="text-center">
          No se encontraron categorías.
        </Alert>
      )}

      {/* 📱 VISTA MÓVIL: Muestra las tarjetas interactivas y se oculta en escritorio */}
      {!cargando && categoriasPaginadas.length > 0 && (
        <Row className="d-lg-none">
          <Col xs={12}>
            <TarjetaCategoria
              categorias={categoriasPaginadas}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
        </Row>
      )}

      {/* 💻 VISTA ESCRITORIO: Muestra la tabla clásica y se oculta en móviles */}
      {!cargando && categoriasPaginadas.length > 0 && (
        <Row className="d-none d-lg-block">
          <Col lg={12}>
            <TablaCategorias
              categorias={categoriasPaginadas}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
        </Row>
      )}
      
      {/* Implementación de la Paginación */}
      {!cargando && categoriasFiltradas.length > 0 && (
        <Paginacion 
          registrosPorPagina={registrosPorPagina}
          totalRegistros={categoriasFiltradas.length}
          paginaActual={paginaActual}
          establecerPaginaActual={setPaginaActual}
          establecerRegistrosPorPagina={setRegistrosPorPagina}
        />
      )}

      <ModalRegistroCategoria
        mostrarModal={mostrarModalRegistro}
        setMostrarModal={setMostrarModalRegistro}
        nuevaCategoria={nuevaCategoria}
        manejoCambioInput={manejoCambioInput}
        agregarCategoria={agregarCategoria}
      />

      <ModalEdicionCategoria 
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        categoriaEditar={categoriaEditar}
        manejoCambioInputEdicion={manejoCambioInputEdicion}
        actualizarCategoria={actualizarCategoria}
      />

      <ModalEliminacionCategoria 
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarCategoria={eliminarCategoria}
        categoria={categoriaAEliminar}
      />
    </Container>
  );
};

export default Categorias;