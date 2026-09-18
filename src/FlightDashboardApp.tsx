import React from 'react';
import { INITIAL_KPIS } from './data/mockKpis';
import { KpiInstrumentGauge } from './components/KpiInstrumentGauge';

export default function FlightDashboardApp() {
  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col font-sans">
      <header className="px-6 py-4 border-b border-stone-800 bg-stone-950/50 shadow-sm flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-widest uppercase text-stone-200">ZETDC Flight Deck</h1>
        <div className="text-xs font-mono text-stone-500 uppercase tracking-wider">
          Aviation Instruments Theme
        </div>
      </header>

      <main className="flex-1 p-8 sm:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-16 place-items-center">
            {INITIAL_KPIS.map((kpi) => (
              <KpiInstrumentGauge key={kpi.id} kpi={kpi} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
