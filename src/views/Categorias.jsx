import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Button, Alert } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import TablaCategorias from "../components/categorias/TablaCategorias";
import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
import TarjetaCategoria from "../components/categorias/TarjetaCategoria";
import ModalEdicionCategoria from "../components/categorias/ModalEdicionCategoria";
import ModalEliminacionCategoria from "../components/categorias/ModalEliminacionCategoria";
import ModalEnvioCorreoCategorias from "../components/categorias/ModalEnvioCorreoCategorias";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import emailjs from "@emailjs/browser";

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

  // Estados para el Modal de Correo
  const [mostrarModalCorreo, setMostrarModalCorreo] = useState(false);
  const [emailDestino, setEmailDestino] = useState("");
  const [enviandoCorreo, setEnviandoCorreo] = useState(false);

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

  const copiarCategoria = async (categoria) => {
    if (!categoria) return;
    
    // Adaptación a tu base de datos
    const id = categoria.id_categoria || categoria.id_categorias;
    const nombre = categoria.nombre_categoria || categoria.nombre;
    const descripcion = categoria.descripcion_categoria || categoria.descripcion || 'Sin descripción';

    const texto = `ID: ${id}\nCategoría: ${nombre}\nDescripción: ${descripcion}`;

    try {
      await navigator.clipboard.writeText(texto);
      setToast({
        mostrar: true,
        mensaje: `Categoría "${nombre}" copiada al portapapeles`,
        tipo: "exito",
      });
    } catch (err) {
      console.error("Error al copiar:", err);
      setToast({
        mostrar: true,
        mensaje: "No se pudo copiar al portapapeles",
        tipo: "error",
      });
    }
  };

  // Inicializar EmailJS
  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  const abrirModalCorreo = () => {
    setEmailDestino("");
    setMostrarModalCorreo(true);
  };

  const formatearCategoriasParaCorreo = () => {
    if (categorias.length === 0) return "No hay categorías registradas en este momento.";

    let texto = "";

    categorias.forEach((cat, index) => {
      const descripcion = cat.descripcion_categoria || cat.descripcion || "Sin descripción";
      
      texto += `📦 CATEGORÍA #${index + 1}: ${cat.nombre_categoria || cat.nombre}\n`;
      texto += `📝 Detalle: ${descripcion}\n`;
      texto += `--------------------------------------------------\n\n`;
    });

    return texto;
  };

  const enviarCorreoCategorias = () => {
    if (!emailDestino.trim()) {
      setToast({
        mostrar: true,
        mensaje: "Por favor ingresa un correo destino.",
        tipo: "advertencia",
      });
      return;
    }

    setEnviandoCorreo(true);

    const mensaje = formatearCategoriasParaCorreo();

    const templateParams = {
      to_name: "Administrador",
      user_email: emailDestino,
      message: mensaje,
      fecha_envio: new Date().toLocaleDateString("es-NI")
    };

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams
    )
      .then(() => {
        setToast({
          mostrar: true,
          mensaje: "Correo enviado correctamente.",
          tipo: "exito",
        });
        setMostrarModalCorreo(false);
        setEmailDestino("");
      })
      .catch((error) => {
        console.error("Error EmailJS:", error);
        setToast({
          mostrar: true,
          mensaje: "Error al enviar el correo.",
          tipo: "error",
        });
      })
      .finally(() => {
        setEnviandoCorreo(false);
      });
  };


  const generarPDFCategoria = (categoria) => {

  const doc = new jsPDF();

  // Título
  doc.setFontSize(18);
  doc.text("Reporte de Categoría", 14, 20);

  // Línea decorativa
  doc.line(14, 25, 195, 25);

  // Información de la categoría
  doc.setFontSize(12);

  autoTable(doc, {
    startY: 35,
    head: [["Campo", "Valor"]],
    body: [
      ["ID", categoria.id_categoria],
      ["Nombre", categoria.nombre],
      ["Descripción", categoria.descripcion],
    ],
  });

  // Descargar PDF
  doc.save(`categoria_${categoria.id_categoria}.pdf`);
};
  return (
    <Container className="mt-3">
      <Row className="align-items-center mb-3">
        <Col className="d-flex align-items-center">
          <h3 className="mb-0">
            <i className="bi-tags-fill me-2"></i> Categorías
          </h3>
        </Col>
        
        <Col className="text-end d-flex justify-content-end gap-2">
          <Button variant="primary" onClick={abrirModalCorreo} size="md">
            <i className="bi bi-envelope"></i>
            <span className="d-none d-lg-inline ms-2">Enviar por Correo</span>
          </Button>
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
              copiarCategoria={copiarCategoria}
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
               generarPDFCategoria={generarPDFCategoria}
              copiarCategoria={copiarCategoria}
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

      <ModalEnvioCorreoCategorias
  mostrarModalCorreo={mostrarModalCorreo}
  setMostrarModalCorreo={setMostrarModalCorreo}
  emailDestino={emailDestino}
  setEmailDestino={setEmailDestino}
  enviandoCorreo={enviandoCorreo}
  enviarCorreoCategorias={enviarCorreoCategorias}
  totalCategorias={categorias.length}
/>

    </Container>
  );
};

export default Categorias;