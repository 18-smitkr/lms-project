import BackButton from "../components/common/BackButton";

export function FeatureLayout({ title, eyebrow = "Learnova", children }) {
  return (
    <main className="min-h-screen bg-[#09090F] px-4 py-10 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <BackButton fallbackTo="/dashboard" label="Back to Dashboard" />
        <p className="text-xs uppercase tracking-[0.25em] text-purple-300">{eyebrow}</p>
        <h1 className="mt-2 text-4xl font-black">{title}</h1>
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}

export function ErrorBanner({ message }) {
  return <div role="alert" className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">{message}</div>;
}

export function LoadingState() {
  return <div className="rounded-2xl border border-white/10 bg-[#101018] p-6 text-gray-300">Loading...</div>;
}

export function EmptyState({ message }) {
  return <div className="rounded-3xl border border-dashed border-white/10 bg-[#101018] p-8 text-center text-gray-400">{message}</div>;
}
