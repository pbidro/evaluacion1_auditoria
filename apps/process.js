function loadProcesses(){
    const data=[['proceso.exe','Error'],['proceso.exe','Error'],['loginmanager','???']];
    const table=document.getElementById('procTable');
    table.innerHTML='<tr><th>Proceso</th><th>Estado</th></tr>'+data.map(p=>`<tr><td>${p[0]}</td><td>${p[1]}</td></tr>`).join('');
}
