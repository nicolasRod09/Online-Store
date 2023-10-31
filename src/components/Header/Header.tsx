import { Link } from 'react-router-dom';
import { ReactPropTypes } from 'react';
import { useState, useEffect } from 'react';
import Categorias from '../Categorias/Categories';
import * as api from '../../services/api';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

type CartItensProps = {
  cartItens: number,
}

const Header = ({cartItens}: CartItensProps) => {
  const [pesquisar, setPesquisar] = useState('');
  const [resultadoBusca, setResultadoBusca] = useState([]);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = event.target.value;
    typeof(newSearch)
    setPesquisar(newSearch);
  };

  const handleSearch = async () => {
    const response = await api.getProductsFromCategoryAndQuery('', pesquisar);
    setResultadoBusca(response.results);
  };

  return (
    <div>
      <div className="header_category">
      <header>
        <label data-testid="home-initial-message" className="img-case">
            <img src="src/img/logo.png" alt="icon" className="logo-img"/>
            <h1 className="logo">Online Store</h1>
          </label>
        <div className="search-form">
          <input
            type="text"
            placeholder="Pesquise"
            onChange={ (event) => handleChange(event) }
            data-testid="query-input"
            className="searchArea"
          />
          <button onClick={ handleSearch } data-testid="query-button" className="search-button">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
          </button>
        </div>
        <Link to="/cart" data-testid="shopping-cart-button">
           <img src="src/img/cartIcon.png" alt="cartIcon" className="cartImg" />
          <span className="cartItemCount">
            {cartItens}
            {' '}
          </span>
        </Link>
      </header>
      </div>
    </div>
  );
};

export default Header;