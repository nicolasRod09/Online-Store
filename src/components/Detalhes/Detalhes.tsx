import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../../services/api';
import Loading from '../Loading/Loading';
import Header from '../Header/Header';

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
      <Header  />
      { details ? (
        <div className="details-card">
          <div className="details-title">
            <h1 data-testid="product-detail-name">{details.title}</h1>
          </div>
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
        </div>
      ) : (
        <Loading />
      )}
      <button
        data-testid="product-detail-add-to-cart"
        onClick={ addToCart }
      >
        Adicionar ao carrinho
      </button>
      <Link to="/" className="mt-4 block">
        Voltar
      </Link>
      <form className="w-full max-w-sm mt-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            data-testid="product-detail-email"
            name="email"
            onChange={handleForm}
            value={form.email}
            className="form-control appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          />
        </div>
        <div className="mb-4">
          <p className="text-gray-700 text-sm font-bold mb-2">Avaliação</p>
          {[1, 2, 3, 4, 5].map((rating) => (
            <label key={rating} className="block text-gray-500">
              {rating}
              <input
                type="radio"
                name="rating"
                onChange={handleForm}
                data-testid={`${rating}-rating`}
                value={rating.toString()}
                className="ml-2"
              />
            </label>
          ))}
        </div>
        <textarea
          data-testid="product-detail-evaluation"
          name="text"
          onChange={handleForm}
          value={form.text}
          className="form-control appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 h-24 resize-none"
        />
        <button
          data-testid="submit-review-btn"
          onClick={handleSubmitReview}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Enviar
        </button>
        {isVerified && (
          <p data-testid="error-msg" className="text-red-500 text-sm mt-2">
            Campos inválidos
          </p>
        )}
      </form>
      <div className="mt-8">
        {evaluations.map((evaluation) => (
          <div key={evaluation.text} className="mb-4 border p-4">
            <h3 data-testid="review-card-email" className="text-lg font-semibold">
              {evaluation.email}
            </h3>
            <h4 data-testid="review-card-rating" className="text-md font-medium mt-2">
              {evaluation.rating}
            </h4>
            <p data-testid="review-card-evaluation" className="text-gray-700 mt-2">
              {evaluation.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Detalhes;
