import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../../services/api';
import Loading from '../Loading/Loading';

const VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

type DetalhesType = {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  description?: string
};

const INITIAL_DETALHE = {
  id: '',
  title: '',
  price: 0,
  thumbnail: '',
};

type Review = {
  email: string;
  rating: string;
  text: string;
};

const initialState: Review = {
  email: '',
  rating: '',
  text: '',
};

function Detalhes() {
  const [details, setDetails] = useState<DetalhesType>(INITIAL_DETALHE);
  const [totalCartItems, setTotalCartItems] = useState<number>(0);
  const [form, setForm] = useState<Review>(initialState);
  const [evaluations, setEvaluations] = useState<Review[]>([]);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  useEffect(() => {
    const productDetails = async () => {
      const detalhes = await api.getProductById(window.location.pathname);
      setDetails(detalhes);
    };
    productDetails();
    // Atualiza o total de itens no carrinho no estado local
    const totalCartItemsString = localStorage.getItem('totalCartItems');
    const totalItems = totalCartItemsString ? JSON.parse(totalCartItemsString) : 0;
    setTotalCartItems(totalItems);
    // Carrega avaliações do LocalStorage com base no productId
    const storedReviews = localStorage.getItem(`${details.id}`);
    if (storedReviews) {
      setEvaluations(JSON.parse(storedReviews));
    }
  }, [details.id]);

  const addToCart = () => {
    const cartString = localStorage.getItem('cart');
    const cart = cartString ? JSON.parse(cartString) : [];

    const itemCart = cart.find(({ id }: any) => id === details.id);
    if (itemCart) {
      itemCart.quantity += 1;
    } else {
      cart.push({ ...details, quantity: 1 }); // Usando 'details' em vez de 'product'
    }

    const newTotalCartItems = cart.reduce(
      (total: number, item: any) => total + item.quantity,
      0,
    );
    setTotalCartItems(newTotalCartItems);
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const handleForm = (event:
  React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmitReview = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.email || !form.email.match(VALID_EMAIL_REGEX) || !form.rating) {
      setIsVerified(true);
    } else {
      setIsVerified(false);
      const newEvaluations = [...evaluations, form];
      setEvaluations(newEvaluations);
      localStorage.setItem(`reviews-${details.id}`, JSON.stringify(newEvaluations));
      setForm(initialState);
    }
  };
  return (
    <div>
      { details ? (
        <>
          <h1>DETALHES PRODUTO</h1>
          <h3 data-testid="product-detail-name">{details.title}</h3>
          <img
            src={ details.thumbnail }
            alt="Imagem do produto"
            data-testid="product-detail-image"
          />
          <h3 data-testid="product-detail-price">{details.price}</h3>
          <p>{ details.description }</p>
          <Link to="/Cart" data-testid="shopping-cart-button">
            <p data-testid="shopping-cart-size">
              Carrinho (
              {totalCartItems}
              {' '}
              itens)
            </p>
          </Link>
        </>
      ) : (
        <Loading />
      )}
      <button
        data-testid="product-detail-add-to-cart"
        onClick={ addToCart }
      >
        Adicionar ao carrinho
      </button>
      <Link to="/">
        Voltar
      </Link>
      <form>
        <label>
          Email:
          <input
            type="email"
            data-testid="product-detail-email"
            name="email"
            onChange={ handleForm }
            value={ form.email }
          />
        </label>
        <div>
          <p>Avaliação</p>
          <label>
            1
            <input
              type="radio"
              name="rating"
              onChange={ handleForm }
              data-testid="1-rating"
              value="1"
            />
          </label>
          <label>
            2
            <input
              type="radio"
              name="rating"
              onChange={ handleForm }
              data-testid="2-rating"
              value="2"
            />
          </label>
          <label>
            3
            <input
              type="radio"
              name="rating"
              onChange={ handleForm }
              data-testid="3-rating"
              value="3"
            />
          </label>
          <label>
            4
            <input
              type="radio"
              name="rating"
              onChange={ handleForm }
              data-testid="4-rating"
              value="4"
            />
          </label>
          <label>
            5
            <input
              type="radio"
              name="rating"
              onChange={ handleForm }
              data-testid="5-rating"
              value="5"
            />
          </label>
        </div>
        <textarea
          data-testid="product-detail-evaluation"
          name="text"
          onChange={ handleForm }
          value={ form.text }
        />
        <button
          data-testid="submit-review-btn"
          onClick={ handleSubmitReview }
        >
          Enviar
        </button>
        {isVerified && <p data-testid="error-msg">Campos inválidos</p>}
      </form>
      <div>
        {evaluations.map((evaluation) => (
          <div key={ evaluation.text }>
            <h3 data-testid="review-card-email">{evaluation.email}</h3>
            <h4 data-testid="review-card-rating">{evaluation.rating}</h4>
            <p data-testid="review-card-evaluation">{evaluation.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Detalhes;
