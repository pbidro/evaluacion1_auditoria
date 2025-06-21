function initEditor(){
    const editor = document.getElementById('editor');
    editor.innerHTML = '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>';
    document.getElementById('newDoc').addEventListener('click',()=>{editor.innerHTML='';});
    document.getElementById('openDoc').addEventListener('click',()=>{editor.innerHTML='<p>Contenido de ejemplo</p>';});
    document.getElementById('saveDoc').addEventListener('click',()=>alert('Documento guardado (simulado)'));
    document.getElementById('copyBtn').addEventListener('click',()=>document.execCommand('copy'));
    document.getElementById('pasteBtn').addEventListener('click',()=>document.execCommand('paste'));
    document.getElementById('boldBtn').addEventListener('click',()=>document.execCommand('bold'));
    document.getElementById('italicBtn').addEventListener('click',()=>document.execCommand('italic'));
    document.getElementById('underlineBtn').addEventListener('click',()=>document.execCommand('underline'));
    document.getElementById('alignLeftBtn').addEventListener('click',()=>document.execCommand('justifyLeft'));
    document.getElementById('alignCenterBtn').addEventListener('click',()=>document.execCommand('justifyCenter'));
    document.getElementById('alignRightBtn').addEventListener('click',()=>document.execCommand('justifyRight'));
    document.getElementById('bulletsBtn').addEventListener('click',()=>document.execCommand('insertUnorderedList'));
    document.getElementById('numberedBtn').addEventListener('click',()=>document.execCommand('insertOrderedList'));
}
