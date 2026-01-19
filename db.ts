
import { Employee, ProductionEntry, MonthlyAdvance } from './types';

const STORAGE_KEYS = {
  EMPLOYEES: 'construlog_employees',
  PRODUCTION: 'construlog_production',
  ADVANCES: 'construlog_advances'
};

export const db = {
  getEmployees: (): Employee[] => {
    const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    return data ? JSON.parse(data) : [];
  },
  saveEmployees: (employees: Employee[]) => {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  },
  getProduction: (): ProductionEntry[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTION);
    return data ? JSON.parse(data) : [];
  },
  saveProduction: (entries: ProductionEntry[]) => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTION, JSON.stringify(entries));
  },
  getAdvances: (): Record<string, number> => {
    const data = localStorage.getItem(STORAGE_KEYS.ADVANCES);
    return data ? JSON.parse(data) : {};
  },
  saveAdvances: (advances: Record<string, number>) => {
    localStorage.setItem(STORAGE_KEYS.ADVANCES, JSON.stringify(advances));
  }
};
