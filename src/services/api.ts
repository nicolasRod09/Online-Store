const URL_ENDPOINT = 'https://api.mercadolibre.com/sites/MLB/categories';

const getCategories = async () => {
  const categories = await fetch(URL_ENDPOINT);
  const data = await categories.json();
  return data;
};

const getProductsFromCategoryAndQuery = async (categoryId: string, query: string) => {
  const getProductsCategory = await fetch(`https://api.mercadolibre.com/sites/MLB/search?category=${categoryId}&q=${query}`);
  const response = await getProductsCategory.json();
  return response;
};


const getProductById = async (productId: string) => {
  const getProduct = await fetch(`https://api.mercadolibre.com/items/${productId}`);
  const data = await getProduct.json();
  return data;
};

export { getCategories, getProductsFromCategoryAndQuery, getProductById };
