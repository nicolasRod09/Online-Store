import { Link } from 'react-router-dom';
import { ReactPropTypes } from 'react';
import { useState, useEffect } from 'react';
import Categorias from '../Categorias/Categories';
import * as api from '../../services/api';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

type CartItensProps = {
  cartItens: number,
  func: ({ }) => void,
  display: boolean,
}

const Header = ({ cartItens, func, display }: CartItensProps) => {
  const [pesquisar, setPesquisar] = useState('');
  let showSearchInput = display;

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = event.target.value;
    typeof (newSearch)
    setPesquisar(newSearch);
  };

  return (
    <div>
      <div className="header_category">
        <header>
          <Link to="/">
            <label data-testid="home-initial-message" className="img-case">
              <img src="https://www.pngarts.chttps://uploaddeimagens.com.br/images/004/653/953/full/logo.png?1698880726om/files/13/Vector-Cart-Free-PNG-Image.png" alt="icon" className="logo-img" />
              <h1 className="logo">Online Store</h1>
            </label>
          </Link>
          {showSearchInput ? (
            <div className="search-form">
              <input
                type="text"
                placeholder="Pesquise"
                onChange={(event) => handleChange(event)}
                data-testid="query-input"
                className="searchArea"
              />
              <button onClick={func} data-testid="query-button" className="search-button">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
              </button>
            </div>
          ) : null}
          <Link to="/cart" data-testid="shopping-cart-button">
            <img src="https://www.pngarts.com/files/13/Vector-Cart-Free-PNG-Image.png" alt="cartIcon" className="cartImg" />
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