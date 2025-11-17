import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import homeDecorImg from "@/assets/home-decor-hero.jpg";

const pujaProducts = [
  {
    id: 100,
    name: "Brass Diya Set",
    price: "$29.99",
    image: homeDecorImg,
    category: "Puja" as const,
    featured: false,
  },
  {
    id: 101,
    name: "Incense Holder",
    price: "$19.99",
    image: homeDecorImg,
    category: "Puja" as const,
    featured: false,
  },
  {
    id: 102,
    name: "Prayer Bell",
    price: "$24.99",
    image: homeDecorImg,
    category: "Puja" as const,
    featured: false,
  },
  {
    id: 103,
    name: "Sacred Thali",
    price: "$39.99",
    image: homeDecorImg,
    category: "Puja" as const,
    featured: false,
  },
];

const PujaSection = () => {
  const { addToCart } = useCart();

  return (
    <section id="puja" className="py-20 bg-gradient-to-br from-secondary/20 via-background to-teal-light/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Puja Essentials
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sacred items for your spiritual practices and devotion
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pujaProducts.map((product, index) => (
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
                  <Button 
                    size="sm" 
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PujaSection;
