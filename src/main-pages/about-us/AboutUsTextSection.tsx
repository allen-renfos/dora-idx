"use client";

export const AboutUsTextSection = () => {
  return (
    <section className="bg-[var(--canvas-2)] text-[var(--ink)] section-pad relative overflow-hidden">
      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-2">
            <h2 className="display-lg leading-tight">
              A quiet circle for the region&rsquo;s most{" "}
              <em className="text-[var(--gold-deep)]">considered</em> homes.
            </h2>
          </div>
          <div className="lg:col-span-1 border-l border-[var(--line)] pl-8">
            <p className="lede">
              Your move is the whole of our attention — and we stay beside you
              through every step of it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
