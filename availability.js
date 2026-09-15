(() => {
  const monthsEl = document.getElementById('calendarMonths');
  if (!monthsEl) return;
  const placeButtons = [...document.querySelectorAll('[data-place]')];
  const refugioBooking = document.getElementById('refugioBooking');
  const quintaBooking = document.getElementById('quintaBooking');
  const refFrom = document.getElementById('refFrom');
  const refTo = document.getElementById('refTo');
  const refStatus = document.getElementById('refStatus');
  const quintaSelected = document.getElementById('quintaSelected');
  const quintaWhatsApp = document.getElementById('quintaWhatsApp');
  let place = 'refugio';
  let blocked = new Set();
  let selectedQuinta = null;
  let loading = false;

  const dbName = () => place === 'refugio' ? 'refugio-serrano' : 'la-quinta';
  const pad = n => String(n).padStart(2,'0');
  const ymd = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const parse = s => { const [y,m,d] = s.split('-').map(Number); return new Date(y,m-1,d); };
  const fmt = s => new Intl.DateTimeFormat('es-AR',{day:'2-digit',month:'2-digit',year:'numeric'}).format(parse(s));
  const today = new Date(); today.setHours(0,0,0,0);

  function rangeNights(from,to) {
    const out=[]; let d=parse(from), end=parse(to);
    while(d<end){out.push(ymd(d)); d.setDate(d.getDate()+1);} return out;
  }

  async function load() {
    loading = true;
    monthsEl.innerHTML = '<p class="status info">Cargando disponibilidad…</p>';
    try {
      blocked = new Set(await ATDB.getBlockedDates(dbName()));
      loading = false;
      render();
    } catch(e) {
      loading = false;
      console.error('Error cargando disponibilidad:', e);
      monthsEl.innerHTML = '<p class="status error">No se pudo cargar el calendario. Revisá la conexión con Supabase y recargá la página.</p>';
    }
  }

  function render() {
    monthsEl.innerHTML='';
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    for(let i=0;i<8;i++){
      const first=new Date(start.getFullYear(),start.getMonth()+i,1);
      const month=document.createElement('section'); month.className='month-card';
      month.innerHTML=`<h3>${new Intl.DateTimeFormat('es-AR',{month:'long',year:'numeric'}).format(first)}</h3><div class="weekdays"><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span></div><div class="days"></div>`;
      const days=month.querySelector('.days');
      const offset=(first.getDay()+6)%7;
      for(let b=0;b<offset;b++) days.append(document.createElement('span'));
      const count=new Date(first.getFullYear(),first.getMonth()+1,0).getDate();
      for(let day=1;day<=count;day++){
        const d=new Date(first.getFullYear(),first.getMonth(),day), key=ymd(d);
        const btn=document.createElement('button'); btn.type='button'; btn.textContent=day; btn.dataset.date=key;
        const past=d<today;
        btn.className='day';
        if(past){btn.classList.add('past');btn.disabled=true;}
        else if(blocked.has(key)){btn.classList.add('blocked');btn.disabled=true;btn.title='No disponible';}
        else btn.classList.add('available');
        if(place==='quinta' && key===selectedQuinta) btn.classList.add('selected');
        btn.addEventListener('click',()=>selectDate(key));
        days.append(btn);
      }
      monthsEl.append(month);
    }
  }

  function selectDate(key){
    if(place==='quinta'){
      selectedQuinta=key; quintaSelected.textContent=`Fecha seleccionada: ${fmt(key)}`; quintaWhatsApp.disabled=false; render();
    } else {
      if(!refFrom.value || (refFrom.value && refTo.value)) { refFrom.value=key; refTo.value=''; refStatus.innerHTML=''; }
      else if(parse(key)>parse(refFrom.value)) refTo.value=key;
      else refFrom.value=key;
    }
  }

  function setPlace(p){
    place=p; selectedQuinta=null;
    placeButtons.forEach(b=>b.classList.toggle('active',b.dataset.place===p));
    refugioBooking.hidden=p!=='refugio'; quintaBooking.hidden=p!=='quinta';
    load();
  }
  placeButtons.forEach(b=>b.addEventListener('click',()=>setPlace(b.dataset.place)));

  document.getElementById('refugioForm').addEventListener('submit',e=>{
    e.preventDefault();
    const from=refFrom.value,to=refTo.value,guests=document.getElementById('refGuests').value;
    if(!from||!to||parse(to)<=parse(from)){refStatus.innerHTML='<p class="status error">Elegí una fecha de salida posterior al ingreso.</p>';return;}
    const nights=rangeNights(from,to);
    if(nights.length<2){refStatus.innerHTML='<p class="status error">Refugio Serrano tiene una estadía mínima de 2 noches.</p>';return;}
    const clash=nights.find(d=>blocked.has(d));
    if(clash){refStatus.innerHTML=`<p class="status error">La estadía cruza una fecha ocupada (${fmt(clash)}). Elegí otro rango.</p>`;return;}
    const msg=`Hola, quisiera consultar disponibilidad para Refugio Serrano. Ingreso: ${fmt(from)}. Salida: ${fmt(to)}. Huéspedes: ${guests}.`;
    open(`https://wa.me/${AT.wa}?text=${encodeURIComponent(msg)}`,'_blank','noopener');
  });

  quintaWhatsApp.addEventListener('click',()=>{
    if(!selectedQuinta)return;
    const msg=`Hola, quisiera consultar La Quinta para el día ${fmt(selectedQuinta)}.`;
    open(`https://wa.me/${AT.wa}?text=${encodeURIComponent(msg)}`,'_blank','noopener');
  });

  [refFrom,refTo].forEach(inp=>inp.min=ymd(today));
  setPlace(place);
})();
