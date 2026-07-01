type AppErrorStateProps = {
  title: string;
  message: string;
  detail?: string;
};

export function AppErrorState({ detail, message, title }: AppErrorStateProps) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-950">
      <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
        No se pudo cargar esta vista
      </p>
      <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6">{message}</p>
      {detail ? (
        <p className="mt-4 rounded-md border border-amber-200 bg-white/60 px-3 py-2 text-xs text-amber-900">
          {detail}
        </p>
      ) : null}
    </div>
  );
}
