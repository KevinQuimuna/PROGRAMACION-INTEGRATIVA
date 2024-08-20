import React, { useRef, useState } from "react";
import { Producto, Categoria } from "../types/interfaces";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

interface ProductosProps {
    productos: Producto[];
    categorias: Categoria[];
    setProductos: React.Dispatch<React.SetStateAction<Producto[]>>;
}

export const Productos: React.FC<ProductosProps> = ({ productos, categorias, setProductos }) => {
    const [producto, setProducto] = useState<Producto>({ id: 0, nombre: '', descripcion: '', categoriaId: 0, precio: 0 });
    const [productoSel, setProductoSel] = useState<Producto | null>(null);
    const [mostrarDialogo, setMostrarDialogo] = useState<boolean>(false);
    const [mostrarDialogoEliminar, setMostrarDialogoEliminar] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    const guardar = () => {
        if (producto.id === 0) {
            setProductos([...productos, { ...producto, id: productos.length + 1 }]);
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Producto registrado exitosamente', life: 3000 });
        } else {
            setProductos(productos.map((p) => p.id === producto.id ? producto : p));
            toast.current?.show({ severity: 'info', summary: 'Éxito', detail: 'Producto actualizado exitosamente', life: 3000 });
        }
        setProducto({ id: 0, nombre: '', descripcion: '', categoriaId: 0, precio: 0 });
        setMostrarDialogo(false);
    }

    const editarProducto = (p: Producto) => {
        setProducto(p);
        setMostrarDialogo(true);
    }

    const confirmarEliminar = (p: Producto) => {
        setProductoSel(p);
        setMostrarDialogoEliminar(true);
    }

    const eliminarProducto = () => {
        setProductos(productos.filter((p) => p.id !== productoSel?.id));
        setMostrarDialogoEliminar(false);
        toast.current?.show({ severity: 'warn', summary: 'Éxito', detail: 'Producto eliminado exitosamente', life: 3000 });
    }

    return (
        <div>
            <h1>Productos</h1>
            <Button label="Nuevo"
                icon="pi pi-plus"
                onClick={() => setMostrarDialogo(true)}
            />
            <DataTable value={productos}
                selectionMode="single"
                onRowSelect={(e) => setProductoSel(e.data)}>
                <Column field="id" header="ID"></Column>
                <Column field="nombre" header="Nombre"></Column>
                <Column field="descripcion" header="Descripción"></Column>
                <Column field="categoriaId" header="Categoría"
                    body={(rowData) => {
                        const categoria = categorias.find((c) => c.id === rowData.categoriaId);
                        return categoria ? categoria.nombre : '';
                    }}
                />
                <Column field="precio" header="Precio"></Column>
                <Column body={(rowData) =>
                    <Button label="Eliminar"
                        icon="pi pi-trash"
                        onClick={() => confirmarEliminar(rowData)}
                    />
                }></Column>
                <Column body={(rowData) =>
                    <Button label="Editar"
                        icon="pi pi-pencil"
                        onClick={() => editarProducto(rowData)}
                    />
                }></Column>
            </DataTable>
            <Dialog header="Nuevo Producto"
                visible={mostrarDialogo}
                onHide={() => setMostrarDialogo(false)}>
                <div className="p-field">
                    <label htmlFor="nombre">Nombre</label>
                    <InputText id="nombre" value={producto.nombre}
                        onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
                    />
                </div>

                <div className="p-field">
                    <label htmlFor="descripcion">Descripción</label>
                    <InputText id="descripcion" value={producto.descripcion}
                        onChange={(e) => setProducto({ ...producto, descripcion: e.target.value })}
                    />
                </div>

                <div className="p-field">
                    <label htmlFor="categoria">Categoría</label>
                    <Dropdown
                        id="categoria"
                        value={producto.categoriaId}
                        options={categorias}
                        optionLabel="nombre"
                        optionValue="id"
                        placeholder="Seleccione una categoría"
                        onChange={(e) => setProducto({ ...producto, categoriaId: e.value })}
                    />
                </div>

                <div className="p-field">
                    <label htmlFor="precio">Precio</label>
                    <InputText 
                        id="precio" 
                        type="number" 
                        value={producto.precio.toString()}  
                        onChange={(e) => setProducto({ ...producto, precio: parseFloat(e.target.value) })} 
                    />
                </div>

                <Button label="Guardar" icon="pi pi-save" onClick={guardar} />
            </Dialog>
            <Dialog header="Eliminar Producto"
                visible={mostrarDialogoEliminar}
                onHide={() => setMostrarDialogoEliminar(false)}>
                <p>¿Está seguro que desea eliminar el producto {productoSel?.nombre}?</p>
                <Button label="Sí" icon="pi pi-check" onClick={eliminarProducto} />
                <Button label="No" icon="pi pi-times" onClick={() => setMostrarDialogoEliminar(false)} />
            </Dialog>
            <Toast ref={toast} />
        </div>
    );
};
