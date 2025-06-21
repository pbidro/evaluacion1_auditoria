// Advanced organizational chart using GoJS family tree sample
function loadOrgChart() {
  const nameProperty = 'name';
  const genderProperty = 'gender';
  const statusProperty = 'status';

  const theme = {
    colors: {
      femaleBadgeBackground: '#FFCBEA',
      maleBadgeBackground: '#A2DAFF',
      femaleBadgeText: '#7A005E',
      maleBadgeText: '#001C76',
      kingQueenBorder: '#FEBA00',
      princePrincessBorder: '#679DDA',
      civilianBorder: '#58ADA7',
      personText: '#383838',
      personNodeBackground: '#FFFFFF',
      selectionStroke: '#485670',
      counterBackground: '#485670',
      counterBorder: '#FFFFFF',
      counterText: '#FFFFFF',
      link: '#686E76'
    },
    fonts: {
      badgeFont: 'bold 12px Poppins',
      birthDeathFont: '14px Poppins',
      nameFont: '500 18px Poppins',
      counterFont: '14px Poppins'
    }
  };

  const $ = go.GraphObject.make;

  const onMouseEnterPart = (e, part) => part.isHighlighted = true;
  const onMouseLeavePart = (e, part) => { if (!part.isSelected) part.isHighlighted = false; };
  const onSelectionChange = (part) => { part.isHighlighted = part.isSelected; };

  const STROKE_WIDTH = 3;
  const ADORNMENT_STROKE_WIDTH = STROKE_WIDTH + 1;
  const CORNER_ROUNDNESS = 12;
  const IMAGE_TOP_MARGIN = 20;
  const MAIN_SHAPE_NAME = 'mainShape';
  const IMAGE_DIAMETER = 40;

  const getStrokeForStatus = (status) => {
    switch (status) {
      case 'king':
      case 'queen':
        return theme.colors.kingQueenBorder;
      case 'prince':
      case 'princess':
        return theme.colors.princePrincessBorder;
      default:
        return theme.colors.civilianBorder;
    }
  };

  function strokeStyle(shape) {
    shape.fill = theme.colors.personNodeBackground;
    shape.strokeWidth = STROKE_WIDTH;
    shape.bind('stroke', statusProperty, s => getStrokeForStatus(s));
    shape.bindObject('stroke', 'isHighlighted', (isH, obj) =>
      isH ? theme.colors.selectionStroke : getStrokeForStatus(obj.part.data.status)
    );
    return shape;
  }

  const genderToText = (gender) => (gender === 'M' ? 'MALE' : 'FEMALE');
  const genderToTextColor = (gender) => gender === 'M' ? theme.colors.maleBadgeText : theme.colors.femaleBadgeText;
  const genderToFillColor = (gender) => gender === 'M' ? theme.colors.maleBadgeBackground : theme.colors.femaleBadgeBackground;

  const personBadge = () =>
    $(go.Panel, 'Auto',
      { alignmentFocus: go.Spot.TopRight, alignment: new go.Spot(1, 0, -25, STROKE_WIDTH - 0.5) },
      $(go.Shape,
        {
          figure: 'RoundedRectangle',
          parameter1: CORNER_ROUNDNESS,
          parameter2: 4 | 8,
          desiredSize: new go.Size(NaN, 22.5),
          stroke: null
        },
        new go.Binding('fill', genderProperty, genderToFillColor)
      ),
      $(go.TextBlock,
        { font: theme.fonts.badgeFont },
        new go.Binding('stroke', genderProperty, genderToTextColor),
        new go.Binding('text', genderProperty, genderToText)
      )
    );

  const personBirthDeathTextBlock = () =>
    $(go.TextBlock,
      {
        stroke: theme.colors.personText,
        font: theme.fonts.birthDeathFont,
        alignmentFocus: go.Spot.Top,
        alignment: new go.Spot(0.5, 1, 0, -35)
      },
      new go.Binding('text', '', ({ born, death }) => {
        if (!born) return '';
        return `${born} - ${death ?? ''}`;
      })
    );

  const personCounter = () =>
    $(go.Panel, 'Auto',
      { visible: false, alignmentFocus: go.Spot.Center, alignment: go.Spot.Bottom },
      new go.Binding('visible', '', (obj) => obj.part.findLinksOutOf().count > 0).ofObject(),
      $(go.Shape, 'Circle',
        {
          desiredSize: new go.Size(29, 29),
          strokeWidth: STROKE_WIDTH,
          stroke: theme.colors.counterBorder,
          fill: theme.colors.counterBackground
        }
      ),
      $(go.TextBlock,
        {
          alignment: new go.Spot(0.5, 0.5, 0, 1),
          stroke: theme.colors.counterText,
          font: theme.fonts.counterFont,
          textAlign: 'center'
        },
        new go.Binding('text', '', (obj) => obj.part.findNodesOutOf().count).ofObject()
      )
    );

  const personImage = () =>
    $(go.Panel, 'Spot',
      { alignmentFocus: go.Spot.Top, alignment: new go.Spot(0, 0, STROKE_WIDTH / 2, IMAGE_TOP_MARGIN) },
      $(go.Shape,
        {
          figure: 'Circle',
          desiredSize: new go.Size(IMAGE_DIAMETER, IMAGE_DIAMETER)
        }
      ).apply(strokeStyle),
      $(go.TextBlock,
        { margin: 2, font: 'bold 14px sans-serif' },
        new go.Binding('text', nameProperty, n => n[0] || '')
      )
    );

  const personMainShape = () =>
    $(go.Shape,
      {
        figure: 'RoundedRectangle',
        desiredSize: new go.Size(215, 110),
        portId: '',
        parameter1: CORNER_ROUNDNESS
      }
    ).apply(strokeStyle);

  const personNameTextBlock = () =>
    $(go.TextBlock,
      {
        stroke: theme.colors.personText,
        font: theme.fonts.nameFont,
        desiredSize: new go.Size(160, 50),
        overflow: go.TextOverflow.Ellipsis,
        textAlign: 'center',
        verticalAlignment: go.Spot.Center,
        toolTip: $(go.ToolTip, $(go.TextBlock, { margin: 4 }, new go.Binding('text', nameProperty))),
        alignmentFocus: go.Spot.Top,
        alignment: new go.Spot(0.5, 0, 0, 25)
      },
      new go.Binding('text', nameProperty)
    );

  const createNodeTemplate = () =>
    $(go.Node, 'Spot',
      {
        selectionAdorned: false,
        mouseEnter: onMouseEnterPart,
        mouseLeave: onMouseLeavePart,
        selectionChanged: onSelectionChange
      },
      $(go.Panel, 'Spot',
        personMainShape(),
        personNameTextBlock(),
        personBirthDeathTextBlock()
      ),
      personImage(),
      personBadge(),
      personCounter()
    );

  const createLinkTemplate = () =>
    $(go.Link,
      {
        selectionAdorned: false,
        routing: go.Routing.Orthogonal,
        layerName: 'Background',
        mouseEnter: onMouseEnterPart,
        mouseLeave: onMouseLeavePart
      },
      $(go.Shape,
        {
          stroke: theme.colors.link,
          strokeWidth: 1
        },
        new go.Binding('stroke', 'isHighlighted', (isH) => isH ? theme.colors.selectionStroke : theme.colors.link).ofObject(),
        new go.Binding('stroke', 'isSelected', (sel) => sel ? theme.colors.selectionStroke : theme.colors.link).ofObject(),
        new go.Binding('strokeWidth', 'isSelected', (sel) => sel ? 2 : 1).ofObject()
      )
    );

  const diagram = $(go.Diagram, 'orgChart', {
    layout: $(go.TreeLayout, {
      angle: 90,
      nodeSpacing: 20,
      layerSpacing: 50,
      layerStyle: go.TreeLayout.LayerUniform,
      treeStyle: go.TreeStyle.LastParents,
      alternateAngle: 90,
      alternateLayerSpacing: 35,
      alternateAlignment: go.TreeAlignment.BottomRightBus,
      alternateNodeSpacing: 20
    }),
    'toolManager.hoverDelay': 100,
    linkTemplate: createLinkTemplate(),
    model: new go.TreeModel({ nodeKeyProperty: 'name' })
  });

  diagram.nodeTemplate = createNodeTemplate();
  diagram.model.addNodeDataCollection(familyData);

  diagram.addDiagramListener('InitialLayoutCompleted', () => {
    const root = diagram.findNodeForKey('King George V');
    if (!root) return;
    diagram.scale = 0.6;
    diagram.scrollToRect(root.actualBounds);
  });
}

const familyData = [
  { name: 'King George V', gender: 'M', status: 'king', born: '1865', death: '1936' },
  { name: 'King Edward VIII', gender: 'M', status: 'king', born: '1894', death: '1972', parent: 'King George V' },
  { name: 'King George VI', gender: 'M', status: 'king', born: '1895', death: '1952', parent: 'King George V' },
  { name: 'Princess Mary, Princess Royal and Countess of Harewood', gender: 'F', status: 'princess', born: '1897', death: '1965', parent: 'King George V' },
  { name: 'Prince Henry, Duke of Gloucester', gender: 'M', status: 'prince', born: '1900', death: '1974', parent: 'King George V' },
  { name: 'Prince George, Duke of Kent', gender: 'M', status: 'prince', born: '1902', death: '1942', parent: 'King George V' },
  { name: 'Prince John of the United Kingdom', gender: 'M', status: 'prince', born: '1905', death: '1919', parent: 'King George V' },
  { name: 'Queen Elizabeth II', gender: 'F', status: 'queen', born: '1926', death: '2022', parent: 'King George VI' },
  { name: 'Princess Margaret, Countess of Snowdon', gender: 'F', status: 'princess', born: '1930', death: '2002', parent: 'King George VI' },
  { name: 'George Lascelles', gender: 'M', status: 'civilian', born: '1923', death: '2011', parent: 'Princess Mary, Princess Royal and Countess of Harewood' },
  { name: 'Gerald Lascelles', gender: 'M', status: 'civilian', born: '1924', death: '1998', parent: 'Princess Mary, Princess Royal and Countess of Harewood' },
  { name: 'Prince William of Gloucester', gender: 'M', status: 'prince', born: '1941', death: '1972', parent: 'Prince Henry, Duke of Gloucester' },
  { name: 'Prince Richard, Duke of Gloucester', gender: 'M', status: 'prince', born: '1944', death: null, parent: 'Prince Henry, Duke of Gloucester' },
  { name: 'Prince Edward, Duke of Kent', gender: 'M', status: 'prince', born: '1935', death: null, parent: 'Prince George, Duke of Kent' },
  { name: 'Princess Alexandra, The Honourable Lady Ogilvy', gender: 'F', status: 'princess', born: '1936', death: null, parent: 'Prince George, Duke of Kent' },
  { name: 'Prince Michael of Kent', gender: 'M', status: 'prince', born: '1942', death: null, parent: 'Prince George, Duke of Kent' },
  { name: 'King Charles III', gender: 'M', status: 'king', born: '1948', death: null, parent: 'Queen Elizabeth II' },
  { name: 'Princess Anne, Princess Royal', gender: 'F', status: 'princess', born: '1950', death: null, parent: 'Queen Elizabeth II' },
  { name: 'Prince Andrew, Duke of York', gender: 'M', status: 'prince', born: '1960', death: null, parent: 'Queen Elizabeth II' },
  { name: 'Prince Edward, Duke of Edinburgh', gender: 'M', status: 'prince', born: '1964', death: null, parent: 'Queen Elizabeth II' },
  { name: 'David Armstrong-Jones, 2nd Earl of Snowdon', gender: 'M', status: 'prince', born: '1961', death: null, parent: 'Princess Margaret, Countess of Snowdon' },
  { name: 'Lady Sarah Chatto Armstrong-Jones', gender: 'F', status: 'princess', born: '1964', death: null, parent: 'Princess Margaret, Countess of Snowdon' },
  { name: 'David Lascelles', gender: 'M', status: 'civilian', born: '1950', death: null, parent: 'George Lascelles' },
  { name: 'James Lascelles', gender: 'M', status: 'civilian', born: '1953', death: null, parent: 'George Lascelles' },
  { name: 'Jeremy Lascelles', gender: 'M', status: 'civilian', born: '1955', death: null, parent: 'George Lascelles' },
  { name: 'Mark Lascelles', gender: 'M', status: 'civilian', born: '1964', death: null, parent: 'George Lascelles' },
  { name: 'Martin David Lascelles', gender: 'M', status: 'civilian', born: '1962', death: null, parent: 'Gerald Lascelles' },
  { name: 'Henry Lascelles', gender: 'M', status: 'civilian', born: '1953', death: null, parent: 'Gerald Lascelles' },
  { name: 'Alexander Windsor, Earl of Ulster', gender: 'M', status: 'civilian', born: '1974', death: null, parent: 'Prince Richard, Duke of Gloucester' },
  { name: 'Lady Davina Lewis', gender: 'F', status: 'civilian', born: '1977', death: null, parent: 'Prince Richard, Duke of Gloucester' },
  { name: 'Lady Rose Gilman', gender: 'F', status: 'civilian', born: '1980', death: null, parent: 'Prince Richard, Duke of Gloucester' },
  { name: 'George Windsor', gender: 'M', status: 'civilian', born: '1962', death: null, parent: 'Prince Edward, Duke of Kent' },
  { name: 'Lady Helen Taylor', gender: 'F', status: 'civilian', born: '1964', death: null, parent: 'Prince Edward, Duke of Kent' },
  { name: 'Lord Nicholas Windsor', gender: 'M', status: 'civilian', born: '1970', death: null, parent: 'Prince Edward, Duke of Kent' },
  { name: 'James Ogilvy', gender: 'M', status: 'civilian', born: '1964', death: null, parent: 'Princess Alexandra, The Honourable Lady Ogilvy' },
  { name: 'Marina Ogilvy', gender: 'F', status: 'civilian', born: '1966', death: null, parent: 'Princess Alexandra, The Honourable Lady Ogilvy' },
  { name: 'Lord Frederick Windsor', gender: 'M', status: 'civilian', born: '1979', death: null, parent: 'Prince Michael of Kent' },
  { name: 'Lady Gabriella Windsor', gender: 'F', status: 'civilian', born: '1981', death: null, parent: 'Prince Michael of Kent' },
  { name: 'Prince William, Prince of Wales', gender: 'M', status: 'prince', born: '1982', death: null, parent: 'King Charles III' },
  { name: 'Prince Harry, Duke of Sussex', gender: 'M', status: 'prince', born: '1984', death: null, parent: 'King Charles III' },
  { name: 'Peter Phillips', gender: 'M', status: 'civilian', born: '1977', death: null, parent: 'Princess Anne, Princess Royal' },
  { name: 'Zara Phillips', gender: 'F', status: 'civilian', born: '1981', death: null, parent: 'Princess Anne, Princess Royal' },
  { name: 'Princess Beatrice of York', gender: 'F', status: 'princess', born: '1988', death: null, parent: 'Prince Andrew, Duke of York' },
  { name: 'Princess Eugenie of York', gender: 'F', status: 'princess', born: '1990', death: null, parent: 'Prince Andrew, Duke of York' },
  { name: 'Lady Louise Windsor', gender: 'F', status: 'civilian', born: '2003', death: null, parent: 'Prince Edward, Duke of Edinburgh' },
  { name: 'James Viscount Severn, Earl of Wessex', gender: 'M', status: 'prince', born: '2007', death: null, parent: 'Prince Edward, Duke of Edinburgh' },
  { name: 'Samuel Chatto', gender: 'M', status: 'civilian', born: '1996', death: null, parent: 'Lady Sarah Chatto Armstrong-Jones' },
  { name: 'Arthur Chatto', gender: 'M', status: 'civilian', born: '1999', death: null, parent: 'Lady Sarah Chatto Armstrong-Jones' },
  { name: 'Emily Shard', gender: 'F', status: 'civilian', born: '1975', death: null, parent: 'David Lascelles' },
  { name: 'Benjamin Lascelles', gender: 'M', status: 'civilian', born: '1978', death: null, parent: 'David Lascelles' },
  { name: 'Alexander Lascelles', gender: 'M', status: 'civilian', born: '1980', death: null, parent: 'David Lascelles' },
  { name: 'Edward Lascelles', gender: 'M', status: 'civilian', born: '1982', death: null, parent: 'David Lascelles' },
  { name: 'Tanit Lascelles', gender: 'F', status: 'civilian', born: '1981', death: null, parent: 'James Lascelles' },
  { name: 'Tewa Lascelles', gender: 'M', status: 'civilian', born: '1985', death: null, parent: 'James Lascelles' },
  { name: 'Sophie Lascelles', gender: 'F', status: 'civilian', born: '1973', death: null, parent: 'James Lascelles' },
  { name: 'Rowan Lascelles', gender: 'M', status: 'civilian', born: '1977', death: null, parent: 'James Lascelles' },
  { name: 'Tallulah Lascelles', gender: 'F', status: 'civilian', born: '2005', death: null, parent: 'Jeremy Lascelles' },
  { name: 'Thomas Lascelles', gender: 'M', status: 'civilian', born: '1982', death: null, parent: 'Jeremy Lascelles' },
  { name: 'Ellen Lascelles', gender: 'F', status: 'civilian', born: '1984', death: null, parent: 'Jeremy Lascelles' },
  { name: 'Amy Lascelles', gender: 'F', status: 'civilian', born: '1986', death: null, parent: 'Jeremy Lascelles' },
  { name: 'Charlotte Lascelles', gender: 'F', status: 'civilian', born: '1996', death: null, parent: 'Mark Lascelles' },
  { name: 'Imogen Lascelles', gender: 'F', status: 'civilian', born: '1998', death: null, parent: 'Mark Lascelles' },
  { name: 'Miranda Lascelles', gender: 'F', status: 'civilian', born: '2000', death: null, parent: 'Mark Lascelles' },
  { name: 'Alexandre Joshua Lascelles', gender: 'M', status: 'civilian', born: '1996', death: null, parent: 'Martin David Lascelles' },
  { name: 'Maximillian David Lascelles', gender: 'M', status: 'civilian', born: '1991', death: null, parent: 'Henry Lascelles' },
  { name: 'Xan Windsor', gender: 'M', status: 'civilian', born: '2007', death: null, parent: 'Alexander Windsor, Earl of Ulster' },
  { name: 'Lady Cosima Windsor', gender: 'F', status: 'civilian', born: '2010', death: null, parent: 'Alexander Windsor, Earl of Ulster' },
  { name: 'Senna Lewis', gender: 'F', status: 'civilian', born: '2010', death: null, parent: 'Lady Davina Lewis' },
  { name: 'Lyla Gilman', gender: 'F', status: 'civilian', born: '2010', death: null, parent: 'Lady Rose Gilman' },
  { name: 'Edward Windsor', gender: 'M', status: 'civilian', born: '1988', death: null, parent: 'George Windsor' },
  { name: 'Lady Marina-Charlotte Windsor', gender: 'F', status: 'civilian', born: '1992', death: null, parent: 'George Windsor' },
  { name: 'Lady Amelia Windsor', gender: 'F', status: 'civilian', born: '1995', death: null, parent: 'George Windsor' },
  { name: 'Columbus Taylor', gender: 'M', status: 'civilian', born: '1994', death: null, parent: 'Lady Helen Taylor' },
  { name: 'Cassius Taylor', gender: 'M', status: 'civilian', born: '1996', death: null, parent: 'Lady Helen Taylor' },
  { name: 'Eloise Taylor', gender: 'F', status: 'civilian', born: '2003', death: null, parent: 'Lady Helen Taylor' },
  { name: 'Estella Taylor', gender: 'F', status: 'civilian', born: '2004', death: null, parent: 'Lady Helen Taylor' },
  { name: 'Albert Windsor', gender: 'M', status: 'civilian', born: '2007', death: null, parent: 'Lord Nicholas Windsor' },
  { name: 'Leopold Windsor', gender: 'M', status: 'civilian', born: '2009', death: null, parent: 'Lord Nicholas Windsor' },
  { name: 'Flora Ogilvy', gender: 'F', status: 'civilian', born: '1994', death: null, parent: 'James Ogilvy' },
  { name: 'Alexander Ogilvy', gender: 'M', status: 'civilian', born: '1996', death: null, parent: 'James Ogilvy' },
  { name: 'Zenouska Mowatt', gender: 'F', status: 'civilian', born: '1990', death: null, parent: 'Marina Ogilvy' },
  { name: 'Christian Mowatt', gender: 'M', status: 'civilian', born: '1993', death: null, parent: 'Marina Ogilvy' },
  { name: 'Prince George of Wales', gender: 'M', status: 'prince', born: '2013', death: null, parent: 'Prince William, Prince of Wales' },
  { name: 'Princess Charlotte of Wales', gender: 'F', status: 'princess', born: '2015', death: null, parent: 'Prince William, Prince of Wales' },
  { name: 'Prince Louis of Wales', gender: 'M', status: 'prince', born: '2018', death: null, parent: 'Prince William, Prince of Wales' },
  { name: 'Prince Archie of Sussex', gender: 'M', status: 'prince', born: '2019', death: null, parent: 'Prince Harry, Duke of Sussex' },
  { name: 'Princess Lilibet of Sussex', gender: 'F', status: 'princess', born: '2021', death: null, parent: 'Prince Harry, Duke of Sussex' },
  { name: 'Savannah Anne Kathleen Phillips', gender: 'F', status: 'civilian', born: '2010', death: null, parent: 'Peter Phillips' },
  { name: 'Isla Elizabeth Phillips', gender: 'F', status: 'civilian', born: '2012', death: null, parent: 'Peter Phillips' },
  { name: 'Mia Grace Tindall', gender: 'F', status: 'civilian', born: '2014', death: null, parent: 'Zara Phillips' },
  { name: 'Lena Elizabeth Tindall', gender: 'F', status: 'civilian', born: '2018', death: null, parent: 'Zara Phillips' },
  { name: 'Lucas Philip Tindall', gender: 'M', status: 'civilian', born: '2021', death: null, parent: 'Zara Phillips' },
  { name: 'Sienna Mapeli Mozzi', gender: 'F', status: 'civilian', born: '2021', death: null, parent: 'Princess Beatrice of York' },
  { name: 'August Brooksbank', gender: 'M', status: 'civilian', born: '2021', death: null, parent: 'Princess Eugenie of York' },
  { name: 'Ernest Brooksbank', gender: 'M', status: 'civilian', born: '2023', death: null, parent: 'Princess Eugenie of York' }
];

