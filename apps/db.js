function loadDB(){
    fetch('data.json').then(r=>r.json()).then(data=>{
        const nav=document.getElementById('dbNav');
        const table=document.getElementById('dbTable');
        nav.innerHTML='';

        function render(ds,tb){
            const rows=data[ds][tb];
            if(!rows||!rows.length) return;
            const keys=Object.keys(rows[0]);
            table.innerHTML='<thead><tr>'+keys.map(k=>`<th>${k}</th>`).join('')+'</tr></thead><tbody>'+
                rows.map(r=>'<tr>'+keys.map(k=>`<td>${r[k]}</td>`).join('')+'</tr>').join('')+
                '</tbody>';
            if(window.jQuery && $(table).DataTable){
                if($.fn.DataTable.isDataTable(table)) $(table).DataTable().destroy();
                $(table).DataTable({paging:true,searching:true,info:false,lengthChange:false});
            }
        }

        const tree=document.createElement('ul');
        tree.className='filetree';
        nav.appendChild(tree);

        Object.keys(data).forEach(ds=>{
            const dsLi=document.createElement('li');
            dsLi.textContent=ds;
            dsLi.classList.add('collapsed');
            const ul=document.createElement('ul');
            Object.keys(data[ds]).forEach(tb=>{
                const li=document.createElement('li');
                li.textContent=tb;
                li.addEventListener('click',e=>{e.stopPropagation();render(ds,tb);});
                ul.appendChild(li);
            });
            dsLi.appendChild(ul);
            dsLi.addEventListener('click',()=>dsLi.classList.toggle('collapsed'));
            tree.appendChild(dsLi);
        });

        const firstDs=Object.keys(data)[0];
        const firstTb=Object.keys(data[firstDs])[0];
        render(firstDs,firstTb);
    });
}
