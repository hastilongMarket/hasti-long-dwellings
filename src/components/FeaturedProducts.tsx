import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import homeDecorImg from "@/assets/home-decor-hero.jpg";
import artsCraftsImg from "@/assets/arts-crafts.jpg";
import toysImg from "@/assets/toys.jpg";
import furnitureImg from "@/assets/furniture.jpg";

const products = [
  {
    id: 1,
    name: "Artisan Ceramic Vase",
    price: "$89.99",
    image: homeDecorImg,
    category: "Home Decor",
  },
  {
    id: 2,
    name: "Handmade Watercolor Set",
    price: "$45.99",
    image: artsCraftsImg,
    category: "Arts & Crafts",
  },
  {
    id: 3,
    name: "Wooden Teddy Bear",
    price: "$34.99",
    image: toysImg,
    category: "Toys",
  },
  {
    id: 4,
    name: "Modern Oak Chair",
    price: "$299.99",
    image: furnitureImg,
    category: "Furniture",
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-background via-teal-light/10 to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Featured Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked favorites from our latest collections
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Card
              key={product.id}
              className="group overflow-hidden transition-all duration-300 hover:shadow-xl border-border"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              <CardContent className="p-4 space-y-3">
                <div>
                  <p className="text-xs text-accent font-medium uppercase tracking-wide mb-1">
                    {product.category}
                  </p>
                  <h3 className="font-semibold text-lg text-foreground">
                    {product.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">
                    {product.price}
                  </span>
                  <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
