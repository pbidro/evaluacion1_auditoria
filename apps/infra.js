function loadInfra(){
    const diagram=`graph TD;
        subgraph "Piso 1"
            p1sec[Secretar\u00eda];
            p1h1[Habitaci\u00f3n 101];
            p1h2[Habitaci\u00f3n 102];
            p1h3[Habitaci\u00f3n 103];
            p1bano[Ba\u00f1o 1];
            p1h1 --> p1pc1(PC1);
            p1h2 --> p1sw1(Switch);
            p1bano --> p1rack(Rack viejo);
        end
        subgraph "Piso 2"
            p2sec[Secretar\u00eda];
            p2h1[Habitaci\u00f3n 201];
            p2h2[Habitaci\u00f3n 202];
            p2h3[Habitaci\u00f3n 203];
            p2bano[Ba\u00f1o 2];
            p2h1 --> p2router(Router);
            p2h2 --> p2srv(Servidor);
        end
        subgraph "Piso 3"
            p3sec[Secretar\u00eda];
            p3h1[Habitaci\u00f3n 301];
            p3h2[Habitaci\u00f3n 302];
            p3h3[Habitaci\u00f3n 303];
            p3bano[Ba\u00f1o 3];
            p3h1 --> p3pc(PC Soporte);
            p3bano --> p3srvb(Servidor Auxiliar);
        end
        subgraph "Piso 4"
            p4sec[Secretar\u00eda];
            p4h1[Habitaci\u00f3n 401];
            p4h2[Habitaci\u00f3n 402];
            p4h3[Habitaci\u00f3n 403];
            p4bano[Ba\u00f1o 4];
            p4h2 --> p4imp(Impresora);
            p4h3 --> p4pc2(PC Desarrollo);
        end
        subgraph "Piso 5"
            p5sec[Secretar\u00eda];
            p5h1[Habitaci\u00f3n 501];
            p5h2[Habitaci\u00f3n 502];
            p5h3[Habitaci\u00f3n 503];
            p5bano[Ba\u00f1o 5];
            p5h1 --> p5srv(Servidor Principal);
            p5h2 --> p5sw(Switch Backup);
        end`;
    const container=document.getElementById('infraDiagram');
    container.innerHTML=`<pre class="mermaid">${diagram}</pre>`;
    if(window.mermaid){mermaid.init(undefined, '#infraDiagram .mermaid');}
    if(window.enablePanning) enablePanning(container);
}
