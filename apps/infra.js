function loadInfra(){
    const diagram=`graph LR;
        PC[Oficina]-->S1((Servidor 1));
        S1-->S2((Servidor 2));
        S2-->DB[(Base de Datos)];
        DB-->Bano[Ba\\u00f1o];`;
    document.getElementById('infraDiagram').innerHTML=`<pre class="mermaid">${diagram}</pre>`;
    if(window.mermaid){mermaid.init(undefined, '#infraDiagram .mermaid');}
}
