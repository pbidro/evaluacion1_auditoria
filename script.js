let topZ = 1;

function bringToFront(win){
    win.style.zIndex = ++topZ;
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
        table.innerHTML='<tr><th>Nombre</th><th>RUT</th><th>Dirección</th></tr>'+
            data.alumnos.map(a=>`<tr><td>${a.nombre}</td><td>${a.rut}</td><td>${a.direccion}</td></tr>`).join('');
        document.getElementById('dbSearch').addEventListener('input',e=>{
            const term=e.target.value.toLowerCase();
            Array.from(table.querySelectorAll('tr')).slice(1).forEach(row=>{
                row.style.display=row.textContent.toLowerCase().includes(term)?'':'none';
            });
        });
    });
}

function loadProcesses(){
    const data=[['proceso.exe','Error'],['proceso.exe','Error'],['loginmanager','???']];
    const table=document.getElementById('procTable');
    table.innerHTML='<tr><th>Proceso</th><th>Estado</th></tr>'+data.map(p=>`<tr><td>${p[0]}</td><td>${p[1]}</td></tr>`).join('');
}

function loadMails(){
    const mails=[{asunto:'Contrato sin cifrar',cuerpo:'Adjunto contrato sin cifrar...'},
                 {asunto:'Prácticas cuestionables',cuerpo:'Se realizan prácticas dudosas...'}];
    const list=document.getElementById('mailList');
    const view=document.getElementById('mailView');
    mails.forEach((m,i)=>{
        const li=document.createElement('li');
        li.textContent=m.asunto;
        li.addEventListener('click',()=>{view.textContent=m.cuerpo;});
        list.appendChild(li);
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
