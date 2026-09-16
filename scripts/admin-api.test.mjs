import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { randomBytes } from 'node:crypto';

test('admin authentication, validation, conflict protection and persistence', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'escobart-test-'));
  const password = randomBytes(24).toString('hex');
  const origin = 'http://localhost:3199';
  let child;
  async function start() {
    child = spawn(process.execPath, ['--import', 'tsx', 'server/index.ts'], { env: {...process.env, NODE_ENV:'production', ADMIN_PASSWORD:password, DATA_DIR:dir, PORT:'3199', APP_ORIGIN:'https://test.escobart.example'}, stdio:'pipe' });
    let output = '';
    child.stderr.on('data', chunk => output += chunk);
    for (let i=0;i<100;i++) {
      if (child.exitCode !== null) throw new Error(output);
      try { const res=await fetch(origin+'/api/menu'); if(res.ok) return; } catch {}
      await new Promise(r=>setTimeout(r,100));
    }
    throw new Error('Server startup timed out: '+output);
  }
  async function stop() { if(child && child.exitCode === null) { const done=new Promise(r=>child.once('exit',r));child.kill();await done; } }
  let cookie='';
  async function request(route, method='GET', body, allowedOrigin='https://test.escobart.example') {
    return fetch(origin+route,{method,headers:{Origin:allowedOrigin,Cookie:cookie,'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
  }
  try {
    await start();
    assert.equal((await request('/api/admin/menu')).status,401);
    assert.equal((await request('/api/login','POST',{password:'wrong'})).status,401);
    assert.equal((await request('/api/login','POST',{password},'https://evil.example')).status,403);
    const login=await request('/api/login','POST',{password});assert.equal(login.status,200);
    assert.match(login.headers.get('set-cookie'),/HttpOnly/); assert.match(login.headers.get('set-cookie'),/Secure/);
    cookie=login.headers.get('set-cookie').split(';')[0];
    const data=await (await request('/api/admin/menu')).json();assert.ok(data.items.length>20);
    const initial=data.items[0];
    const invalid={...data,items:data.items.map((i,n)=>n===0?{...i,price:-1}:i)};
    assert.equal((await request('/api/admin/menu','PUT',invalid)).status,400);
    const changed={...data,items:data.items.map((i,n)=>n===0?{...i,name:'Produto teste',price:42.75,available:false}:i)};
    const saved=await request('/api/admin/menu','PUT',changed);assert.equal(saved.status,200);
    const next=await saved.json();assert.equal(next.revision,data.revision+1);
    assert.equal((await request('/api/admin/menu','PUT',data)).status,409);
    const publicData=await(await request('/api/menu')).json();assert.ok(!publicData.items.some(i=>i.id===initial.id));
    await stop();await start();
    assert.equal((await request('/api/admin/menu')).status,401);
    const secondLogin=await request('/api/login','POST',{password});cookie=secondLogin.headers.get('set-cookie').split(';')[0];
    const persisted=await(await request('/api/admin/menu')).json();assert.equal(persisted.items[0].price,42.75);
    const added={...persisted.items[0],id:'new-test',available:true,name:'Novo item'};
    let result=await request('/api/admin/menu','PUT',{...persisted,items:[...persisted.items,added]});assert.equal(result.status,200);
    let latest=await result.json();assert.ok((await(await request('/api/menu')).json()).items.some(i=>i.id==='new-test'));
    result=await request('/api/admin/menu','PUT',{...latest,items:latest.items.filter(i=>i.id!=='new-test')});assert.equal(result.status,200);
    assert.ok(!(await(await request('/api/menu')).json()).items.some(i=>i.id==='new-test'));
    await request('/api/logout','POST');assert.equal((await request('/api/admin/menu')).status,401);
    for(let i=0;i<10;i++) assert.equal((await request('/api/login','POST',{password:'wrong'})).status,401);
    assert.equal((await request('/api/login','POST',{password:'wrong'})).status,429);
  } finally { await stop();await rm(dir,{recursive:true,force:true}); }
});
