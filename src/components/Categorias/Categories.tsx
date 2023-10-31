import { useState, useEffect } from 'react';
import { getCategories } from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

type TypeState = {
  name: string
  id?: string
};

interface CategoriasProps {
  onCategoryClick: (categoryId: string) => void;
}

function Categorias({ onCategoryClick }: CategoriasProps) {
  const [categories, setCategories] = useState<TypeState[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const limitCategories =  categories.slice(0, 12);

  useEffect(() => {
    const receiveAllCategories = async () => {
      const receiveCategories = await getCategories();
      setCategories(receiveCategories);
    };
    receiveAllCategories();
  }, []);

  // console.log(categories);

  return (
    <div className="container">
      <div className="category-dropdown-menu">
        <a
          data-testid="category"
          onClick={() => {
          onCategoryClick('');
          setShowDropdown(!showDropdown);
          }}
          className="category-button"
        >
          <label className="categoryLabel">
            <FontAwesomeIcon icon={faBars} className="dropMenu" />
            <h3 className="categoryName">Categorias</h3>
          </label>
        </a>
        {showDropdown && (
          <div className="category-dropdown-content">
            {categories.map((category) => (
              <a
                key={category.id}
                data-testid="category"
                onClick={() => {
                  onCategoryClick(category.id || '');
                  setShowDropdown(false); // Fechar o dropdown após selecionar uma categoria
                }}
              >
                {category.name}
              </a>
            ))}
          </div>
        )}
      </div>
      {limitCategories.map((category) => (
        <div key={ category.id } className="category-dropdown">
          <a
            data-testid="category"
            onClick={ () => onCategoryClick(category.id || '') }
            className="category-button"
          >
            {category.name}
          </a>
        </div>
      ))}
    </div>
  );
}

export default Categorias;
