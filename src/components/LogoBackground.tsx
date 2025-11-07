import logo from "@/assets/hastilong-logo.png";

const LogoBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Top right logo */}
      <div className="absolute -top-20 -right-20 w-96 h-96 opacity-[0.08]">
        <img 
          src={logo} 
          alt="" 
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Bottom left logo */}
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] opacity-[0.12]">
        <img 
          src={logo} 
          alt="" 
          className="w-full h-full object-contain rotate-12"
        />
      </div>
      
      {/* Center watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-[0.06]">
        <img 
          src={logo} 
          alt="" 
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-background/20 to-transparent" />
    </div>
  );
};

export default LogoBackground;
