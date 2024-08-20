import React, { useRef, useState } from "react";
import { Pedido, Producto } from "../types/interfaces";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";

interface PedidosProps {
    pedidos: Pedido[];
    productos: Producto[];
    setPedidos: React.Dispatch<React.SetStateAction<Pedido[]>>;
}

export const Pedidos: React.FC<PedidosProps> = ({ pedidos, productos, setPedidos }) => {
    const [pedido, setPedido] = useState<Pedido>({ id: 0, fecha: new Date(), productoNombre: '', cantidad: 1, precio: 0, total: 0 });
    const [pedidoSel, setPedidoSel] = useState<Pedido | null>(null);
    const [mostrarDialogo, setMostrarDialogo] = useState<boolean>(false);
    const [mostrarDialogoEliminar, setMostrarDialogoEliminar] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    const calcularTotal = () => {
        setPedido(prev => ({ ...prev, total: prev.cantidad * prev.precio }));
    }

    const guardar = () => {
        if (pedido.productoNombre === '' || pedido.cantidad <= 0 || pedido.precio <= 0) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Por favor, complete todos los campos correctamente', life: 3000 });
            return;
        }
    
        const nuevoPedido = {
            ...pedido,
            id: pedido.id === 0 ? Math.max(0, ...pedidos.map(p => p.id)) + 1 : pedido.id,
            total: pedido.cantidad * pedido.precio
        };
    
        if (pedido.id === 0) {
            setPedidos(prevPedidos => [...prevPedidos, nuevoPedido]);
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Pedido registrado exitosamente', life: 3000 });
        } else {
            setPedidos(prevPedidos => prevPedidos.map(p => p.id === pedido.id ? nuevoPedido : p));
            toast.current?.show({ severity: 'info', summary: 'Éxito', detail: 'Pedido actualizado exitosamente', life: 3000 });
        }
    
        setPedido({ id: 0, fecha: new Date(), productoNombre: '', cantidad: 1, precio: 0, total: 0 });
        setMostrarDialogo(false);
    }

    const editarPedido = (p: Pedido) => {
        setPedido(p);
        setMostrarDialogo(true);
    }

    const confirmarEliminar = (p: Pedido) => {
        setPedidoSel(p);
        setMostrarDialogoEliminar(true);
    }

    const eliminarPedido = () => {
        setPedidos(pedidos.filter(p => p.id !== pedidoSel?.id));
        setMostrarDialogoEliminar(false);
        toast.current?.show({ severity: 'warn', summary: 'Éxito', detail: 'Pedido eliminado exitosamente', life: 3000 });
    }

    return (
        <div>
            <h1>Pedidos</h1>
            <Button label="Nuevo" icon="pi pi-plus" onClick={() => setMostrarDialogo(true)} />
            <DataTable value={pedidos} selectionMode="single" onRowSelect={(e) => setPedidoSel(e.data)}>
                <Column field="id" header="ID"></Column>
                <Column field="fecha" header="Fecha" body={(rowData) => rowData.fecha.toLocaleDateString()}></Column>
                <Column field="productoNombre" header="Producto"></Column>
                <Column field="cantidad" header="Cantidad"></Column>
                <Column field="precio" header="Precio"></Column>
                <Column field="total" header="Total"></Column>
                <Column body={(rowData) => <Button label="Eliminar" icon="pi pi-trash" onClick={() => confirmarEliminar(rowData)} />}></Column>
                <Column body={(rowData) => <Button label="Editar" icon="pi pi-pencil" onClick={() => editarPedido(rowData)} />}></Column>
            </DataTable>
            <Dialog header="Nuevo Pedido" visible={mostrarDialogo} onHide={() => setMostrarDialogo(false)}>
                <div className="p-field">
                    <label htmlFor="fecha">Fecha</label>
                    <Calendar id="fecha" value={pedido.fecha} onChange={(e) => setPedido({ ...pedido, fecha: e.value as Date })} showIcon />
                </div>
                
                <div className="p-field">
                    <label htmlFor="producto">Producto</label>
                    <Dropdown
    id="producto"
    value={pedido.productoNombre}
    options={productos}
    optionLabel="nombre"
    optionValue="nombre"  // Asegúrate de que optionValue sea igual a 'nombre'
    placeholder="Seleccione un producto"
    onChange={(e) => {
        const productoSeleccionado = productos.find(p => p.nombre === e.value);
        if (productoSeleccionado) {
            setPedido({ 
                ...pedido, 
                productoNombre: e.value,  // Usa e.value para actualizar el nombre del producto
                precio: productoSeleccionado.precio 
            });
            calcularTotal();
        }
    }}
/>


                </div>

                <div className="p-field">
    <label htmlFor="cantidad">Cantidad</label>
    <InputText 
        id="cantidad" 
        type="number" 
        value={pedido.cantidad.toString()} 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const cantidad = parseInt(e.target.value, 10);
            setPedido({ ...pedido, cantidad });
            calcularTotal();
        }}
    />
</div>

<div className="p-field">
    <label htmlFor="precio">Precio</label>
    <InputText 
        id="precio" 
        type="number" 
        value={pedido.precio.toString()}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const precio = parseFloat(e.target.value);
            setPedido({ ...pedido, precio });
            calcularTotal();
        }}
    />
</div>

<div className="p-field">
    <label htmlFor="total">Total</label>
    <InputText 
        id="total" 
        type="number" 
        value={pedido.total.toString()} 
        readOnly 
    />
</div>
                <Button label="Guardar" icon="pi pi-save" onClick={guardar} />
            </Dialog>
            <Dialog header="Eliminar Pedido" visible={mostrarDialogoEliminar} onHide={() => setMostrarDialogoEliminar(false)}>
                <p>¿Está seguro que desea eliminar el pedido con ID {pedidoSel?.id}?</p>
                <Button label="Sí" icon="pi pi-check" onClick={eliminarPedido} />
                <Button label="No" icon="pi pi-times" onClick={() => setMostrarDialogoEliminar(false)} />
            </Dialog>
            <Toast ref={toast} />
        </div>
    );
};