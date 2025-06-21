function loadOrgChart(){
    const chart=`graph TD;
        A[Jefe Supremo];
        B[Gerente TI];
        C[Primo del jefe];
        D[Jardinero\\nEncargado de la base de datos];
        A-->B;
        A-->C;
        B-->D;`;
    document.getElementById('orgChart').innerHTML=`<pre class="mermaid">${chart}</pre>`;
    if(window.mermaid){mermaid.init(undefined, '#orgChart .mermaid');}
}
