import React, { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Spinner, Alert, Form } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import TarjetaCatalogo from "../components/catalogo/TarjetaCatalogo";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

const Catalogo = () => {
  // Variables de estado
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Método para la carga de datos
  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [resProductos, resCategorias] = await Promise.all([
        supabase
          .from("productos")
          .select("*")
          .order("nombre", { ascending: true }),
        supabase
          .from("categorias")
          .select("id_categoria, nombre")
          .order("nombre"),
      ]);

      if (resProductos.error) throw resProductos.error;
      if (resCategorias.error) throw resCategorias.error;

      setProductos(resProductos.data || []);
      setCategorias(resCategorias.data || []);
    } catch (err) {
      console.error("Error al cargar catálogo:", err);
      setError("No se pudieron cargar los productos. Intenta más tarde.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Variable para la manipulación de las categorías filtradas
  const productosFiltrados = useMemo(() => {
    let filtrados = productos;

    if (categoriaSeleccionada !== "todas") {
      filtrados = filtrados.filter(
        (prod) => prod.categoria_id === parseInt(categoriaSeleccionada)
      );
    }

    if (textoBusqueda.trim()) {
      const textoLower = textoBusqueda.toLowerCase().trim();

      filtrados = filtrados.filter((prod) => {
        const nombre = prod.nombre?.toLowerCase() || "";
        const descripcion = prod.descripcion?.toLowerCase() || "";
        const precioTexto = prod.precio?.toString() || "";

        return (
          nombre.includes(textoLower) ||
          descripcion.includes(textoLower) ||
          precioTexto.includes(textoLower)
        );
      });
    }

    return filtrados;
  }, [productos, categoriaSeleccionada, textoBusqueda]);

  // Métodos de manejo de variables de estado
  const manejarCambioCategoria = (e) => {
    setCategoriaSeleccionada(e.target.value);
  };

  const manejarCambioBusqueda = (e) => {
    // Adaptación por si el componente envía directamente el string o el evento
    const valor = e && e.target ? e.target.value : (typeof e === 'string' ? e : '');
    setTextoBusqueda(valor);
  };

  // Obtener nombre de categoría
  const obtenerNombreCategoria = (idCategoria) => {
    const cat = categorias.find((c) => c.id_categoria === idCategoria);
    return cat ? cat.nombre : "Sin categoría";
  };

  return (
    <Container className="mt-3">
      <Row className="align-items-center mb-3">
        <Col className="d-flex align-items-center">
          <h3 className="mb-0">
            <i className="bi-images me-2"></i> Catálogo
          </h3>
        </Col>

        <Col xs={6} sm={5} md={4} lg={3} className="text-end">
          <Form.Select
            value={categoriaSeleccionada}
            onChange={manejarCambioCategoria}
            className="shadow-sm"
          >
            <option value="todas">Categorías (Todas)</option>
            {categorias.map((cat) => (
              <option key={cat.id_categoria} value={cat.id_categoria}>
                {cat.nombre}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <hr />

      <Row className="mb-4">
        <Col md={6} lg={5}>
          <CuadroBusquedas
            busqueda={textoBusqueda}
            setBusqueda={manejarCambioBusqueda}
          />
        </Col>
      </Row>

        {/* Estados */}
        {cargando && (
          <Row className="text-center my-5">
            <Col>
              <Spinner animation="border" variant="success" size="lg" />
              <p className="mt-3 text-muted">Cargando productos...</p>
            </Col>
          </Row>
        )}

        {!cargando && productosFiltrados.length === 0 && (
          <Alert variant="info" className="text-center">
            <i className="bi bi-info-circle me-2"></i>
            No se encontraron productos que coincidan con tu búsqueda.
          </Alert>
        )}

        {/* Productos */}
        {!cargando && productosFiltrados.length > 0 && (
          <Row className="g-4">
            {productosFiltrados.map((producto) => (
              <Col xs={12} sm={6} md={4} lg={3} key={producto.id_productos}>
                <TarjetaCatalogo
                  producto={producto}
                  categoriaNombre={obtenerNombreCategoria(producto.categoria_id)}
                />
              </Col>
            ))}
          </Row>
        )}
    </Container>
  );
};

export default Catalogo;