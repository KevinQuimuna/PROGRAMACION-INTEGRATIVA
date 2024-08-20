export interface Autor {
    id: number;
    nombre: string;
    apellido: string;
    }

export interface Libro {
    id: number;
    titulo: string;
    autorId: number;
}
export interface Categoria {
    id: number;
    nombre: string;
    descripcion: string;
}
export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    categoriaId: number;
    precio: number;
}
export interface Pedido {
    id: number;
    fecha: Date;
    productoNombre: string;
    cantidad: number;
    precio: number;
    total: number;
}