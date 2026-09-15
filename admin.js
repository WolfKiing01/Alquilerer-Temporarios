(() => {
  const loginBox=document.getElementById('adminLogin');
  const tools=document.getElementById('adminTools');
  if(!loginBox||!tools)return;
  const loginForm=document.getElementById('loginForm');
  const loginStatus=document.getElementById('loginStatus');
  const monthsEl=document.getElementById('adminMonths');
  const adminFrom=document.getElementById('adminFrom');
  const adminTo=document.getElementById('adminTo');
  const adminStatus=document.getElementById('adminStatus');
  const placeButtons=[...document.querySelectorAll('[data-admin-place]')];
  let place='refugio',blocked=new Set();
  const pad=n=>String(n).padStart(2,'0');
  const ymd=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const parse=s=>{const[y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
  const today=new Date(); today.setHours(0,0,0,0);
  const dbName=()=>place==='refugio'?'refugio-serrano':'la-quinta';
  const dateRange=(from,to,excludeEnd=false)=>{const out=[];let d=parse(from),end=parse(to);while(d<end || (!excludeEnd && d<=end)){out.push(ymd(d));d.setDate(d.getDate()+1)}return out};

  async function boot(){
    try{
      const session=await ATDB.session();
      if(session?.user?.id===ATDB.adminUid) showTools(); else showLogin();
    }catch(e){showLogin();}
  }
  function showLogin(){loginBox.hidden=false;tools.hidden=true;}
  async function showTools(){loginBox.hidden=true;tools.hidden=false;await loadBlocked();await loadLeads();}

  loginForm.addEventListener('submit',async e=>{
    e.preventDefault(); loginStatus.innerHTML='<p class="status info">Ingresando…</p>';
    try{await ATDB.login(document.getElementById('adminEmail').value,document.getElementById('adminPass').value);loginStatus.innerHTML='';await showTools();}
    catch(err){console.error(err);loginStatus.innerHTML='<p class="status error">No pudimos iniciar sesión. Revisá email y contraseña.</p>';}
  });
  document.getElementById('logoutBtn').addEventListener('click',async()=>{await ATDB.logout();showLogin();});

  async function loadBlocked(){
    adminStatus.innerHTML='<p class="status info">Cargando calendario…</p>';
    try{blocked=new Set(await ATDB.getBlockedDates(dbName()));adminStatus.innerHTML='';renderCalendar();}
    catch(e){console.error(e);adminStatus.innerHTML='<p class="status error">No se pudo cargar la disponibilidad.</p>';}
  }

  function renderCalendar(){
    monthsEl.innerHTML='';
    const start=new Date(today.getFullYear(),today.getMonth(),1);
    for(let i=0;i<10;i++){
      const first=new Date(start.getFullYear(),start.getMonth()+i,1);
      const card=document.createElement('section'); card.className='month-card';
      card.innerHTML=`<h3>${new Intl.DateTimeFormat('es-AR',{month:'long',year:'numeric'}).format(first)}</h3><div class="weekdays"><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span></div><div class="days"></div>`;
      const days=card.querySelector('.days'),offset=(first.getDay()+6)%7;
      for(let k=0;k<offset;k++)days.append(document.createElement('span'));
      const count=new Date(first.getFullYear(),first.getMonth()+1,0).getDate();
      for(let d=1;d<=count;d++){
        const dt=new Date(first.getFullYear(),first.getMonth(),d),key=ymd(dt);const btn=document.createElement('button');btn.type='button';btn.textContent=d;btn.className='day';
        if(dt<today){btn.classList.add('past');btn.disabled=true;} else btn.classList.add(blocked.has(key)?'blocked':'available');
        btn.title=blocked.has(key)?'Ocupado — clic para liberar':'Disponible — clic para bloquear';
        btn.addEventListener('click',()=>toggleDate(key));days.append(btn);
      }
      monthsEl.append(card);
    }
  }
  async function toggleDate(key){
    try{
      if(blocked.has(key)) await ATDB.removeBlockedDates(dbName(),[key]); else await ATDB.addBlockedDates(dbName(),[key]);
      await loadBlocked();
    }catch(e){console.error(e);adminStatus.innerHTML='<p class="status error">No se pudo guardar el cambio.</p>';}
  }

  function selectedDates(){
    const from=adminFrom.value,to=adminTo.value;
    if(!from)return [];
    if(place==='quinta') return [from];
    if(!to||parse(to)<=parse(from)) return [];
    return dateRange(from,to,true);
  }
  document.getElementById('blockBtn').addEventListener('click',async()=>{
    const dates=selectedDates(); if(!dates.length){adminStatus.innerHTML='<p class="status error">Elegí una fecha válida. En Refugio, la salida debe ser posterior al ingreso.</p>';return;}
    try{await ATDB.addBlockedDates(dbName(),dates);adminStatus.innerHTML='<p class="status success">Fechas marcadas como ocupadas.</p>';await loadBlocked();}
    catch(e){console.error(e);adminStatus.innerHTML='<p class="status error">No se pudieron bloquear las fechas.</p>';}
  });
  document.getElementById('freeBtn').addEventListener('click',async()=>{
    const dates=selectedDates(); if(!dates.length){adminStatus.innerHTML='<p class="status error">Elegí una fecha válida.</p>';return;}
    try{await ATDB.removeBlockedDates(dbName(),dates);adminStatus.innerHTML='<p class="status success">Fechas liberadas.</p>';await loadBlocked();}
    catch(e){console.error(e);adminStatus.innerHTML='<p class="status error">No se pudieron liberar las fechas.</p>';}
  });
  placeButtons.forEach(b=>b.addEventListener('click',()=>{
    place=b.dataset.adminPlace;placeButtons.forEach(x=>x.classList.toggle('active',x===b));adminTo.disabled=place==='quinta';adminTo.value='';loadBlocked();
  }));

  async function loadLeads(){
    const tbody=document.getElementById('subscriberRows');tbody.innerHTML='<tr><td colspan="5">Cargando…</td></tr>';
    try{
      const rows=await ATDB.getLeads();
      if(!rows.length){tbody.innerHTML='<tr><td colspan="5">Todavía no hay registros.</td></tr>';return;}
      tbody.innerHTML=rows.map(r=>`<tr><td>${escapeHtml(r.nombre)}</td><td>${escapeHtml(r.email)}</td><td>${escapeHtml(r.whatsapp||'—')}</td><td>${new Date(r.created_at).toLocaleString('es-AR')}</td><td><button class="table-delete" data-delete-lead="${r.id}">Eliminar</button></td></tr>`).join('');
      tbody.querySelectorAll('[data-delete-lead]').forEach(b=>b.addEventListener('click',async()=>{if(!confirm('¿Eliminar este registro?'))return;await ATDB.deleteLead(b.dataset.deleteLead);loadLeads();}));
    }catch(e){console.error(e);tbody.innerHTML='<tr><td colspan="5">No se pudieron cargar los registros.</td></tr>';}
  }
  const escapeHtml=s=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  document.getElementById('refreshSubs').addEventListener('click',loadLeads);
  document.getElementById('exportSubs').addEventListener('click',async()=>{
    try{
      const rows=await ATDB.getLeads();
      const csv=['Nombre,Email,WhatsApp,Fecha',...rows.map(r=>[r.nombre,r.email,r.whatsapp||'',new Date(r.created_at).toLocaleString('es-AR')].map(v=>'"'+String(v).replaceAll('"','""')+'"').join(','))].join('\n');
      const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'}));a.download='contactos-alquileres-temporales.csv';a.click();URL.revokeObjectURL(a.href);
    }catch(e){alert('No se pudo exportar el archivo.');}
  });
  adminFrom.min=ymd(today);adminTo.min=ymd(today);
  boot();
})();
