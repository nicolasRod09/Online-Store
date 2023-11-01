import React, { useState, useEffect } from 'react';
import { Link, redirect, useNavigate } from 'react-router-dom';
import '../style/checkout.css';

type Product = {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  quantity: number;
};

type CheckoutProps = {
  cleanCart: () => void;
};

function CheckoutPage(prop: CheckoutProps) {
  const { cleanCart } = prop;
  const [cart, setCart] = useState<Product[]>([]);
  const [errorMsg, setErrorMsg] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    cpf: '',
    phone: '',
    cep: '',
    address: '',
    paymentMethod: '',
  });

  useEffect(() => {
    const cartString = localStorage.getItem('cart');
    const cartData: Product[] = cartString ? JSON.parse(cartString) : [];
    setCart(cartData);
  }, []);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const formKeys = Object.values(formData);
  const inputValue = formKeys.some((value) => value === '');

  function handleSubmit() {
    if (inputValue) {
      setErrorMsg(true);
    } else {
      setErrorMsg(false);
      localStorage.clear();
      cleanCart();
      navigate('/');
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Checkout - Carrinho de Compras</h2>
      <ul className="checkout-items-list">
        {cart.map((product) => (
          <li key={product.id} className="checkout-item">
            <h3>{product.title}</h3>
            <img src={product.thumbnail} alt={product.title} />
            <p className="checkout-item-price">
              Preço: R$
              {product.price}
            </p>
            <p className="checkout-item-quantity">
              Quantidade:
              {product.quantity}
            </p>
          </li>
        ))}
      </ul>
      <p className="checkout-total">
        Total da Compra: R$
        {calculateTotal()}
      </p>
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="checkout-user-data">
          <input
            type="text"
            name="fullname"
            placeholder="Nome completo"
            data-testid="checkout-fullname"
            value={formData.fullname}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            data-testid="checkout-email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="cpf"
            placeholder="CPF"
            data-testid="checkout-cpf"
            value={formData.cpf}
            onChange={handleChange}
          />
          <br />
          <input
            type="text"
            name="phone"
            placeholder="Telefone"
            data-testid="checkout-phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            type="text"
            name="cep"
            placeholder="CEP"
            data-testid="checkout-cep"
            value={formData.cep}
            onChange={handleChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Endereço"
            data-testid="checkout-address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className="checkout-payment-method">
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="boleto"
              data-testid="ticket-payment"
              onChange={handleChange}
            />
            Boleto
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="visa"
              data-testid="visa-payment"
              onChange={handleChange}
            />
            Visa
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="mastercard"
              data-testid="master-payment"
              onChange={handleChange}
            />
            MasterCard
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="elo"
              data-testid="elo-payment"
              onChange={handleChange}
            />
            Elo
          </label>
        </div>
        <button type="submit" data-testid="checkout-btn" className="checkout-button" onClick={handleSubmit}>
          Finalizar Compra
        </button>
        {errorMsg && <p data-testid="error-msg" className="checkout-error-message">Campos inválidos</p>}
      </form>
      <Link to="/" className="checkout-continue-shopping-link">Continuar Comprando</Link>
    </div>
  );
}

export default CheckoutPage;
