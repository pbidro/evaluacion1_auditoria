function drawCharts(){
    const ctx1 = document.getElementById('chart1').getContext('2d');
    const ctx2 = document.getElementById('chart2').getContext('2d');
    new Chart(ctx1,{type:'bar',data:{labels:['Ene','Feb'],datasets:[{label:'Sistema oficial',data:[100,200],backgroundColor:'blue'}]},options:{responsive:false}});
    new Chart(ctx2,{type:'bar',data:{labels:['Ene','Feb'],datasets:[{label:'Software interno',data:[80,250],backgroundColor:'green'}]},options:{responsive:false}});
}
