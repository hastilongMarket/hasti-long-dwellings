import homeDecorImg from "@/assets/home-decor-hero.jpg";
import artsCraftsImg from "@/assets/arts-crafts.jpg";
import toysImg from "@/assets/toys.jpg";
import furnitureImg from "@/assets/furniture.jpg";

export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: "Home Decor" | "Arts & Crafts" | "Toys" | "Furniture" | "Puja";
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Artisan Ceramic Vase",
    price: "$89.99",
    image: homeDecorImg,
    category: "Home Decor",
    featured: true,
  },
  {
    id: 2,
    name: "Handmade Watercolor Set",
    price: "$45.99",
    image: artsCraftsImg,
    category: "Arts & Crafts",
    featured: true,
  },
  {
    id: 3,
    name: "Wooden Teddy Bear",
    price: "$34.99",
    image: toysImg,
    category: "Toys",
    featured: true,
  },
  {
    id: 4,
    name: "Modern Oak Chair",
    price: "$299.99",
    image: furnitureImg,
    category: "Furniture",
    featured: true,
  },
  // Add more products here as needed
];

export const getFeaturedProducts = () => {
  return products.filter((product) => product.featured);
};

export const getProductsByCategory = (category: Product["category"]) => {
  return products.filter((product) => product.category === category);
};

export const getProductById = (id: number) => {
  return products.find((product) => product.id === id);
};
