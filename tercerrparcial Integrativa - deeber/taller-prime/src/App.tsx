import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './componets/Navbar';
import { Inicio } from './componets/Inicio';
import { Productos } from './componets/Producto';
import { Categorias } from './componets/Categoria';
import { Pedidos } from './componets/Pedido'; 
import { Categoria, Producto, Pedido } from './types/interfaces';

const App: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([
    { id: 1, nombre: 'Electrónica', descripcion: 'Todo tipo de dispositivos electrónicos' },
    { id: 2, nombre: 'Ropa', descripcion: 'Prendas de vestir de diferentes estilos' }
  ]);

  const [productos, setProductos] = useState<Producto[]>([
    { id: 1, nombre: 'Laptop', descripcion: 'DELL', categoriaId: 1, precio: 1500 },
    { id: 2, nombre: 'Camiseta', descripcion: 'Buen estado', categoriaId: 2, precio: 20 }
  ]);

  const [pedidos, setPedidos] = useState<Pedido[]>([
    { id: 1, fecha: new Date(), productoNombre: 'Laptop', cantidad: 1, precio: 1500, total: 1500 },
    { id: 2, fecha: new Date(), productoNombre: 'Camiseta', cantidad: 2, precio: 20, total: 40 }
  ]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/productos" element={<Productos categorias={categorias} productos={productos} setProductos={setProductos} />} />
        <Route path="/categorias" element={<Categorias categorias={categorias} setCategorias={setCategorias} />} />
        <Route path="/pedidos" element={<Pedidos pedidos={pedidos} setPedidos={setPedidos} productos={productos} />} />
      </Routes>
    </Router>
  );
}

export default App;
