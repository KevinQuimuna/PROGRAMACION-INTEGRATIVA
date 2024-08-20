import React, { useRef, useState } from "react";
import { Categoria } from "../types/interfaces";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

interface CategoriasProps {
    categorias: Categoria[];
    setCategorias: React.Dispatch<React.SetStateAction<Categoria[]>>;
}

export const Categorias: React.FC<CategoriasProps> = ({ categorias, setCategorias }) => {
    const [categoria, setCategoria] = useState<Categoria>({ id: 0, nombre: '', descripcion: '' });
    const [categoriaSel, setCategoriaSel] = useState<Categoria | null>(null);
    const [mostrarDialogo, setMostrarDialogo] = useState<boolean>(false);
    const [mostrarDialogoEliminar, setMostrarDialogoEliminar] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    const guardar = () => {
        if (categoria.nombre.trim() === '' || categoria.descripcion.trim() === '') {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Por favor, complete todos los campos', life: 3000 });
            return;
        }

        if (categoria.id === 0) {
            setCategorias([...categorias, { ...categoria, id: categorias.length + 1 }]);
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Categoría registrada exitosamente', life: 3000 });
        } else {
            setCategorias(categorias.map((c) => c.id === categoria.id ? categoria : c));
            toast.current?.show({ severity: 'info', summary: 'Éxito', detail: 'Categoría actualizada exitosamente', life: 3000 });
        }
        setCategoria({ id: 0, nombre: '', descripcion: '' });
        setMostrarDialogo(false);
    }

    const editarCategoria = (c: Categoria) => {
        setCategoria(c);
        setMostrarDialogo(true);
    }

    const confirmarEliminar = (c: Categoria) => {
        setCategoriaSel(c);
        setMostrarDialogoEliminar(true);
    }

    const eliminarCategoria = () => {
        setCategorias(categorias.filter((c) => c.id !== categoriaSel?.id));
        setMostrarDialogoEliminar(false);
        toast.current?.show({ severity: 'warn', summary: 'Éxito', detail: 'Categoría eliminada exitosamente', life: 3000 });
    }

    return (
        <div>
            <h1>Categorías</h1>
            <Button label="Nuevo"
                icon="pi pi-plus"
                onClick={() => setMostrarDialogo(true)}
            />
            <DataTable value={categorias}
                selectionMode="single"
                onRowSelect={(e) => setCategoriaSel(e.data)}>
                <Column field="id" header="ID"></Column>
                <Column field="nombre" header="Nombre"></Column>
                <Column field="descripcion" header="Descripción"></Column>
                <Column body={(rowData) =>
                    <Button label="Eliminar"
                        icon="pi pi-trash"
                        onClick={() => confirmarEliminar(rowData)}
                    />
                }></Column>
                <Column body={(rowData) =>
                    <Button label="Editar"
                        icon="pi pi-pencil"
                        onClick={() => editarCategoria(rowData)}
                    />
                }></Column>
            </DataTable>
            <Dialog header="Nueva Categoría"
                visible={mostrarDialogo}
                onHide={() => setMostrarDialogo(false)}>
                <div className="p-field">
                    <label htmlFor="nombre">Nombre</label>
                    <InputText id="nombre" value={categoria.nombre}
                        onChange={(e) => setCategoria({ ...categoria, nombre: e.target.value })}
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="descripcion">Descripción</label>
                    <InputText id="descripcion" value={categoria.descripcion}
                        onChange={(e) => setCategoria({ ...categoria, descripcion: e.target.value })}
                    />
                </div>
                <Button label="Guardar" icon="pi pi-save" onClick={guardar} />
            </Dialog>
            <Dialog header="Eliminar Categoría"
                visible={mostrarDialogoEliminar}
                onHide={() => setMostrarDialogoEliminar(false)}>
                <p>¿Está seguro que desea eliminar la categoría {categoriaSel?.nombre}?</p>
                <Button label="Sí" icon="pi pi-check" onClick={eliminarCategoria} />
                <Button label="No" icon="pi pi-times" onClick={() => setMostrarDialogoEliminar(false)} />
            </Dialog>
            <Toast ref={toast} />
        </div>
    );
};
