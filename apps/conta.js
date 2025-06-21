function drawCharts(){
    const ctx1 = document.getElementById('chart1').getContext('2d');
    const ctx2 = document.getElementById('chart2').getContext('2d');
    const months=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const oficial=[100,200,150,170,190,210,180,205,230,240,260,300];
    const interno=[80,250,120,200,220,190,200,215,225,220,230,240];
    new Chart(ctx1,{type:'bar',data:{labels:months,datasets:[{label:'Sistema oficial',data:oficial,backgroundColor:'blue'}]},options:{responsive:false}});
    new Chart(ctx2,{type:'bar',data:{labels:months,datasets:[{label:'Software interno',data:interno,backgroundColor:'green'}]},options:{responsive:false}});
    const total1=oficial.reduce((a,b)=>a+b,0);
    const total2=interno.reduce((a,b)=>a+b,0);
    document.getElementById('totalConta').innerHTML=`<strong>Total oficial:</strong> ${total1} galleones<br><strong>Total interno:</strong> ${total2} galleones`;
}
