import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionCategoria = ({ 
    mostrarModalEdicion, setMostrarModalEdicion, categoriaEditar, manejoCambioInputEdicion, actualizarCategoria 
}) => {
    const [deshabilitado, setDeshabilitado] = useState(false);

    const handleActualizar = async () => {
        if (deshabilitado) return;
        setDeshabilitado(true); // Evita peticiones múltiples
        await actualizarCategoria();
        setDeshabilitado(false);
    };

    return (
        <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)} backdrop="static" centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar Categoría</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control 
                            type="text" name="nombre"
                            value={categoriaEditar.nombre || ""}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control 
                            as="textarea" rows={3} name="descripcion"
                            value={categoriaEditar.descripcion || ""}
                            onChange={manejoCambioInputEdicion}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setMostrarModalEdicion(false)}>Cancelar</Button>
                <Button variant="primary" onClick={handleActualizar} disabled={deshabilitado}>
                    Actualizar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEdicionCategoria;