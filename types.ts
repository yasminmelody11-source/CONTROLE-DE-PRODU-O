
export type Role = 'Pedreiro' | 'Servente' | 'Encarregado' | 'Carpinteiro' | 'Armador' | 'Eletricista' | 'Encanador';

export interface Employee {
  id: string;
  name: string;
  role: Role;
  site: string;
  active: boolean;
  // Campos de Folha de Pagamento
  grossSalary: number;
  netSalary: number;
  fgtsPercent: number;
  inssPercent: number;
}

export type UnitType = 'm²' | 'm³' | 'un' | 'diária' | 'ml';

export interface ProductionEntry {
  id: string;
  date: string;
  employeeId: string;
  site: string;
  pavimento: string; // Adicionado
  serviceType: string;
  unitPrice: number;
  quantity: number;
  unit: UnitType;
  totalValue: number;
  observations: string;
  createdAt: number;
}

export interface MonthlyAdvance {
  id: string; // employeeId_YYYY_MM
  amount: number;
}

export enum AppView {
  DASHBOARD = 'dashboard',
  EMPLOYEES = 'employees',
  NEW_PRODUCTION = 'new_production',
  HISTORY = 'history',
  REPORTS = 'reports',
  PAYROLL = 'payroll'
}

export interface ServicePrice {
  name: string;
  price: number;
  unit: UnitType;
}

export const SERVICES: ServicePrice[] = [
  { name: 'Alvenaria Interna', price: 10.00, unit: 'm²' },
  { name: 'Alvenaria Shaft', price: 14.00, unit: 'm²' },
  { name: 'Alvenaria Externa', price: 12.00, unit: 'm²' },
  { name: 'Capiaço', price: 7.00, unit: 'ml' },
  { name: 'Chapisco', price: 1.00, unit: 'm²' },
  { name: 'Contrapiso – Escol', price: 5.00, unit: 'm²' },
  { name: 'Contrapiso – Hermes', price: 6.00, unit: 'm²' },
  { name: 'Marcação de Alvenaria – Porto', price: 250.00, unit: 'un' },
  { name: 'Marcação de Alvenaria – Hermes', price: 150.00, unit: 'un' },
  { name: 'Reboco', price: 7.00, unit: 'm²' },
  { name: 'Reboco Shaft', price: 8.50, unit: 'm²' },
  { name: 'Verga', price: 20.00, unit: 'un' },
  { name: 'Outros (Manual)', price: 0, unit: 'un' }
];

export const UNITS: UnitType[] = ['m²', 'm³', 'un', 'diária', 'ml'];
