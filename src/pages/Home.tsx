import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import Categories from '../components/Categorias/Categories';
import * as api from '../services/api';

type Product = {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  quantity: number;
};

function Home() {
  const [resultadoBusca, setResultadoBusca] = useState([]);
  const [totalCartItems, setTotalCartItems] = useState(0);
  const [clicked, setClicked] =  useState(false);

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

  const handleCategoryClick = async (categoryId: string | undefined) => {
    if(!categoryId) {
      categoryId = 'MLB1000';
    }
    const response = await api.getProductsFromCategoryAndQuery(categoryId, '');
    console.log(categoryId);
    setResultadoBusca(response.results);
    setClicked(true);
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

  useEffect(() => {
    if (clicked === false) {
      handleCategoryClick();
    }
  })

  return (
    <div>
      <Header />
      <Categories onCategoryClick={ handleCategoryClick } />
      <div className="products-display">
        <div className="products-container">
          <ul>
            {resultadoBusca.map((resultado: any) => (
              <li key={ resultado.id } data-testid="product" className="product-card">
                <Link to={ `/${resultado.id}` } data-testid="product-detail-link" className="product-title">
                  {resultado.title}
                </Link>
                <img src={ resultado.thumbnail } alt={ resultado.title } />
                <p>
                  Preço: R$
                  {' '}
                  {resultado.price}
                </p>
                {resultado.shipping.free_shipping && (
                  <p data-testid="free-shipping" style={ { color: 'green' } } className="free-shipping">
                    Frete grátis!
                  </p>
                )}
                <div>
                  <button
                    data-testid="product-add-to-cart"
                    onClick={ () => addToCart(resultado) }
                    className="add-to-cart-btn"
                  >
                    Adicionar ao carrinho
                  </button>
                  <button className="buy-now-btn">
                    Comprar Agora
                  </button>
                </div>
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
