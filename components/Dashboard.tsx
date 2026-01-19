
import React, { useMemo } from 'react';
import { 
  Users, 
  PlusCircle, 
  BarChart3, 
  Calendar,
  TrendingUp,
  HardHat,
  Building2
} from 'lucide-react';
import { ProductionEntry, Employee, AppView } from '../types';

interface DashboardProps {
  production: ProductionEntry[];
  employees: Employee[];
  setView: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ production, employees, setView }) => {
  const today = new Date().toISOString().split('T')[0];
  
  const todayStats = useMemo(() => {
    const todayProductions = production.filter(p => p.date === today);
    const uniqueEmployees = new Set(todayProductions.map(p => p.employeeId));
    
    return {
      count: todayProductions.length,
      workers: uniqueEmployees.size,
      totalQty: todayProductions.reduce((sum, p) => sum + p.quantity, 0)
    };
  }, [production, today]);

  const stats = [
    { label: 'Produções Hoje', value: todayStats.count, icon: HardHat, color: 'bg-blue-500' },
    { label: 'Colaboradores Ativos', value: todayStats.workers, icon: Users, color: 'bg-green-500' },
    { label: 'Lançamentos Totais', value: production.length, icon: TrendingUp, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* App Cover Section - Removed Logo Image */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="bg-orange-500 p-8 rounded-[2rem] shadow-xl">
            <Building2 size={64} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight">
              CONTROLE DE <br />
              <span className="text-orange-500">PRODUÇÃO</span>
            </h1>
            <p className="text-slate-400 mt-4 text-lg font-medium max-w-md">
              Gestão inteligente e profissional de equipes e produtividade em tempo real.
            </p>
            <div className="mt-6 flex items-center justify-center md:justify-start gap-2 text-slate-300">
              <Calendar size={18} className="text-orange-500" />
              <span className="font-semibold">{new Date().toLocaleDateString('pt-BR', { dateStyle: 'full' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`${s.color} p-3 rounded-xl text-white`}>
              <s.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{s.label}</p>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => setView(AppView.NEW_PRODUCTION)}
          className="group flex flex-col items-center justify-center p-8 bg-orange-500 hover:bg-orange-600 text-white rounded-3xl transition-all shadow-lg hover:shadow-orange-200/50 text-center"
        >
          <PlusCircle size={48} className="mb-4 group-hover:scale-110 transition-transform" />
          <span className="text-xl font-bold">Nova Produção</span>
          <p className="text-orange-100 text-sm mt-2 font-medium">Lançar serviço do dia</p>
        </button>

        <button 
          onClick={() => setView(AppView.EMPLOYEES)}
          className="group flex flex-col items-center justify-center p-8 bg-white hover:bg-slate-50 text-slate-900 rounded-3xl border-2 border-slate-100 transition-all shadow-sm hover:shadow-md text-center"
        >
          <Users size={48} className="mb-4 text-orange-500 group-hover:scale-110 transition-transform" />
          <span className="text-xl font-bold">Funcionários</span>
          <p className="text-slate-500 text-sm mt-2 font-medium">Gerenciar equipe e obras</p>
        </button>

        <button 
          onClick={() => setView(AppView.REPORTS)}
          className="group flex flex-col items-center justify-center p-8 bg-white hover:bg-slate-50 text-slate-900 rounded-3xl border-2 border-slate-100 transition-all shadow-sm hover:shadow-md text-center"
        >
          <BarChart3 size={48} className="mb-4 text-orange-500 group-hover:scale-110 transition-transform" />
          <span className="text-xl font-bold">Relatórios</span>
          <p className="text-slate-500 text-sm mt-2 font-medium">Análise e exportação</p>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Produções Recentes</h2>
          <button onClick={() => setView(AppView.HISTORY)} className="text-orange-500 text-sm font-semibold hover:underline">
            Ver Tudo
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {production.slice(0, 5).reverse().map((p, idx) => {
            const worker = employees.find(e => e.id === p.employeeId);
            return (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                    {worker?.name.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{worker?.name || 'Desconhecido'}</p>
                    <p className="text-sm text-slate-500">{p.serviceType} • {p.site}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{p.quantity} {p.unit}</p>
                  <p className="text-xs text-slate-400">{new Date(p.date).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            );
          })}
          {production.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              Nenhuma produção lançada hoje.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
