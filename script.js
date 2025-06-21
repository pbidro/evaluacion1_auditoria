let topZ = 1;
let enabledPrograms = [];

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
    win.style.display = 'flex';
    if(!win.dataset.opened){
        win.dataset.opened = '1';
        toggleMaximize(win);
        if(id==='orgWindow') loadOrgChart();
        if(id==='infraWindow') loadInfra();
    }
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

function enablePanning(el){
    let isDown=false,startX,startY,scrollLeft,scrollTop;
    el.addEventListener('mousedown',e=>{
        isDown=true;
        el.classList.add('panning');
        startX=e.clientX;
        startY=e.clientY;
        scrollLeft=el.scrollLeft;
        scrollTop=el.scrollTop;
    });
    document.addEventListener('mousemove',e=>{
        if(!isDown) return;
        el.scrollLeft=scrollLeft-(e.clientX-startX);
        el.scrollTop=scrollTop-(e.clientY-startY);
    });
    document.addEventListener('mouseup',()=>{
        isDown=false;
        el.classList.remove('panning');
    });
}

function updateClock(){
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString();
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
    if(enabledPrograms.includes('contaWindow')) drawCharts();
    if(enabledPrograms.includes('dbWindow')) loadDB();
    if(enabledPrograms.includes('procWindow')) loadProcesses();
    if(enabledPrograms.includes('monWindow')) loadMonitor();
    if(enabledPrograms.includes('mailWindow')) loadMails();
    // orgWindow and infraWindow use GoJS which requires visible containers.
    // Load their data only when the windows are opened for the first time.
    if(enabledPrograms.includes('textWindow')) initEditor();
}

const defaultPrograms = [
  { id: 'dbWindow', name: 'Base de Datos', icon: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png', enabled: true },
  { id: 'infraWindow', name: 'Mapa de Infraestructura', icon: 'https://cdn-icons-png.flaticon.com/512/3474/3474369.png', enabled: true },
  { id: 'procWindow', name: 'Administrador de Procesos', icon: 'https://cdn-icons-png.flaticon.com/512/865/865821.png', enabled: true },
  { id: 'textWindow', name: 'Motor de Texto', icon: 'https://cdn-icons-png.flaticon.com/512/1027/1027219.png', enabled: true },
  { id: 'contaWindow', name: 'Contabilidad', icon: 'https://cdn-icons-png.flaticon.com/512/1773/1773381.png', enabled: true },
  { id: 'mailWindow', name: 'Hedwig Mail', icon: 'https://cdn-icons-png.flaticon.com/512/616/616490.png', enabled: true },
  { id: 'monWindow', name: 'Monitoreo', icon: 'https://cdn-icons-png.flaticon.com/512/3103/3103493.png', enabled: true },
  { id: 'orgWindow', name: 'Organigrama', icon: 'https://cdn-icons-png.flaticon.com/512/764/764460.png', enabled: true }
];

function loadPrograms(){
    return fetch('programs.json')
        .then(r=>r.json())
        .catch(()=>defaultPrograms)
        .then(data=>{
        const desktop=document.getElementById('desktop');
        const menu=document.querySelector('#startMenu ul');
        data.forEach(p=>{
            if(p.enabled===false){
                const w=document.getElementById(p.id);
                if(w) w.remove();
                return;
            }
            enabledPrograms.push(p.id);
            const icon=document.createElement('div');
            icon.className='icon';
            icon.dataset.window=p.id;
            icon.innerHTML=`<img src="${p.icon}" alt="${p.id}"><span>${p.name}</span>`;
            desktop.appendChild(icon);
            const li=document.createElement('li');
            li.dataset.window=p.id;
            li.textContent=p.name;
            menu.appendChild(li);
        });
    });
}

window.onload=()=>{
    loadPrograms().then(init);
};
