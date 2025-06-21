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
