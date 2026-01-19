
import React, { useState } from 'react';
import { Plus, Search, UserPlus, ToggleLeft, ToggleRight, Trash2, Edit2, Banknote } from 'lucide-react';
import { Employee, Role } from '../types';

interface EmployeeManagerProps {
  employees: Employee[];
  onUpdate: (employees: Employee[]) => void;
}

const ROLES: Role[] = ['Pedreiro', 'Servente', 'Encarregado', 'Carpinteiro', 'Armador', 'Eletricista', 'Encanador'];

const EmployeeManager: React.FC<EmployeeManagerProps> = ({ employees, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '',
    role: 'Pedreiro',
    site: '',
    active: true,
    grossSalary: 0,
    netSalary: 0,
    fgtsPercent: 8,
    inssPercent: 9
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.site) return;

    if (editingId) {
      const updated = employees.map(emp => emp.id === editingId ? { ...emp, ...formData } : emp) as Employee[];
      onUpdate(updated);
      setEditingId(null);
    } else {
      const newEmployee: Employee = {
        ...formData as Employee,
        id: crypto.randomUUID(),
        active: true
      };
      onUpdate([...employees, newEmployee]);
    }
    setFormData({ name: '', role: 'Pedreiro', site: '', active: true, grossSalary: 0, netSalary: 0, fgtsPercent: 8, inssPercent: 9 });
    setIsAdding(false);
  };

  const handleEdit = (emp: Employee) => {
    setFormData(emp);
    setEditingId(emp.id);
    setIsAdding(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gerenciar Equipe</h1>
          <p className="text-slate-500">Configure os dados contratuais e financeiros</p>
        </div>
        <button 
          onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ name: '', role: 'Pedreiro', site: '', active: true, grossSalary: 0, netSalary: 0, fgtsPercent: 8, inssPercent: 9 }); }}
          className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
        >
          <UserPlus size={20} /> Cadastrar Novo
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-orange-100 animate-in slide-in-from-top-4">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Banknote className="text-orange-500" />
            {editingId ? 'Editar Funcionário' : 'Cadastro de Funcionário'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Nome Completo</label>
                <input type="text" required className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Função</label>
                <select className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none bg-white" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as Role})}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Obra Atual</label>
                <input type="text" required className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none" value={formData.site} onChange={e => setFormData({...formData, site: e.target.value})} />
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-600 uppercase">SALÁRIO BRUTO</label>
                <input type="number" step="0.01" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500" value={formData.grossSalary} onChange={e => setFormData({...formData, grossSalary: parseFloat(e.target.value)})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-600 uppercase">SALÁRIO LÍQUIDO (CONTRACHEQUE)</label>
                <input type="number" step="0.01" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500" value={formData.netSalary} onChange={e => setFormData({...formData, netSalary: parseFloat(e.target.value)})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">FGTS (%)</label>
                <input type="number" step="0.1" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none" value={formData.fgtsPercent} onChange={e => setFormData({...formData, fgtsPercent: parseFloat(e.target.value)})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">INSS (%)</label>
                <input type="number" step="0.1" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none" value={formData.inssPercent} onChange={e => setFormData({...formData, inssPercent: parseFloat(e.target.value)})} />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2 rounded-lg border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
              <button type="submit" className="px-8 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors">Salvar Alterações</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="Pesquisar por nome..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-black">
              <tr>
                <th className="px-6 py-4">Nome / Obra</th>
                <th className="px-6 py-4">S. Bruto</th>
                <th className="px-6 py-4">S. Líquido (Contracheque)</th>
                <th className="px-6 py-4">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase())).map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{emp.name}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{emp.role} • {emp.site}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600 text-sm">R$ {emp.grossSalary?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 font-black text-slate-900 text-sm">R$ {emp.netSalary?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(emp)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 size={18} /></button>
                      <button onClick={() => onUpdate(employees.filter(e => e.id !== emp.id))} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-400 italic">Nenhum funcionário cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManager;
