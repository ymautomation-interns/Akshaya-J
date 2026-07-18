import employees from '../data/employees.json';

/**
 * Central data hook. Reads exclusively from the static employees.json file —
 * no network, no storage. Adding an employee is a one-file JSON edit.
 */

/** Looks up a single employee by ID (case-insensitive). Returns null if not found. */
export function findEmployeeById(employeeId) {
  if (!employeeId) return null;
  const query = String(employeeId).trim().toLowerCase();
  return employees.find((e) => e.employeeId.toLowerCase() === query) || null;
}

export function useEmployeeById(employeeId) {
  return findEmployeeById(employeeId);
}
