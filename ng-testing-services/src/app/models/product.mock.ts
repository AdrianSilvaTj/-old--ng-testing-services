import { faker } from '@faker-js/faker';
import { Product } from './product.model';

export const generateOneProduct = (): Product => {
  return {
    id: faker.string.uuid(),
    title: faker.commerce.productName(),
    price: parseInt(faker.commerce.price(),10),
    description: faker.commerce.productDescription(),
    category: {
      id:faker.string.uuid(),
      name: faker.commerce.department()
    },
    images: [faker.image.url(),faker.image.urlPicsumPhotos()]
  };
}

export const generateManyProducts = (size = 10): Product[] => {
  const products: Product[] = [];
  for (let i = 0; i < size; i++) {
    products.push(generateOneProduct());
  }
  // para evitar mutación de la data
  return [...products]
}
