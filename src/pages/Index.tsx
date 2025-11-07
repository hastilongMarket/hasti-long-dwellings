import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import LogoBackground from "@/components/LogoBackground";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <LogoBackground />
      <div className="relative z-10">
        <Navigation />
        <Hero />
        <Categories />
        <FeaturedProducts />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
