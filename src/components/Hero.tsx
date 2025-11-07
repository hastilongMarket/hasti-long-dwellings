import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/home-decor-hero.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 bg-gradient-to-br from-background via-secondary/30 to-teal-light/20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Dreaming Together
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-xl">
              Discover handcrafted treasures that transform your space into a sanctuary of beauty and warmth.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                View Collections
              </Button>
            </div>
          </div>

          <div className="relative lg:h-[600px] h-[400px] rounded-2xl overflow-hidden shadow-2xl animate-fade-in-delayed">
            <img 
              src={heroImage} 
              alt="Beautiful home decor" 
              className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
