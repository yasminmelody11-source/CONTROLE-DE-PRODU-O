
import React, { useState, useMemo } from 'react';
import { Banknote, Calendar, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Employee, ProductionEntry } from '../types';

interface PayrollViewProps {
  employees: Employee[];
  production: ProductionEntry[];
  advances: Record<string, number>;
  onUpdateAdvances: (advances: Record<string, number>) => void;
  onUpdateEmployees: (employees: Employee[]) => void;
}

const PayrollView: React.FC<PayrollViewProps> = ({ 
  employees, production, advances, onUpdateAdvances, onUpdateEmployees 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthLabel = new Date(currentYear, currentMonth).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  // Função para arredondar matematicamente para 2 casas decimais
  const round = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

  const updateEmployeeField = (id: string, field: keyof Employee, value: number) => {
    const updated = employees.map(emp => emp.id === id ? { ...emp, [field]: value } : emp);
    onUpdateEmployees(updated);
  };

  const payrollData = useMemo(() => {
    return employees.map(emp => {
      const monthlyProduction = production.filter(p => {
        const pDate = new Date(p.date);
        return pDate.getMonth() === currentMonth && 
               pDate.getFullYear() === currentYear && 
               p.employeeId === emp.id;
      });

      const totalProductionValue = round(monthlyProduction.reduce((sum, p) => sum + (p.totalValue || 0), 0));
      
      const advanceKey = `${emp.id}_${currentYear}_${currentMonth}`;
      const advanceAmount = round(advances[advanceKey] || 0);

      const fgtsVal = round(emp.grossSalary * (emp.fgtsPercent / 100));
      const inssVal = round(emp.grossSalary * (emp.inssPercent / 100));
      
      // Pagamento Extra (Saque em Dinheiro)
      const cashPayment = round(totalProductionValue - emp.netSalary - fgtsVal - inssVal - advanceAmount);
      const totalToReceiveInCash = round(emp.netSalary + cashPayment);

      return {
        ...emp,
        monthlyProduction: totalProductionValue,
        advance: advanceAmount,
        fgtsVal,
        inssVal,
        cashPayment,
        totalToReceiveInCash,
        advanceKey
      };
    });
  }, [employees, production, advances, currentMonth, currentYear]);

  const handleAdvanceChange = (key: string, val: string) => {
    const amount = parseFloat(val) || 0;
    onUpdateAdvances({ ...advances, [key]: round(amount) });
  };

  const changeMonth = (delta: number) => {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;
    if (newMonth < 0) { newMonth = 11; newYear--; }
    if (newMonth > 11) { newMonth = 0; newYear++; }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  // Soma apenas os valores de pagamento extra positivos, arredondando o total final
  const totalCashToWithdraw = round(payrollData.reduce((sum, item) => sum + Math.max(0, item.cashPayment), 0));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Folha de Pagamento</h1>
          <p className="text-slate-500">Gestão de salários e bônus de produção</p>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-50 rounded-full"><ChevronLeft /></button>
        <span className="text-lg font-black text-slate-700 capitalize flex items-center gap-2">
          <Calendar className="text-orange-500" /> {monthLabel}
        </span>
        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-50 rounded-full"><ChevronRight /></button>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3">
        <Info className="text-blue-500 shrink-0" size={24} />
        <div className="text-sm text-blue-700">
          <p><strong>Cálculo Automático:</strong> Os valores são arredondados matematicamente para 2 casas decimais.</p>
          <p><strong>Total a Sacar:</strong> Soma apenas os valores de "Pagamento Extra" da equipe.</p>
        </div>
      </div>

      <div className="space-y-6">
        {payrollData.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">{item.name}</h3>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">{item.role} • {item.site}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase block">Total Geral (S. Líquido + Produção)</span>
                <span className="text-2xl font-black text-orange-600">R$ {item.totalToReceiveInCash.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">SALÁRIO BRUTO</label>
                <input 
                  type="number" step="0.01"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                  value={item.grossSalary}
                  onChange={e => updateEmployeeField(item.id, 'grossSalary', round(parseFloat(e.target.value) || 0))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">S. LÍQUIDO (CONTRACHEQUE)</label>
                <input 
                  type="number" step="0.01"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                  value={item.netSalary}
                  onChange={e => updateEmployeeField(item.id, 'netSalary', round(parseFloat(e.target.value) || 0))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">FGTS (%)</label>
                <input 
                  type="number" step="0.1"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                  value={item.fgtsPercent}
                  onChange={e => updateEmployeeField(item.id, 'fgtsPercent', round(parseFloat(e.target.value) || 0))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">INSS (%)</label>
                <input 
                  type="number" step="0.1"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                  value={item.inssPercent}
                  onChange={e => updateEmployeeField(item.id, 'inssPercent', round(parseFloat(e.target.value) || 0))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-orange-500 uppercase tracking-tighter">Vale / Adiant.</label>
                <input 
                  type="number" step="0.01" 
                  className="w-full px-3 py-2 rounded-xl border border-orange-200 bg-orange-50 text-sm font-black text-orange-600 outline-none"
                  value={item.advance || ''}
                  onChange={e => handleAdvanceChange(item.advanceKey, e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-green-500 uppercase tracking-tighter">Produção Total</label>
                <div className="w-full px-3 py-2 rounded-xl bg-green-50 text-green-700 text-sm font-black">
                  R$ {item.monthlyProduction.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-4 border border-slate-100">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase block">Desconto FGTS</span>
                <span className="font-bold text-slate-700 text-sm">R$ {item.fgtsVal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase block">Desconto INSS</span>
                <span className="font-bold text-slate-700 text-sm">R$ {item.inssVal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="text-right col-span-2 md:col-span-1 border-l pl-4 border-slate-200">
                <span className="text-[10px] font-black text-slate-400 uppercase block">Pagamento Extra (Em Dinheiro)</span>
                <span className="font-black text-slate-900">R$ {Math.max(0, item.cashPayment).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-orange-500 p-4 rounded-2xl">
              <Banknote size={32} />
            </div>
            <div>
              <p className="text-orange-200 text-xs font-black uppercase tracking-widest">Total a sacar em dinheiro para pagamento da equipe</p>
              <h2 className="text-xl font-bold">Pagamento Extra de Produção</h2>
            </div>
          </div>
          <div className="text-center md:text-right">
             <p className="text-xs font-black text-orange-200 uppercase mb-1">Mês de Referência: {monthLabel}</p>
             <p className="text-4xl font-black">R$ {totalCashToWithdraw.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollView;
