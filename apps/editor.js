function initEditor(){
    document.getElementById('newDoc').addEventListener('click',()=>{document.getElementById('editor').value='';});
    document.getElementById('openDoc').addEventListener('click',()=>{document.getElementById('editor').value='Contenido de ejemplo';});
    document.getElementById('saveDoc').addEventListener('click',()=>alert('Documento guardado (simulado)'));
}
