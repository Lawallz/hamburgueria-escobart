import { useEffect, useState, FormEvent } from 'react';
import { ArrowLeft, LogOut, Plus, Search, Pencil, Trash2, LockKeyhole, UtensilsCrossed } from 'lucide-react';
import { MenuItem } from '../types';
import { api, ApiError, categories, MenuData, uploadImage } from '../lib/api';
import './admin.css';

const money = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export default function AdminPanel() {
  const [data, setData] = useState<MenuData | null>(null);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [draft, setDraft] = useState<MenuItem | null>(null);
  const [ingredients, setIngredients] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [removing, setRemoving] = useState<MenuItem | null>(null);

  useEffect(() => { api<MenuData>('/api/admin/menu').then(setData).catch(e => { if (e.status !== 401) setError(e.message); }).finally(() => setChecking(false)); }, []);
  useEffect(() => {
    if (!draft) return;
    const beforeUnload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [draft]);
  useEffect(() => {
    if (!draft && !removing) return;
    const previous = document.activeElement as HTMLElement;
    const keydown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const elements = [...document.querySelectorAll<HTMLElement>('.admin-overlay button:not(:disabled), .admin-overlay input:not(:disabled), .admin-overlay textarea:not(:disabled), .admin-overlay select:not(:disabled)')];
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', keydown);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', keydown); previous?.focus(); };
  }, [!!draft, !!removing]);
  useEffect(() => {
    if (!imageFile) { setImagePreview(''); return; }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);
  function selectImage(file?: File) {
    if (!file) return;
    setError('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Escolha uma imagem JPG, PNG ou WebP.'); return;
    }
    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter até 5 MB e não pode estar vazia.'); return;
    }
    setImageFile(file);
  }
  const report = (e: unknown) => { setError(e instanceof Error ? e.message : 'Não foi possível salvar.'); if (e instanceof ApiError && e.status === 401) { setData(null); setDraft(null); setRemoving(null); } };
  async function login(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    try { await api('/api/login', 'POST', { password }); setData(await api<MenuData>('/api/admin/menu')); setPassword(''); }
    catch(e) { report(e); } finally { setBusy(false); }
  }
  async function save(items: MenuItem[], selectedImage?: File | null) {
    if (!data) return;
    setBusy(true); setError(''); setNotice('');
    try {
      if (selectedImage && draft) {
        const url = await uploadImage(selectedImage);
        items = items.map(item => item.id === draft.id ? { ...item, image: url } : item);
        setDraft(previous => previous ? { ...previous, image: url } : previous);
        setImageFile(null);
      }
      setData(await api<MenuData>('/api/admin/menu', 'PUT', { revision: data.revision, items })); setDraft(null); setRemoving(null); setNotice('Cardápio atualizado com sucesso.'); }
    catch(e) { report(e); } finally { setBusy(false); }
  }
  function edit(item?: MenuItem) {
    setError(''); setNotice(''); setImageFile(null); setImagePreview('');
    setDraft(item ? { ...item } : { id: crypto.randomUUID(), name: '', description: '', price: 0, image: '/assets/placeholder.svg', category: 'burgers', ingredients: [], available: true, featured: false });
    setIngredients(item?.ingredients.join(', ') || '');
  }
  const feedback = <>{error && <p className="admin-alert error" role="alert">{error}</p>}{notice && <p className="admin-alert" role="status">{notice}</p>}</>;
  if (checking) return <main className="admin-shell admin-login"><p role="status">Carregando painel…</p></main>;
  if (!data) return <main className="admin-shell admin-login"><form className="admin-login-card" onSubmit={login}>
    <div className="admin-brand">ESCOBART<span>ÁREA DO ADMINISTRADOR</span></div>
    <LockKeyhole size={32}/><h1>Seu cardápio.<br/>No seu controle.</h1><p>Entre para gerenciar os produtos da casa.</p>
    {feedback}<label>Senha de acesso<input type="password" autoComplete="current-password" required maxLength={200} value={password} onChange={e => setPassword(e.target.value)}/></label>
    <button className="admin-primary" disabled={busy}>{busy ? 'Entrando…' : 'Entrar no painel'}</button><a href="/">← Voltar ao site</a>
  </form></main>;
  const filtered = data.items.filter(item => (category === 'all' || category === item.category) && `${item.name} ${item.description}`.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')));
  return <div className="admin-shell">
    <header className="admin-header"><div className="admin-brand">ESCOBART<span>PAINEL ADMINISTRATIVO</span></div><nav><a href="/" target="_blank" rel="noreferrer"><ArrowLeft size={16}/>Ver site</a><button disabled={busy} onClick={async () => { if (draft && !window.confirm('Sair e descartar as alterações não salvas?')) return; setBusy(true); try { await api('/api/logout', 'POST'); setData(null); setDraft(null); setNotice(''); } catch(e) { report(e); } finally { setBusy(false); } }}><LogOut size={16}/>Sair</button></nav></header>
    <main className="admin-main"><div className="admin-heading"><div><p className="admin-eyebrow">GESTÃO DA CASA</p><h1>Seu cardápio</h1><p>Atualize os produtos que seus clientes veem no site.</p></div><button className="admin-primary" onClick={() => edit()}><Plus size={18}/>Novo produto</button></div>
      {!draft && !removing && feedback}
      <div className="admin-stats"><div><span>Produtos cadastrados</span><strong>{data.items.length}</strong></div><div><span>Disponíveis</span><strong>{data.items.filter(i => i.available).length}</strong></div><div><span>Pausados</span><strong>{data.items.filter(i => !i.available).length}</strong></div></div>
      <div className="admin-toolbar"><label className="admin-search"><Search size={18}/><input aria-label="Buscar produto" placeholder="Buscar no cardápio…" value={query} onChange={e => setQuery(e.target.value)}/></label><select aria-label="Filtrar categoria" value={category} onChange={e => setCategory(e.target.value)}><option value="all">Todas as categorias</option>{Object.entries(categories).map(([id,label]) => <option key={id} value={id}>{label}</option>)}</select></div>
      <div className="admin-products">{filtered.map(item => <article className="admin-product" key={item.id}><img src={item.image} alt="" onError={e => { e.currentTarget.onerror=null; e.currentTarget.src='/assets/placeholder.svg'; }}/><div className="admin-product-copy"><span className="admin-eyebrow">{categories[item.category]}</span><h2>{item.name}</h2><p>{item.description}</p><strong>{money(item.price)}</strong><span className={`admin-status ${item.available ? '' : 'paused'}`}>{item.available ? 'Disponível' : 'Pausado'}</span></div><div className="admin-actions"><button disabled={busy} onClick={() => edit(item)}><Pencil size={16}/>Editar</button><button disabled={busy} onClick={() => save(data.items.map(i => i.id === item.id ? {...i, available: !i.available} : i))}>{item.available ? 'Pausar' : 'Disponibilizar'}</button><button aria-label={`Excluir ${item.name}`} disabled={busy} onClick={() => {setRemoving(item);setError('');}}><Trash2 size={16}/></button></div></article>)}</div>
      {!filtered.length && <div className="admin-empty"><UtensilsCrossed/><h2>Nenhum produto encontrado</h2><p>Altere a busca ou cadastre um novo produto.</p></div>}
    </main>
    {draft && <div className="admin-overlay"><section className="admin-editor" role="dialog" aria-modal="true" aria-labelledby="editor-title"><form onSubmit={e => { e.preventDefault(); const item = {...draft, ingredients: ingredients.split(',').map(i=>i.trim()).filter(Boolean)}; save(data.items.some(i=>i.id===item.id) ? data.items.map(i=>i.id===item.id?item:i) : [...data.items,item], imageFile); }}><h2 id="editor-title">{data.items.some(i=>i.id===draft.id) ? 'Editar produto' : 'Novo produto'}</h2>{feedback}<fieldset disabled={busy}>
      <label>Nome<input autoFocus required maxLength={120} value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})}/></label>
      <label>Descrição<textarea required maxLength={2000} rows={3} value={draft.description} onChange={e=>setDraft({...draft,description:e.target.value})}/></label>
      <div className="admin-form-grid"><label>Preço base (R$)<input type="number" min="0" max="100000" step="0.01" required value={Number.isNaN(draft.price) ? '' : draft.price} onChange={e=>setDraft({...draft,price:e.target.value === '' ? NaN : Number(e.target.value)})}/></label><label>Categoria<select value={draft.category} onChange={e=>setDraft({...draft,category:e.target.value as MenuItem['category']})}>{Object.entries(categories).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label></div>
      <div>
        <label htmlFor="product-photo">Foto do produto</label>
        <img src={imagePreview || draft.image} alt="Prévia da foto do produto" style={{ width: '100%', height: 180, objectFit: 'contain', background: '#eee', borderRadius: 8, margin: '10px 0' }} />
        <input id="product-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={event => { selectImage(event.target.files?.[0]); event.target.value = ''; }} />
        <small>Escolha uma foto do computador ou celular. JPG, PNG ou WebP, até 5 MB. A foto será enviada ao salvar o produto.</small>
        {imageFile && <div><small>Selecionada: {imageFile.name}</small><button type="button" onClick={() => setImageFile(null)}>Desfazer troca da foto</button></div>}
        <details style={{ marginTop: 12 }}><summary>Usar um link de imagem (opcional)</summary>
          <label>Endereço da imagem<input maxLength={2000} value={draft.image} disabled={!!imageFile} onChange={e=>setDraft({...draft,image:e.target.value})}/></label>
        </details>
      </div>
      <label>Ingredientes<input maxLength={2000} value={ingredients} onChange={e=>setIngredients(e.target.value)}/><small>Separe os ingredientes por vírgula.</small></label>
      <label>Selo (opcional)<input maxLength={50} value={draft.badge || ''} onChange={e=>setDraft({...draft,badge:e.target.value})}/></label>
      <label className="admin-check"><input type="checkbox" checked={draft.available} onChange={e=>setDraft({...draft,available:e.target.checked})}/>Disponível no cardápio</label>
      <label className="admin-check"><input type="checkbox" checked={draft.featured} onChange={e=>setDraft({...draft,featured:e.target.checked})}/>Exibir nos destaques</label>
      <p className="admin-help">Este preço é o valor base. Preços de marcas, tamanhos e adicionais específicos ainda são configurados no código.</p>
      <div className="admin-form-actions"><button type="button" onClick={()=>{if(window.confirm('Descartar as alterações deste formulário?')){setDraft(null);setError('');}}}>Cancelar</button><button className="admin-primary" type="submit">{busy?'Salvando…':'Salvar produto'}</button></div>
    </fieldset></form></section></div>}
    {removing && <div className="admin-overlay"><section className="admin-editor admin-confirm" role="alertdialog" aria-modal="true" aria-labelledby="delete-title"><h2 id="delete-title">Excluir {removing.name}?</h2><p>O produto será removido do cardápio. Você também pode apenas pausá-lo.</p>{feedback}<div className="admin-form-actions"><button autoFocus disabled={busy} onClick={()=>setRemoving(null)}>Cancelar</button><button className="admin-danger" disabled={busy} onClick={()=>save(data.items.filter(i=>i.id!==removing.id))}>{busy?'Excluindo…':'Excluir produto'}</button></div></section></div>}
  </div>;
}
