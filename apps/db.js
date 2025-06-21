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

        Object.keys(data).forEach(ds=>{
            const dsDiv=document.createElement('div');
            dsDiv.textContent=ds;
            const ul=document.createElement('ul');
            Object.keys(data[ds]).forEach(tb=>{
                const li=document.createElement('li');
                li.textContent=tb;
                li.addEventListener('click',()=>render(ds,tb));
                ul.appendChild(li);
            });
            dsDiv.appendChild(ul);
            nav.appendChild(dsDiv);
        });

        const firstDs=Object.keys(data)[0];
        const firstTb=Object.keys(data[firstDs])[0];
        render(firstDs,firstTb);
    });
}
