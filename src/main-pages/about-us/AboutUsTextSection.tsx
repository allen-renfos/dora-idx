"use client";

export const AboutUsTextSection = () => {
  return (
    <section className="bg-black text-white py-20 md:py-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#EDB75E]/5 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-2">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal leading-tight tracking-tight">
              Exclusive Network for the <br /> World's Most <span className="text-[#EDB75E] text-glow-gold">Successful</span> Agents
            </h2>
          </div>
          <div className="lg:col-span-1 border-l border-white/10 pl-8">
            <p className="text-lg md:text-xl leading-relaxed opacity-60 font-light">
              Your success is our top priority, and we are committed to walking with you every step of the way.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
