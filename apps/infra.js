function loadInfra(){
    const $ = go.GraphObject.make;
    const diagram = $(go.Diagram, 'infraDiagram', {
        initialAutoScale: go.Diagram.Uniform,
        layout: $(go.LayeredDigraphLayout, { direction: 90, layerSpacing: 40 })
    });

    diagram.nodeTemplate = $(go.Node, 'Auto',
        $(go.Shape, 'RoundedRectangle', { fill: '#ACE', strokeWidth: 0 }),
        $(go.TextBlock, { margin: 4 }, new go.Binding('text', 'text'))
    );

    diagram.groupTemplate = $(go.Group, 'Auto',
        { layout: $(go.GridLayout, { wrappingWidth: Infinity, alignment: go.GridLayout.Position }) },
        $(go.Shape, 'Rectangle', { fill: '#f8f8f8', stroke: '#333', strokeWidth: 1 }),
        $(go.Panel, 'Vertical',
            $(go.TextBlock, { font: 'bold 12px sans-serif', margin: 2 }, new go.Binding('text', 'key')),
            $(go.Placeholder, { padding: 4 })
        )
    );

    const nodes = [
        { key: 'Piso 1', isGroup: true },
        { key: 'p1sec', text: 'Secretar\u00eda', group: 'Piso 1' },
        { key: 'p1h1', text: 'Habitaci\u00f3n 101', group: 'Piso 1' },
        { key: 'p1h2', text: 'Habitaci\u00f3n 102', group: 'Piso 1' },
        { key: 'p1h3', text: 'Habitaci\u00f3n 103', group: 'Piso 1' },
        { key: 'p1bano', text: 'Ba\u00f1o 1', group: 'Piso 1' },
        { key: 'p1pc1', text: 'PC1', group: 'Piso 1' },
        { key: 'p1sw1', text: 'Switch', group: 'Piso 1' },
        { key: 'p1rack', text: 'Rack viejo', group: 'Piso 1' },

        { key: 'Piso 2', isGroup: true },
        { key: 'p2sec', text: 'Secretar\u00eda', group: 'Piso 2' },
        { key: 'p2h1', text: 'Habitaci\u00f3n 201', group: 'Piso 2' },
        { key: 'p2h2', text: 'Habitaci\u00f3n 202', group: 'Piso 2' },
        { key: 'p2h3', text: 'Habitaci\u00f3n 203', group: 'Piso 2' },
        { key: 'p2bano', text: 'Ba\u00f1o 2', group: 'Piso 2' },
        { key: 'p2router', text: 'Router', group: 'Piso 2' },
        { key: 'p2srv', text: 'Servidor', group: 'Piso 2' },

        { key: 'Piso 3', isGroup: true },
        { key: 'p3sec', text: 'Secretar\u00eda', group: 'Piso 3' },
        { key: 'p3h1', text: 'Habitaci\u00f3n 301', group: 'Piso 3' },
        { key: 'p3h2', text: 'Habitaci\u00f3n 302', group: 'Piso 3' },
        { key: 'p3h3', text: 'Habitaci\u00f3n 303', group: 'Piso 3' },
        { key: 'p3bano', text: 'Ba\u00f1o 3', group: 'Piso 3' },
        { key: 'p3pc', text: 'PC Soporte', group: 'Piso 3' },
        { key: 'p3srvb', text: 'Servidor Auxiliar', group: 'Piso 3' },

        { key: 'Piso 4', isGroup: true },
        { key: 'p4sec', text: 'Secretar\u00eda', group: 'Piso 4' },
        { key: 'p4h1', text: 'Habitaci\u00f3n 401', group: 'Piso 4' },
        { key: 'p4h2', text: 'Habitaci\u00f3n 402', group: 'Piso 4' },
        { key: 'p4h3', text: 'Habitaci\u00f3n 403', group: 'Piso 4' },
        { key: 'p4bano', text: 'Ba\u00f1o 4', group: 'Piso 4' },
        { key: 'p4imp', text: 'Impresora', group: 'Piso 4' },
        { key: 'p4pc2', text: 'PC Desarrollo', group: 'Piso 4' },

        { key: 'Piso 5', isGroup: true },
        { key: 'p5sec', text: 'Secretar\u00eda', group: 'Piso 5' },
        { key: 'p5h1', text: 'Habitaci\u00f3n 501', group: 'Piso 5' },
        { key: 'p5h2', text: 'Habitaci\u00f3n 502', group: 'Piso 5' },
        { key: 'p5h3', text: 'Habitaci\u00f3n 503', group: 'Piso 5' },
        { key: 'p5bano', text: 'Ba\u00f1o 5', group: 'Piso 5' },
        { key: 'p5srv', text: 'Servidor Principal', group: 'Piso 5' },
        { key: 'p5sw', text: 'Switch Backup', group: 'Piso 5' }
    ];

    const links = [
        { from: 'p1h1', to: 'p1pc1' },
        { from: 'p1h2', to: 'p1sw1' },
        { from: 'p1bano', to: 'p1rack' },

        { from: 'p2h1', to: 'p2router' },
        { from: 'p2h2', to: 'p2srv' },

        { from: 'p3h1', to: 'p3pc' },
        { from: 'p3bano', to: 'p3srvb' },

        { from: 'p4h2', to: 'p4imp' },
        { from: 'p4h3', to: 'p4pc2' },

        { from: 'p5h1', to: 'p5srv' },
        { from: 'p5h2', to: 'p5sw' }
    ];

    diagram.model = new go.GraphLinksModel(nodes, links);
}
