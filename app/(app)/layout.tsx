import Link from "next/link";

const navigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/productos", label: "Productos" },
  { href: "/stock", label: "Stock" },
  { href: "/movimientos", label: "Movimientos" },
  { href: "/sucursales", label: "Sucursales" },
];

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white px-5 py-6 lg:flex lg:flex-col">
        <div>
          <p className="text-sm font-medium text-emerald-700">Demo funcional</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Super Mc Cotas</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            StockFlow: que entra, que sale y cuanto queda en cada sucursal.
          </p>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {navigation.map((item) => (
            <Link
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-medium text-slate-900">StockFlow para Super Mc Cotas</p>
          <p className="mt-1">
            Demo conectada a base de datos. Los ingresos y salidas modifican el stock real.
          </p>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur lg:hidden">
          <p className="text-sm font-medium text-emerald-700">Demo funcional</p>
          <h1 className="text-xl font-semibold">StockFlow - Super Mc Cotas</h1>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {navigation.map((item) => (
              <Link
                className="whitespace-nowrap rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
