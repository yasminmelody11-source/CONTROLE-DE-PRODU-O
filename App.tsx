
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  PlusCircle, 
  History, 
  BarChart3, 
  Banknote,
  Menu,
  X,
  Building2
} from 'lucide-react';
import { AppView, Employee, ProductionEntry } from './types';
import { db } from './db';
import Dashboard from './components/Dashboard';
import EmployeeManager from './components/EmployeeManager';
import ProductionForm from './components/ProductionForm';
import HistoryView from './components/HistoryView';
import ReportsView from './components/ReportsView';
import PayrollView from './components/PayrollView';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [production, setProduction] = useState<ProductionEntry[]>([]);
  const [advances, setAdvances] = useState<Record<string, number>>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  useEffect(() => {
    setEmployees(db.getEmployees());
    setProduction(db.getProduction());
    setAdvances(db.getAdvances());
  }, []);

  const updateEmployees = (newEmployees: Employee[]) => {
    setEmployees(newEmployees);
    db.saveEmployees(newEmployees);
  };

  const updateProduction = (newEntries: ProductionEntry[]) => {
    setProduction(newEntries);
    db.saveProduction(newEntries);
  };

  const updateAdvances = (newAdvances: Record<string, number>) => {
    setAdvances(newAdvances);
    db.saveAdvances(newAdvances);
  };

  const handleEditProduction = (id: string) => {
    setEditingEntryId(id);
    setView(AppView.NEW_PRODUCTION);
  };

  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Painel', icon: LayoutDashboard },
    { id: AppView.NEW_PRODUCTION, label: 'Nova Produção', icon: PlusCircle },
    { id: AppView.HISTORY, label: 'Histórico', icon: History },
    { id: AppView.PAYROLL, label: 'Folha Pagto', icon: Banknote },
    { id: AppView.EMPLOYEES, label: 'Funcionários', icon: Users },
    { id: AppView.REPORTS, label: 'Relatórios', icon: BarChart3 },
  ];

  const renderView = () => {
    switch (view) {
      case AppView.DASHBOARD:
        return <Dashboard production={production} employees={employees} setView={setView} />;
      case AppView.EMPLOYEES:
        return <EmployeeManager employees={employees} onUpdate={updateEmployees} />;
      case AppView.NEW_PRODUCTION:
        return <ProductionForm 
          employees={employees} 
          production={production} 
          onUpdate={updateProduction}
          editingId={editingEntryId}
          onFinish={() => {
            setView(AppView.HISTORY);
            setEditingEntryId(null);
          }}
        />;
      case AppView.HISTORY:
        return <HistoryView 
          production={production} 
          employees={employees}
          onUpdate={updateProduction}
          onEdit={handleEditProduction}
        />;
      case AppView.REPORTS:
        return <ReportsView production={production} employees={employees} />;
      case AppView.PAYROLL:
        return <PayrollView 
          employees={employees} 
          production={production} 
          advances={advances}
          onUpdateAdvances={updateAdvances}
          onUpdateEmployees={updateEmployees}
        />;
      default:
        return <Dashboard production={production} employees={employees} setView={setView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-orange-500 p-2 rounded-lg">
            <Building2 size={24} className="text-white" />
          </div>
          <h1 className="text-sm font-black leading-tight tracking-tighter uppercase">
            Controle de <br /> Produção
          </h1>
        </div>
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setView(item.id); setEditingEntryId(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                view === item.id ? 'bg-orange-500 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Building2 size={20} className="text-orange-500" />
          <span className="font-black text-xs uppercase tracking-tighter">Controle de Produção</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-slate-900 w-3/4 h-full p-6" onClick={e => e.stopPropagation()}>
            <nav className="space-y-4 pt-10">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setView(item.id); setIsMobileMenuOpen(false); setEditingEntryId(null); }}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-lg ${
                    view === item.id ? 'bg-orange-500 text-white' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <item.icon size={24} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-4 md:p-8 safe-area-bottom">
        <div className="max-w-6xl mx-auto">{renderView()}</div>
      </main>
    </div>
  );
};

export default App;
