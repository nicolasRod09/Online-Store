const URL_ENDPOINT = 'https://api.mercadolibre.com/sites/MLB/categories';
// const URL_TERMO = 'https://api.mercadolibre.com/sites/MLB/search?q=$QUERY';
// const URL_CATEGORY_ID = 'https://api.mercadolibre.com/sites/MLB/search?category=$CATEGORY_ID';
// const URL_CATEGORY_QUERY = `https://api.mercadolibre.com/sites/MLB/search?category=${categoryId}&q=${QUERY}`;

const getCategories = async () => {
  const categories = await fetch(URL_ENDPOINT);
  const data = await categories.json();
  return data;
};

const getProductsFromCategoryAndQuery = async (categoryId: string, query: string) => {
  const getProductsCategory = await fetch(`https://api.mercadolibre.com/sites/MLB/search?category=${categoryId}&q=${query}`);
  const response = await getProductsCategory.json();
  return response;
  // console.log(response);
};
// getProductsFromCategoryAndQuery();

const getProductById = async (productId: string) => {
  const getProduct = await fetch(`https://api.mercadolibre.com/items/${productId}`);
  const data = await getProduct.json();
  return data;
};

export { getCategories, getProductsFromCategoryAndQuery, getProductById };
