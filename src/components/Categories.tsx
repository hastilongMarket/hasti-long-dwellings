import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import homeDecorImg from "@/assets/home-decor-hero.jpg";
import artsCraftsImg from "@/assets/arts-crafts.jpg";
import toysImg from "@/assets/toys.jpg";
import furnitureImg from "@/assets/furniture.jpg";

const categories = [
  {
    id: "home-decor",
    name: "Home Decor",
    description: "Elegant pieces for your living space",
    image: homeDecorImg,
  },
  {
    id: "arts-crafts",
    name: "Arts & Crafts",
    description: "Handmade creativity at its finest",
    image: artsCraftsImg,
  },
  {
    id: "toys",
    name: "Toys",
    description: "Delightful treasures for little ones",
    image: toysImg,
  },
  {
    id: "furniture",
    name: "Furniture",
    description: "Timeless pieces for every room",
    image: furnitureImg,
  },
];

const Categories = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-secondary/40 via-background to-teal-light/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Explore Our Collections
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each category is carefully curated with love and attention to detail
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card
              key={category.id}
              id={category.id}
              className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl border-0 bg-card"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:translate-y-0">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-sm opacity-90 mb-4">{category.description}</p>
                  <div className="flex items-center gap-2 text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-medium">Shop Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
