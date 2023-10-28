import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Detalhes from './components/Detalhes/Detalhes';
import Checkout from './pages/Checkout';
import './App.css';

type ProductInfoType = {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  quantity: number;
  warranty?: string;
  sold_quantity?: string;
  status?: string;
  available_quantity?: number;
  condition?: string;
  shipping?: {
    free_shipping?: boolean;
  };
};

function App() {
  const [cart, setCart] = useState<ProductInfoType[]>([]);
  const cleanCart = () => {
    localStorage.clear();
    setCart([]);
  };
  return (
    <Routes>
      <Route path="/" element={ <Home /> } />
      <Route path="/Cart" element={ <Cart /> } />
      <Route path="/:id" element={ <Detalhes /> } />
      <Route
        path="/Checkout"
        element={ <Checkout
          cleanCart={ cleanCart }
        /> }
      />
    </Routes>
  );
}
export default App;
