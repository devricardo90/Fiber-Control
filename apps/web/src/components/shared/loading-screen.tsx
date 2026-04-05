export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--fc-bg)] px-6">
      <div className="w-full max-w-sm rounded-md border border-[var(--fc-border)] bg-[var(--fc-surface)] p-6">
        <div className="mb-4 h-2 w-24 rounded-full bg-[var(--fc-primary)]" />
        <h1 className="text-lg font-semibold text-[var(--fc-text)]">Fiber Control</h1>
        <p className="mt-2 text-sm text-[var(--fc-text-soft)]">
          Validating operational session.
        </p>
      </div>
    </div>
  );
}
