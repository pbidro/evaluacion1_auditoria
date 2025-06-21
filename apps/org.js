function loadOrgChart(){
    const $ = go.GraphObject.make;
    const diagram = $(go.Diagram, 'orgChart', {
        initialAutoScale: go.Diagram.Uniform,
        layout: $(go.TreeLayout, { angle: 90, layerSpacing: 40 })
    });

    diagram.nodeTemplate = $(go.Node, 'Auto',
        $(go.Shape, 'RoundedRectangle', { fill: '#CDE', strokeWidth: 0 }),
        $(go.TextBlock, { margin: 4, textAlign: 'center' }, new go.Binding('text', 'text'))
    );

    const nodes = [
        { key: 'CEO', text: 'Albus Dumbledore\nDirector' },
        { key: 'HeadTI', parent: 'CEO', text: 'Minerva McGonagall\nJefa TI' },
        { key: 'HeadRRHH', parent: 'CEO', text: 'Molly Weasley\nJefa RRHH' },
        { key: 'HeadINV', parent: 'CEO', text: 'Severus Snape\nJefe Investigaci\u00f3n' },
        { key: 'HeadOP', parent: 'CEO', text: 'Arthur Weasley\nJefe Operaciones' },
        { key: 'HeadADM', parent: 'CEO', text: 'Kingsley Shacklebolt\nJefe Administraci\u00f3n' },

        { key: 'TI1', parent: 'HeadTI', text: 'Hermione Granger\nDev Senior' },
        { key: 'TI2', parent: 'HeadTI', text: 'Harry Potter\nSoporte' },
        { key: 'TI3', parent: 'HeadTI', text: 'Ron Weasley\nRedes' },
        { key: 'TI4', parent: 'HeadTI', text: 'Luna Lovegood\nQA' },
        { key: 'TI5', parent: 'HeadTI', text: 'Neville Longbottom\nDBA' },
        { key: 'TI6', parent: 'HeadTI', text: 'Ginny Weasley\nDevOps' },
        { key: 'TI7', parent: 'HeadTI', text: 'Fred Weasley\nFrontend' },
        { key: 'TI8', parent: 'HeadTI', text: 'George Weasley\nBackend' },
        { key: 'TI9', parent: 'HeadTI', text: 'Cho Chang\nUX' },
        { key: 'TI10', parent: 'HeadTI', text: 'Tom Riddle\nConsultor externo' },

        { key: 'HR1', parent: 'HeadRRHH', text: 'Angelina Johnson\nAnalista' },
        { key: 'HR2', parent: 'HeadRRHH', text: 'Katie Bell\nReclutamiento' },
        { key: 'HR3', parent: 'HeadRRHH', text: 'Alicia Spinnet\nBienestar' },
        { key: 'HR4', parent: 'HeadRRHH', text: 'Lee Jordan\nCapacitaci\u00f3n' },
        { key: 'HR5', parent: 'HeadRRHH', text: 'Lavender Brown\nRelaciones' },
        { key: 'HR6', parent: 'HeadRRHH', text: 'Pansy Parkinson\nArchivo' },
        { key: 'HR7', parent: 'HeadRRHH', text: 'Draco Malfoy\nBecario' },

        { key: 'INV1', parent: 'HeadINV', text: 'Alastor Moody\nInvestigador' },
        { key: 'INV2', parent: 'HeadINV', text: 'Nymphadora Tonks\nInvestigadora' },
        { key: 'INV3', parent: 'HeadINV', text: 'Remus Lupin\nInvestigador' },
        { key: 'INV4', parent: 'HeadINV', text: 'Sirius Black\nInvestigador' },
        { key: 'INV5', parent: 'HeadINV', text: 'Gilderoy Lockhart\nEspecialista' },
        { key: 'INV6', parent: 'HeadINV', text: 'Rita Skeeter\nPeriodista' },
        { key: 'INV7', parent: 'HeadINV', text: 'Horace Slughorn\nQu\u00edmico' },
        { key: 'INV8', parent: 'HeadINV', text: 'Pomona Sprout\nBot\u00e1nica' },
        { key: 'INV9', parent: 'HeadINV', text: 'Bathilda Bagshot\nHistoriadora' },

        { key: 'OP1', parent: 'HeadOP', text: 'Percy Weasley\nCoordinador' },
        { key: 'OP2', parent: 'HeadOP', text: 'Barty Crouch Jr.\nSupervisor' },
        { key: 'OP3', parent: 'HeadOP', text: 'Barty Crouch Sr.\nLog\u00edstica' },
        { key: 'OP4', parent: 'HeadOP', text: 'Dolores Umbridge\nControl Interno' },
        { key: 'OP5', parent: 'HeadOP', text: 'Cornelius Fudge\nVocero' },
        { key: 'OP6', parent: 'HeadOP', text: 'Cedric Diggory\nOperador' },
        { key: 'OP7', parent: 'HeadOP', text: 'Viktor Krum\nOperador' },
        { key: 'OP8', parent: 'HeadOP', text: 'Kingsley Shacklebolt\nTurno extra' },

        { key: 'ADM1', parent: 'HeadADM', text: 'Filius Flitwick\nTesorer\u00eda' },
        { key: 'ADM2', parent: 'HeadADM', text: 'Madam Hooch\nCompras' },
        { key: 'ADM3', parent: 'HeadADM', text: 'Argus Filch\nMantenci\u00f3n' },
        { key: 'ADM4', parent: 'HeadADM', text: 'Nearly Headless Nick\nRecepci\u00f3n' },
        { key: 'ADM5', parent: 'HeadADM', text: 'Bloody Baron\nSeguridad' },
        { key: 'ADM6', parent: 'HeadADM', text: 'Moaning Myrtle\nArchivo' },
        { key: 'ADM7', parent: 'HeadADM', text: 'Hedwig\nMensajer\u00eda' },
        { key: 'ADM8', parent: 'HeadADM', text: 'Dobby\nSoporte' },
        { key: 'ADM9', parent: 'HeadADM', text: 'Kreacher\nServicios' },
        { key: 'ADM10', parent: 'HeadADM', text: 'Winky\nAsistente' }
    ];

    diagram.model = new go.TreeModel(nodes);
}
