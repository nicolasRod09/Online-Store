import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../../services/api';
import Loading from '../Loading/Loading';
import Header from '../Header/Header';
import '../../style/details.css'

type DetalhesType = {
  id: string;
  title: string;
  pictures: [{
    secure_url: string;
  }];
  price: number;
  description?: string;
  category_id: string;
};

const INITIAL_DETALHE: DetalhesType = {
  id: '',
  title: '',
  price: 0,
  pictures: [{
    secure_url: '',
  }],
  category_id: '',
};

type Review = {
  nickname: string;
  rating: string;
  text: string;
};

const initialState: Review = {
  nickname: '',
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
      cart.push({ ...details, quantity: 1 });
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
    if (!form.nickname || !form.rating) {
      setIsVerified(true);
    } else {
      setIsVerified(false);
      const newEvaluations = [...evaluations, form];
      setEvaluations(newEvaluations);
      localStorage.setItem(`reviews-${details.id}`, JSON.stringify(newEvaluations));
      setForm(initialState);
    }
  };

  const handleSearch = async () => {
    console.log('Header');
  };

  console.log(details.category_id);

  return (
    <div>
      <Header cartItens={totalCartItems} func={handleSearch} display={false} />
      <div className="details-display">
        {details ? (
          <div>
            <div className="product-name">
              <h1 data-testid="product-detail-name" className="product-detail-name">{details.title}</h1>
            </div>
            <div className="card">
              <div className="detail-card">
                <div className="centralize">
                  <main>
                    <div className="product">
                      <div className="detail-img">
                        <img
                          src={details.pictures[0].secure_url}
                          alt="Imagem do produto"
                          data-testid="product-detail-image"
                          className="product-img"
                        />
                      </div>
                      <div className="product-card">
                        <h2
                          data-testid="product-detail-price"
                          className="product-price"
                        >
                          {details.price.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                            minimumFractionDigits: 2,
                          })
                          }
                        </h2>
                        <button
                          data-testid="product-detail-add-to-cart"
                          onClick={addToCart}
                          className="add-to-cart-btn"
                        >
                          Adicionar ao carrinho
                        </button>
                        {details.description ? (
                          <div className="details-description">
                            <h4>Descrição</h4>
                            <p>{details.description}</p>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    <div className="form">
                      <form className="avaliation-form">
                        <div className="user">
                          <div className="identification">
                            <label className="nickname-label" htmlFor="nickname">
                              <p className="commentary">
                                Usuario:
                              </p>
                            </label>
                            <br />
                            <input
                              type="email"
                              data-testid="product-detail-email"
                              name="nickname"
                              onChange={handleForm}
                              value={form.nickname}
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <p>Avaliação:</p>
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <label key={rating}>
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

                        <div className="commentary-box">
                          <label>
                            <p className="commentary">
                              Comentário:
                            </p>
                            <br />
                            <textarea
                              data-testid="product-detail-evaluation"
                              name="text"
                              onChange={handleForm}
                              value={form.text}
                              className="textArea"
                              rows={5}
                              cols={40}
                              style={{ resize: 'none' }}
                            />
                          </label>
                        </div>
                        <br />
                        <button
                          data-testid="submit-review-btn"
                          onClick={handleSubmitReview}
                        >
                          Enviar
                        </button>
                        {isVerified && (
                          <p data-testid="error-msg">
                            Campos inválidos
                          </p>
                        )}
                      </form>
                    </div>
                  </main>
                </div>
              </div>
              {evaluations.length ? (
                <div className="evaluation-map">
                  {evaluations.length ? (
                    <h2>Comentários</h2>
                  ) : (
                    ''
                  )}
                  {evaluations.map((evaluation) => (
                    <div key={evaluation.text} className="evaluation">
                      <h3 data-testid="review-card-email">
                        {evaluation.nickname}
                      </h3>
                      <h4 data-testid="review-card-rating">
                        {'Avaliação: '}
                        {evaluation.rating}
                      </h4>
                      <p data-testid="review-card-evaluation">
                        {evaluation.text}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                ''
              )}
              <Link to="/" className="back-btn">
                Voltar
              </Link>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </div >
  );
}
export default Detalhes;
