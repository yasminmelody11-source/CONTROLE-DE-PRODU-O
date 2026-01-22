
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import { ProductionEntry, Employee, SERVICES } from '../types';
import { TrendingUp, Briefcase } from 'lucide-react';

interface ReportsViewProps {
  production: ProductionEntry[];
  employees: Employee[];
}

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#a855f7', '#f43f5e', '#eab308', '#64748b'];

const ReportsView: React.FC<ReportsViewProps> = ({ production, employees }) => {
  
  const byServiceData = useMemo(() => {
    const summary: Record<string, number> = {};
    production.forEach(p => {
      summary[p.serviceType] = (summary[p.serviceType] || 0) + (p.totalValue || 0);
    });
    return Object.entries(summary).map(([name, value]) => ({ name, value }));
  }, [production]);

  const byEmployeeData = useMemo(() => {
    const summary: Record<string, number> = {};
    production.forEach(p => {
      const worker = employees.find(e => e.id === p.employeeId);
      const name = worker?.name || 'Desconhecido';
      summary[name] = (summary[name] || 0) + (p.totalValue || 0);
    });
    return Object.entries(summary).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [production, employees]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Relatórios Financeiros</h1>
          <p className="text-slate-500">Produção total em Reais (R$)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6 text-slate-900">
            <TrendingUp size={20} className="text-orange-500" />
            <h3 className="font-bold text-lg">Ganhos por Serviço (R$)</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byServiceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} />
                <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6 text-slate-900">
            <Briefcase size={20} className="text-blue-500" />
            <h3 className="font-bold text-lg">Top Produção (Por Funcionário R$)</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byEmployeeData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {byEmployeeData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {byEmployeeData.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                <span className="text-slate-600 truncate">{item.name}: R$ {item.value.toLocaleString('pt-BR')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100"><h3 className="font-bold text-lg">Resumo de Pagamento de Produção</h3></div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Funcionário</th>
              <th className="px-6 py-4">Serviço</th>
              <th className="px-6 py-4 text-right">Total (R$)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {production.slice(-10).reverse().map(p => {
              const worker = employees.find(e => e.id === p.employeeId);
              return (
                <tr key={p.id} className="text-sm">
                  <td className="px-6 py-4 text-slate-500">{new Date(p.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{worker?.name}</td>
                  <td className="px-6 py-4 text-slate-600">{p.serviceType}</td>
                  <td className="px-6 py-4 text-right font-black text-orange-600">R$ {p.totalValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsView;
