import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading/Loading';
import '../style/cart.css'

type Product = {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  quantity: number;
  available_quantity: number;
};

function CartPage() {
  const [cart, setCart] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCartItems, setTotalCartItems] = useState(0); // State para armazenar o total de itens no carrinho

  useEffect(() => {
    const cartString = localStorage.getItem('cart');
    const cartData: Product[] = cartString ? JSON.parse(cartString) : [];
    setCart(cartData);

    // Calcula e atualiza o total de itens no carrinho
    setTotalCartItems(countCartItems(cartData));
  }, []);

  const countCartItems = (cartData: Product[]): number => {
    return cartData.reduce((total, item) => total + item.quantity, 0);
  };

  const updateTotalCartItems = (updatedCart: Product[]): void => {
    const totalItems = countCartItems(updatedCart);
    setTotalCartItems(totalItems);
    localStorage.setItem('totalCartItems', JSON.stringify(totalItems));
  };

  const removeProduct = (index: number) => {
    setLoading(true);
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);

    // Atualiza o total de itens no carrinho
    updateTotalCartItems(updatedCart);

    setLoading(false);
  };

  const addQuantity = (product: Product, index: number) => {
    setLoading(true);
    if (product.quantity < product.available_quantity) {
      const updatedCart = [...cart];
      updatedCart[index].quantity += 1;
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCart(updatedCart);

      // Atualiza o total de itens no carrinho
      updateTotalCartItems(updatedCart);
    }
    setLoading(false);
  };

  const decreaseQuantity = (product: Product, index: number) => {
    setLoading(true);
    if (product.quantity > 1) {
      const updatedCart = [...cart];
      updatedCart[index].quantity -= 1;
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCart(updatedCart);

      // Atualiza o total de itens no carrinho
      updateTotalCartItems(updatedCart);
    }
    setLoading(false);
  };
  const navigate = useNavigate();
  const checkoutPage = async () => {
    navigate('/checkout');
  };

  if (loading) { <Loading />; }
  return (
    <div className="cart-page-container">
      <h2 className="cart-title">Carrinho de Compras</h2>
      {cart.length === 0 ? (
        <p className="empty-cart-message" data-testid="shopping-cart-empty-message">
          Seu carrinho está vazio
        </p>
      ) : (
        <div>
          {cart.map((product, index) => (
            <div key={product.id} className="cart-item">
              <h3 data-testid="shopping-cart-product-name">{product.title}</h3>
              <img src={product.thumbnail} alt={product.title} className="product-image" />
              <p>
                Preço: R${product.price.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 2,
                })}
              </p>
              <p data-testid="shopping-cart-product-quantity">
                Quantidade: {product.quantity}
              </p>
              <button data-testid="remove-product" onClick={() => removeProduct(index)} className="button remove-button">
                Remover
              </button>
              <button
                data-testid="product-increase-quantity"
                onClick={() => addQuantity(product, index)}
                disabled={product.quantity >= product.available_quantity}
                className="button add-button"
              >
                Adicionar
              </button>
              <button data-testid="product-decrease-quantity" onClick={() => decreaseQuantity(product, index)} className="button decrease-button">
                Diminuir
              </button>
            </div>
          ))}
          {cart.length > 0 && (
            <button data-testid="checkout-products" onClick={() => checkoutPage()} className="button checkout-button">
              Finalizar compra
            </button>
          )}
        </div>
      )}
      <p className="total-items">
        Total de itens no carrinho: {totalCartItems}
      </p>
      <Link to="/">Voltar para a Página Inicial</Link>
    </div>
  );
}

export default CartPage;
