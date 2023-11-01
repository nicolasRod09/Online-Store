import { Link } from 'react-router-dom';
import { useState, useEffect, createContext } from 'react';
import Header from '../components/Header/Header';
import Categories from '../components/Categorias/Categories';
import * as api from '../services/api';
import Detalhes from '../components/Detalhes/Detalhes';

type Product = {
  id: number;
  title: string;
  pictures: {
    secure_url: string;
  }[];
  price: number;
  quantity: number;
  shipping: {
    free_shipping: boolean;
  }
  seller: {
    nickname: string;
  }
};

const INITIAL_VALUE: Product[] = [{
  id: 0,
  title: '',
  pictures: [{
    secure_url: '',
  }],
  price: 1,
  quantity: 1,
  shipping: {
    free_shipping: false,
  },
  seller: {
    nickname: '',
  },
}];

function Home() {
  const [resultadoBusca, setResultadoBusca] = useState<Product[]>(INITIAL_VALUE);
  const [totalCartItems, setTotalCartItems] = useState(0);
  const [pesquisar, setPesquisar] = useState('');
  const [showTitle, setShowTitle] = useState(true);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const savedResultadoBusca = localStorage.getItem('resultadoBusca');
    if (savedResultadoBusca) {
      setResultadoBusca(JSON.parse(savedResultadoBusca));
    }
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
    if (!categoryId) {
      categoryId = 'MLB1000';
    }
    const response = await api.getProductsFromCategoryAndQuery(categoryId, '');
    setResultadoBusca(response.results);
    setClicked(true);
    setShowTitle(true);
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

  const handleSearch = async () => {
    const recebe = await api.getProductsFromCategoryAndQuery('', pesquisar);
    setResultadoBusca(recebe.results);
    setShowTitle(true);
  };

  useEffect(() => {
    if (clicked === false && !localStorage.getItem('resultadoBusca')) {
      handleCategoryClick();
    }
  })

  useEffect(() => {
    localStorage.setItem('resultadoBusca', JSON.stringify(resultadoBusca));
  }, [resultadoBusca]);


  return (
    <div>
      <Header display={true} cartItens={totalCartItems} func={handleSearch} />
      <Categories onCategoryClick={handleCategoryClick} />
      <div className="products-display">
        <div className="products-container">
          <ul>
            {resultadoBusca.map((resultado: any) => {
              const price = resultado.price.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
              }
              );
              return (
                <li key={resultado.id} data-testid="product" className="product-card">
                  <img src={resultado.thumbnail} alt={resultado.title} />
                  <Link to={`/${resultado.id}`} data-testid="product-detail-link" className="product-title">
                    {resultado.title}
                  </Link>
                  <br />
                  <p className="price">
                    {price}
                  </p>
                  {resultado.shipping.free_shipping && (
                    <p data-testid="free-shipping" style={{ color: 'green' }} className="free-shipping">
                      Frete grátis!
                    </p>
                  )}
                  <div>
                    <button
                      data-testid="product-add-to-cart"
                      onClick={() => addToCart(resultado)}
                      className="add-to-cart-btn"
                    >
                      Adicionar ao carrinho
                    </button>
                    <button className="buy-now-btn">
                      Comprar Agora
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
