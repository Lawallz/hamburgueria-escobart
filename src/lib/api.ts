import { MenuItem } from '../types';
export interface MenuData { revision: number; items: MenuItem[] }
export class ApiError extends Error { constructor(message: string, public status: number) { super(message); } }
export async function api<T>(url: string, method = 'GET', body?: unknown): Promise<T> {
  const response = await fetch(url, { method, credentials: 'same-origin', headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined });
  const data = await response.json().catch(() => ({ error: 'Servidor indisponível. Tente novamente.' }));
  if (!response.ok) throw new ApiError(data.error || 'Não foi possível concluir.', response.status);
  return data;
}
export const categories = { burgers: 'Hambúrgueres', sides: 'Porções', drinks: 'Bebidas', desserts: 'Sobremesas', cervejas: 'Cervejas', caipirinhas: 'Caipirinhas', destilados: 'Destilados' };

export async function uploadImage(file: File): Promise<string> {
  const response = await fetch('/api/admin/images', {
    method: 'POST', credentials: 'same-origin',
    headers: { 'Content-Type': file.type }, body: file,
  });
  const result = await response.json().catch(() => ({ error: 'Não foi possível enviar a imagem. Tente novamente.' }));
  if (!response.ok) throw new ApiError(result.error || 'Falha no envio da imagem.', response.status);
  return result.url;
}
