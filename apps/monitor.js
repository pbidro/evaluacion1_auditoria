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
