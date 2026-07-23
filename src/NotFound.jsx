import logoBlue from "./images/tgma-logo-coloured.png";
import useDocumentHead from "./useDocumentHead";

export default function NotFound() {
  useDocumentHead({
    title: "Page not found | TGM Academy",
    description: "The page you're looking for doesn't exist or may have moved.",
    path: "/404",
  });
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-[#F6F7FF] px-5 py-12 text-[#31356E] antialiased lg:px-8"
      style={{ fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
    >
      <div className="mx-auto max-w-xl text-center">
        <a href="/" className="mb-8 inline-flex items-center gap-3">
          <img src={logoBlue} alt="TGM Academy" className="h-10 w-auto" />
        </a>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#EA4D25]">404</p>
        <h1
          className="mt-3 text-3xl font-bold leading-tight tracking-[-0.02em] text-[#31356E] md:text-4xl"
          style={{ fontFamily: "Poppins, Inter, ui-sans-serif, system-ui" }}
        >
          Page not found
        </h1>
        <p className="mt-4 text-base leading-7 text-[#35394D]">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-[#EA4D25] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#EA4D25]/20 transition hover:bg-[#cf3f1d]"
        >
          Back to TGM Academy
        </a>
      </div>
    </main>
  );
}
