
import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, ChevronLeft, Calculator, Layers } from 'lucide-react';
import { Employee, ProductionEntry, SERVICES, UNITS, UnitType } from '../types';

interface ProductionFormProps {
  employees: Employee[];
  production: ProductionEntry[];
  onUpdate: (entries: ProductionEntry[]) => void;
  onFinish: () => void;
  editingId: string | null;
}

const ProductionForm: React.FC<ProductionFormProps> = ({ 
  employees, 
  production, 
  onUpdate, 
  onFinish,
  editingId 
}) => {
  const [formData, setFormData] = useState<Partial<ProductionEntry>>({
    date: new Date().toISOString().split('T')[0],
    employeeId: '',
    site: '',
    pavimento: '',
    serviceType: SERVICES[0].name,
    unitPrice: SERVICES[0].price,
    quantity: 0,
    unit: SERVICES[0].unit,
    totalValue: 0,
    observations: ''
  });

  useEffect(() => {
    if (editingId) {
      const entry = production.find(p => p.id === editingId);
      if (entry) setFormData(entry);
    }
  }, [editingId, production]);

  const activeEmployees = employees.filter(e => e.active);

  // Função para arredondar matematicamente para 2 casas decimais
  const round = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

  const calculateTotal = (qty: number, price: number) => {
    return round(qty * price);
  };

  const handleServiceChange = (name: string) => {
    const service = SERVICES.find(s => s.name === name);
    if (service) {
      const newUnitPrice = service.price;
      const newQty = formData.quantity || 0;
      setFormData({
        ...formData,
        serviceType: name,
        unitPrice: newUnitPrice,
        unit: service.unit,
        totalValue: calculateTotal(newQty, newUnitPrice)
      });
    }
  };

  const handleQtyChange = (val: string) => {
    const qty = parseFloat(val) || 0;
    const price = formData.unitPrice || 0;
    setFormData({
      ...formData,
      quantity: qty,
      totalValue: calculateTotal(qty, price)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.site || !formData.pavimento || !formData.quantity) {
      alert('Preencha os campos obrigatórios (Funcionário, Obra, Pavimento e Quantidade).');
      return;
    }

    if (editingId) {
      const updated = production.map(p => p.id === editingId ? { ...p, ...formData } : p) as ProductionEntry[];
      onUpdate(updated);
    } else {
      const newEntry: ProductionEntry = {
        ...formData as ProductionEntry,
        id: crypto.randomUUID(),
        createdAt: Date.now()
      };
      onUpdate([...production, newEntry]);
    }
    onFinish();
  };

  if (employees.length === 0) {
    return (
      <div className="bg-orange-50 p-8 rounded-2xl border-2 border-dashed border-orange-200 text-center">
        <AlertCircle className="mx-auto text-orange-500 mb-4" size={48} />
        <h2 className="text-xl font-bold text-orange-900">Nenhum funcionário cadastrado</h2>
        <p className="text-orange-700 mt-2">Cadastre funcionários antes de lançar produções.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-right-4">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onFinish} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">
          {editingId ? 'Editar Produção' : 'Lançar Produção Diária'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Data do Serviço</label>
            <input 
              type="date" required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Funcionário</label>
            <select 
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
              value={formData.employeeId}
              onChange={e => {
                const worker = employees.find(emp => emp.id === e.target.value);
                setFormData({...formData, employeeId: e.target.value, site: worker?.site || formData.site});
              }}
            >
              <option value="">Selecione o funcionário</option>
              {activeEmployees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Obra / Local</label>
            <input 
              type="text" required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
              value={formData.site}
              onChange={e => setFormData({...formData, site: e.target.value})}
              placeholder="Ex: Torre A"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Layers size={14} /> Pavimento
            </label>
            <input 
              type="text" required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
              value={formData.pavimento}
              onChange={e => setFormData({...formData, pavimento: e.target.value})}
              placeholder="Ex: 10º Andar"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-bold text-slate-700">Tipo de Serviço (Preço Fixo)</label>
          <select 
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
            value={formData.serviceType}
            onChange={e => handleServiceChange(e.target.value)}
          >
            {SERVICES.map(s => <option key={s.name} value={s.name}>{s.name} - R$ {s.price.toFixed(2)}/{s.unit}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Quantidade ({formData.unit})</label>
            <input 
              type="number" step="0.01" required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
              value={formData.quantity || ''}
              onChange={e => handleQtyChange(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700">Valor Unitário (R$)</label>
            <input 
              type="number" step="0.01" readOnly
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none cursor-not-allowed"
              value={formData.unitPrice || ''}
            />
          </div>
        </div>

        <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-orange-700 font-bold">
            <Calculator size={20} />
            <span>VALOR TOTAL PRODUÇÃO:</span>
          </div>
          <span className="text-2xl font-black text-orange-600">
            R$ {formData.totalValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-bold text-slate-700">Observações</label>
          <textarea 
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
            value={formData.observations}
            onChange={e => setFormData({...formData, observations: e.target.value})}
          />
        </div>

        <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all">
          <Save size={24} />
          {editingId ? 'Salvar Alterações' : 'Confirmar Produção'}
        </button>
      </form>
    </div>
  );
};

export default ProductionForm;
