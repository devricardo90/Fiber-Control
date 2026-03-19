export function DashboardOverview() {
  return (
    <div className="flex-1 w-full max-w-[1600px] mx-auto p-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview (MOCK)</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-2xl border flex flex-col justify-between">
          <span className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Revenue</span>
          <h3 className="text-4xl font-black mt-2">$42k</h3>
        </div>
        <div className="bg-card p-6 rounded-2xl border flex flex-col justify-between">
          <span className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Customers</span>
          <h3 className="text-4xl font-black mt-2">1,240</h3>
        </div>
        <div className="bg-card p-6 rounded-2xl border flex flex-col justify-between">
          <span className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Overdue</span>
          <h3 className="text-4xl font-black mt-2 text-destructive">12</h3>
        </div>
        <div className="bg-card p-6 rounded-2xl border flex flex-col justify-between">
          <span className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Suspended</span>
          <h3 className="text-4xl font-black mt-2">3</h3>
        </div>
      </div>
    </div>
  );
}

