import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Categorias from '../components/Categorias/Categorias';
import * as api from '../services/api';

type Product = {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  quantity: number;
};

function Home() {
  const [pesquisar, setPesquisar] = useState('');
  const [resultadoBusca, setResultadoBusca] = useState([]);
  const [totalCartItems, setTotalCartItems] = useState(0);

  useEffect(() => {
    const totalCartItemsString = localStorage.getItem('totalCartItems');
    const totalItems = totalCartItemsString ? JSON.parse(totalCartItemsString) : 0;
    setTotalCartItems(totalItems);
  }, []);

  const updateTotalCartItems = (cart: Product[]) => {
    const newTotalCartItems = cart.reduce(
      (total: number, item: any) => total + item.quantity,
      0,
    );
    setTotalCartItems(newTotalCartItems);
    localStorage.setItem('totalCartItems', JSON.stringify(newTotalCartItems));
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = event.target.value;
    setPesquisar(newSearch);
  };

  const handleSearch = async () => {
    const recebe = await api.getProductsFromCategoryAndQuery('', pesquisar);
    setResultadoBusca(recebe.results);
  };

  const handleCategoryClick = async (categoryId: string) => {
    const recebe = await api.getProductsFromCategoryAndQuery(categoryId, '');
    setResultadoBusca(recebe.results);
  };

  const addToCart = (product: any) => {
    const cartString = localStorage.getItem('cart');
    const cart: Product[] = cartString ? JSON.parse(cartString) : [];

    const itemCart = cart.find(({ id }: any) => id === product.id);
    if (itemCart) {
      itemCart.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    updateTotalCartItems(cart);

    localStorage.setItem('cart', JSON.stringify(cart));
  };

  return (
    <div>
      <header>
        <div data-testid="home-initial-message" className="img-case">
          <img src="/src/img/loremIpsum.png" alt="icon" />
        </div>
        <div className="input-form">
          <input
            type="text"
            placeholder="Digite o que você busca"
            onChange={ (event) => handleChange(event) }
            data-testid="query-input"
            className="inputArea"
          />
          <button onClick={ handleSearch } data-testid="query-button">
            PESQUISAR
          </button>
        </div>
        <Link to="/cart" data-testid="shopping-cart-button">
          <img src="/src/img/cartIcon.png" alt="cartIcon" className="cartImg" />
          <span className="cartItemCount">
            {totalCartItems}
            {' '}
          </span>
        </Link>
      </header>
      <div className="products-display">
        <Categorias onCategoryClick={ handleCategoryClick } />
        <div className="products-container">
          <ul>
            {resultadoBusca.map((resultado: any) => (
              <li key={ resultado.id } data-testid="product" className="product-card">
                <Link to={ `/${resultado.id}` } data-testid="product-detail-link">
                  {resultado.title}
                </Link>
                <img src={ resultado.thumbnail } alt={ resultado.title } />
                <p>
                  Preço: R$
                  {' '}
                  {resultado.price}
                </p>
                {resultado.shipping.free_shipping && (
                  <p data-testid="free-shipping" style={ { color: 'green' } }>
                    Frete grátis!
                  </p>
                )}
                <button
                  data-testid="product-add-to-cart"
                  onClick={ () => addToCart(resultado) }
                >
                  Adicionar ao carrinho
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p data-testid="shopping-cart-size" style={ { display: 'none' } }>
        {totalCartItems}
      </p>
    </div>
  );
}

export default Home;
