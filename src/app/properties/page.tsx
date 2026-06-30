import { Suspense } from "react";
import MlsSerchHomePage from "@/main-pages/mlssearch/MlsSearchHomePage";

const MLSSearchPage = () => {
  return (
    <main className="bg-[var(--canvas)] text-[var(--ink)]">
        {/* Page banner — full-bleed pine band */}
        <section className="relative isolate bg-[var(--pine)] text-[var(--on-pine)] overflow-hidden pt-16 pb-6 md:pt-20 md:pb-8">
          {/* Soft gold top hairline marking the dark band */}
          <div
            aria-hidden
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/45 to-transparent"
          />
          {/* Oversized quiet serif mark */}
          <span
            aria-hidden
            className="absolute -top-8 right-6 md:right-16 font-serif italic text-[clamp(8rem,18vw,18rem)] leading-none text-[var(--on-pine)]/[0.05] select-none pointer-events-none"
          >
            Dora
          </span>

          <div className="container-wide relative">
            <div className="flex flex-col gap-6 md:gap-7 max-w-3xl">
              <span className="eyebrow on-dark inline-flex items-center gap-4">
                <span className="inline-block h-px w-12 bg-[var(--gold-300)]" />
                The Collection
              </span>
              <h1
                className="display-lg text-[var(--on-pine)]"
                style={{ fontSize: "clamp(1.75rem, 2.6vw + 0.5rem, 3.25rem)", lineHeight: 1.22 }}
              >
                A gathering of homes,
                <br />
                <em className="italic text-[var(--gold-300)] font-normal">
                  awaiting the right keeper.
                </em>
              </h1>
              <p
                className="lede max-w-xl text-[var(--on-pine-soft)]"
                style={{ fontSize: "clamp(0.9rem, 0.3vw + 0.85rem, 1rem)", lineHeight: 1.8 }}
              >
                Move through a considered inventory of residences and estates,
                shaped by the things that truly matter — place, proportion, and
                the quiet feel of arriving home.
              </p>
            </div>
          </div>
        </section>

      <Suspense fallback={<ListingsLoader />}>
        <MlsSerchHomePage />
      </Suspense>
    </main>
  );
};

function ListingsLoader() {
  return (
    <div className="container-wide py-20 flex items-center justify-center">
      <div className="flex items-center gap-3 text-[var(--ink-faint)] text-sm tracking-[0.2em] uppercase">
        <svg
          className="animate-spin"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
        </svg>
        Loading listings
      </div>
    </div>
  );
}

export default MLSSearchPage;
