import { seedEmployees } from '../data/seedEmployees'

export async function fetchEmployees() {
  await new Promise((resolve) => setTimeout(resolve, 350))
  return seedEmployees
}
