import { Suspense } from "react";
import MlsSerchHomePage from "@/main-pages/mlssearch/MlsSearchHomePage";

const MLSSearchPage = () => {
  return (
    <main className="bg-[var(--surface-ink)] text-[var(--ink)]">
        {/* Page banner */}
        <section className="relative isolate pt-32 pb-10 md:pt-40 md:pb-14 overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--surface-obsidian)] via-[var(--surface-ink)] to-[var(--surface-ink)]"
          />
          <div
            aria-hidden
            className="absolute -top-24 right-0 w-[520px] h-[520px] rounded-full opacity-[0.07] blur-[120px] bg-[var(--gold-500)]"
          />

          <div className="container-wide relative">
            <div className="flex flex-col gap-4 max-w-3xl">
              <span className="eyebrow inline-flex items-center gap-3">
                <span className="inline-block h-px w-10 bg-[var(--gold-500)]" />
                Listings
              </span>
              <h1 className="display-lg text-[var(--ink)]">
                Every home tells a story.
                <br />
                <span className="italic text-[var(--gold-500)] font-normal">
                  Find yours.
                </span>
              </h1>
              <p className="lede max-w-xl">
                Browse a curated inventory of residential and commercial properties,
                refined by the filters that actually matter — price, place, and the
                feel of a home.
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
