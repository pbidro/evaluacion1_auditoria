let topZ = 1;

function bringToFront(win){
    win.style.zIndex = ++topZ;
}

function toggleMaximize(win){
    if(!win) return;
    if(win.classList.contains('maximized')){
        win.classList.remove('maximized');
        if(win.dataset.prevLeft){
            win.style.left = win.dataset.prevLeft;
            win.style.top = win.dataset.prevTop;
            win.style.width = win.dataset.prevWidth;
            win.style.height = win.dataset.prevHeight;
        }
    }else{
        win.dataset.prevLeft = win.style.left;
        win.dataset.prevTop = win.style.top;
        win.dataset.prevWidth = win.style.width;
        win.dataset.prevHeight = win.style.height;
        win.classList.add('maximized');
        win.style.left = '0';
        win.style.top = '0';
        win.style.width = '100vw';
        win.style.height = 'calc(100vh - 32px)';
    }
    bringToFront(win);
}

function createTaskItem(id){
    const existing = document.querySelector(`#taskItems button[data-window="${id}"]`);
    if(existing) return;
    const btn = document.createElement('button');
    btn.textContent = document.querySelector(`.icon[data-window="${id}"] span`).textContent;
    btn.dataset.window = id;
    btn.addEventListener('click', ()=>openWindow(id));
    document.getElementById('taskItems').appendChild(btn);
}

function openWindow(id){
    const win = document.getElementById(id);
    if(!win) return;
    win.style.display = 'block';
    bringToFront(win);
    createTaskItem(id);
}

function initIcons(){
    document.querySelectorAll('.icon').forEach(icon=>{
        icon.addEventListener('dblclick', ()=>openWindow(icon.dataset.window));
        icon.addEventListener('click', ()=>{
            document.querySelectorAll('.icon').forEach(i=>i.classList.remove('selected'));
            icon.classList.add('selected');
        });
    });
}

function initControls(){
    document.querySelectorAll('.close').forEach(btn=>{
        btn.addEventListener('click', (e)=>{
            const win = e.target.closest('.window');
            win.style.display = 'none';
            const task = document.querySelector(`#taskItems button[data-window="${win.id}"]`);
            if(task) task.remove();
        });
    });
    document.querySelectorAll('.minimize').forEach(btn=>{
        btn.addEventListener('click', (e)=>{
            e.target.closest('.window').style.display='none';
        });
    });
    document.querySelectorAll('.window').forEach(win=>{
        win.addEventListener('mousedown', ()=>bringToFront(win));
    });
    document.querySelectorAll('.maximize').forEach(btn=>{
        btn.addEventListener('click',e=>{
            const win=e.target.closest('.window');
            toggleMaximize(win);
        });
    });
}

function initStartMenu(){
    const btn = document.getElementById('startBtn');
    const menu = document.getElementById('startMenu');
    btn.addEventListener('click', e=>{
        e.stopPropagation();
        menu.style.display = menu.style.display==='block' ? 'none':'block';
    });
    document.addEventListener('click', e=>{
        if(e.target!==btn && !menu.contains(e.target)){
            menu.style.display='none';
        }
    });
    menu.querySelectorAll('li').forEach(li=>{
        li.addEventListener('click', ()=>{
            openWindow(li.dataset.window);
            menu.style.display='none';
        });
    });
}

function dragWindows(){
    document.querySelectorAll('.window').forEach(win=>{
        const bar = win.querySelector('.title-bar');
        let offsetX, offsetY, dragging=false;
        bar.addEventListener('mousedown', e=>{
            dragging=true;
            offsetX = e.clientX - win.offsetLeft;
            offsetY = e.clientY - win.offsetTop;
        });
        document.addEventListener('mousemove', e=>{
            if(dragging){
                win.style.left = (e.clientX - offsetX)+'px';
                win.style.top = (e.clientY - offsetY)+'px';
            }
        });
        document.addEventListener('mouseup', ()=>dragging=false);
    });
}

function initResize(){
    document.querySelectorAll('.window').forEach(win=>{
        ['ne','nw','se','sw'].forEach(dir=>{
            const res=document.createElement('div');
            res.className=`resizer ${dir}`;
            win.appendChild(res);
            res.addEventListener('mousedown',e=>startResize(e,win,dir));
        });
    });
}

function startResize(e,win,dir){
    e.preventDefault();
    bringToFront(win);
    const startX=e.clientX; const startY=e.clientY;
    const startW=win.offsetWidth; const startH=win.offsetHeight;
    const startL=win.offsetLeft; const startT=win.offsetTop;
    function doDrag(ev){
        let w=startW, h=startH, l=startL, t=startT;
        if(dir.includes('e')) w=startW+(ev.clientX-startX);
        if(dir.includes('s')) h=startH+(ev.clientY-startY);
        if(dir.includes('w')){w=startW-(ev.clientX-startX); l=startL+(ev.clientX-startX);} 
        if(dir.includes('n')){h=startH-(ev.clientY-startY); t=startT+(ev.clientY-startY);} 
        win.style.width=w+'px';
        win.style.height=h+'px';
        win.style.left=l+'px';
        win.style.top=t+'px';
    }
    function stopDrag(){
        document.removeEventListener('mousemove',doDrag);
        document.removeEventListener('mouseup',stopDrag);
    }
    document.addEventListener('mousemove',doDrag);
    document.addEventListener('mouseup',stopDrag);
}

function dragIcons(){
    document.querySelectorAll('.icon').forEach(icon=>{
        let offsetX, offsetY, dragging=false;
        icon.addEventListener('mousedown', e=>{
            dragging=true;
            offsetX = e.clientX - icon.offsetLeft;
            offsetY = e.clientY - icon.offsetTop;
            icon.classList.add('selected');
        });
        document.addEventListener('mousemove', e=>{
            if(dragging){
                icon.style.position='absolute';
                icon.style.left=(e.clientX-offsetX)+'px';
                icon.style.top=(e.clientY-offsetY)+'px';
            }
        });
        document.addEventListener('mouseup', ()=>dragging=false);
    });
}

function updateClock(){
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString();
}

function drawCharts(){
    const ctx1 = document.getElementById('chart1').getContext('2d');
    const ctx2 = document.getElementById('chart2').getContext('2d');
    new Chart(ctx1,{type:'bar',data:{labels:['Ene','Feb'],datasets:[{label:'Sistema oficial',data:[100,200],backgroundColor:'blue'}]},options:{responsive:false}});
    new Chart(ctx2,{type:'bar',data:{labels:['Ene','Feb'],datasets:[{label:'Software interno',data:[80,250],backgroundColor:'green'}]},options:{responsive:false}});
}

function loadMonitor(){
    const systems=[
        {n:'Servidor Web',s:'ok'},
        {n:'Base de Datos',s:'ok'},
        {n:'Correo',s:'fail'},
        {n:'VPN',s:'ok'},
        {n:'Impresora',s:'fail'},
        {n:'API Pagos',s:'intermittent'},
        {n:'Backup',s:'ok'},
        {n:'Cache',s:'intermittent'}
    ];
    const table=document.getElementById('monTable');
    table.innerHTML='<tr><th>Sistema</th><th>Estado</th></tr>'+systems.map(s=>`<tr><td>${s.n}</td><td class="${s.s}">${s.s}</td></tr>`).join('');
}

function loadOrgChart(){
    const chart=`graph TD;
        A[Jefe Supremo];
        B[Gerente TI];
        C[Primo del jefe];
        D[Jardinero\\nEncargado de la base de datos];
        A-->B;
        A-->C;
        B-->D;`;
    document.getElementById('orgChart').innerHTML=`<pre class="mermaid">${chart}</pre>`;
    if(window.mermaid){mermaid.init(undefined, '#orgChart .mermaid');}
}

function loadInfra(){
    const diagram=`graph LR;
        PC[Oficina]-->S1((Servidor 1));
        S1-->S2((Servidor 2));
        S2-->DB[(Base de Datos)];
        DB-->Bano[Ba\u00f1o];`;
    document.getElementById('infraDiagram').innerHTML=`<pre class="mermaid">${diagram}</pre>`;
    if(window.mermaid){mermaid.init(undefined, '#infraDiagram .mermaid');}
}

function loadDB(){
    fetch('data.json').then(r=>r.json()).then(data=>{
        const table=document.getElementById('dbTable');
        table.innerHTML='<thead><tr><th>Nombre</th><th>RUT</th><th>Dirección</th></tr></thead><tbody>'+
            data.alumnos.map(a=>`<tr><td>${a.nombre}</td><td>${a.rut}</td><td>${a.direccion}</td></tr>`).join('')+
            '</tbody>';
        if(window.jQuery && $(table).DataTable){
            $(table).DataTable({paging:true,searching:true,info:false,lengthChange:false});
        }
    });
}

function loadProcesses(){
    const data=[['proceso.exe','Error'],['proceso.exe','Error'],['loginmanager','???']];
    const table=document.getElementById('procTable');
    table.innerHTML='<tr><th>Proceso</th><th>Estado</th></tr>'+data.map(p=>`<tr><td>${p[0]}</td><td>${p[1]}</td></tr>`).join('');
}

function loadMails(){
    fetch('mails.json').then(r=>r.json()).then(mails=>{
        const list=document.getElementById('mailList');
        const view=document.getElementById('mailView');
        list.innerHTML='';
        mails.forEach((m,i)=>{
            const item=document.createElement('div');
            item.className='list-group-item list-group-item-action mail-item';
            item.innerHTML=`<strong>${m.subject}</strong><br><small>${m.from} - ${m.date}</small>`;
            item.addEventListener('click',()=>{
                document.querySelectorAll('#mailList .mail-item').forEach(el=>el.classList.remove('selected'));
                item.classList.add('selected');
                view.innerHTML=`<h5>${m.subject}</h5><p><strong>De:</strong> ${m.from}<br><strong>Para:</strong> ${m.to}<br><strong>Fecha:</strong> ${m.date}</p><p>${m.body}</p>`;
            });
            list.appendChild(item);
            if(i===0) item.click();
        });
    });
}

function initEditor(){
    document.getElementById('newDoc').addEventListener('click',()=>{document.getElementById('editor').value='';});
    document.getElementById('openDoc').addEventListener('click',()=>{document.getElementById('editor').value='Contenido de ejemplo';});
    document.getElementById('saveDoc').addEventListener('click',()=>alert('Documento guardado (simulado)'));
}

function init(){
    initIcons();
    initControls();
    initStartMenu();
    dragWindows();
    initResize();
    dragIcons();
    updateClock();
    setInterval(updateClock,1000);
    drawCharts();
    loadDB();
    loadProcesses();
    loadMonitor();
    loadMails();
    loadOrgChart();
    loadInfra();
    initEditor();
}

window.onload=init;
