
import React, { useState, useMemo } from 'react';
import { Filter, Search, Trash2, Edit3, XCircle, Layers } from 'lucide-react';
import { ProductionEntry, Employee, SERVICES } from '../types';

interface HistoryViewProps {
  production: ProductionEntry[];
  employees: Employee[];
  onUpdate: (entries: ProductionEntry[]) => void;
  onEdit: (id: string) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ production, employees, onUpdate, onEdit }) => {
  const [filters, setFilters] = useState({ search: '', employeeId: '', site: '', serviceType: '', dateStart: '', dateEnd: '' });

  const filteredData = useMemo(() => {
    return production.filter(p => {
      const worker = employees.find(e => e.id === p.employeeId);
      const matchesSearch = !filters.search || 
        worker?.name.toLowerCase().includes(filters.search.toLowerCase()) || 
        p.site.toLowerCase().includes(filters.search.toLowerCase()) ||
        (p.pavimento && p.pavimento.toLowerCase().includes(filters.search.toLowerCase())) ||
        p.serviceType.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesEmployee = !filters.employeeId || p.employeeId === filters.employeeId;
      const matchesService = !filters.serviceType || p.serviceType === filters.serviceType;
      const matchesDate = (!filters.dateStart || p.date >= filters.dateStart) && (!filters.dateEnd || p.date <= filters.dateEnd);

      return matchesSearch && matchesEmployee && matchesService && matchesDate;
    }).reverse();
  }, [production, employees, filters]);

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este registro?')) onUpdate(production.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Histórico de Produção</h1>
          <p className="text-slate-500">Gestão detalhada por pavimento</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Buscar por obra ou pavimento..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-orange-500" value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} />
        </div>
        <select className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm bg-white outline-none" value={filters.employeeId} onChange={e => setFilters({...filters, employeeId: e.target.value})}>
          <option value="">Todos Funcionários</option>
          {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
        <select className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm bg-white outline-none" value={filters.serviceType} onChange={e => setFilters({...filters, serviceType: e.target.value})}>
          <option value="">Todos Serviços</option>
          {SERVICES.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
        </select>
        <div className="flex items-center gap-2">
           <input type="date" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none" value={filters.dateStart} onChange={e => setFilters({...filters, dateStart: e.target.value})} />
           <button onClick={() => setFilters({search: '', employeeId: '', site: '', serviceType: '', dateStart: '', dateEnd: ''})} className="text-slate-400"><XCircle size={20}/></button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredData.map(p => {
          const worker = employees.find(e => e.id === p.employeeId);
          return (
            <div key={p.id} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
              <div className="flex gap-4">
                <div className="flex flex-col items-center justify-center bg-slate-50 w-16 h-16 rounded-xl border border-slate-100 shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(p.date).toLocaleDateString('pt-BR', { month: 'short' })}</span>
                  <span className="text-xl font-black text-slate-700">{new Date(p.date).getDate() + 1}</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{worker?.name || 'Desconhecido'}</h3>
                  <p className="text-sm text-slate-500">
                    {p.serviceType} • <span className="text-orange-600 font-bold">{p.site}</span> 
                    {p.pavimento && <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-md text-[10px] uppercase font-black">{p.pavimento}</span>}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-bold">{p.quantity} {p.unit} x R$ {p.unitPrice?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase block">Valor Total</span>
                  <span className="text-xl font-black text-orange-600">R$ {p.totalValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onEdit(p.id)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Edit3 size={18}/></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"><Trash2 size={18}/></button>
                </div>
              </div>
            </div>
          );
        })}
        {filteredData.length === 0 && (
          <div className="p-20 bg-white rounded-3xl border border-dashed border-slate-200 text-center text-slate-400 font-medium">
            Nenhum registro encontrado.
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
