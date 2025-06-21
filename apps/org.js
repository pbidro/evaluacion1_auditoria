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
    shape.bind('stroke', 'isHighlighted', (isH, obj) =>
      isH ? theme.colors.selectionStroke : getStrokeForStatus(obj.part.data.status)
    ).ofObject();
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
    const root = diagram.findNodeForKey('Albus Dumbledore');
    if (!root) return;
    diagram.scale = 0.6;
    diagram.scrollToRect(root.actualBounds);
  });
}

const familyData = [
  { name: 'Albus Dumbledore', gender: 'M', status: 'wizard', born: '1881', death: '1997' },
  { name: 'Minerva McGonagall', gender: 'F', status: 'witch', born: '1935', death: null, parent: 'Albus Dumbledore' },
  { name: 'Severus Snape', gender: 'M', status: 'wizard', born: '1960', death: '1998', parent: 'Albus Dumbledore' },
  { name: 'Rubeus Hagrid', gender: 'M', status: 'wizard', born: '1928', death: null, parent: 'Albus Dumbledore' },
  { name: 'Sirius Black', gender: 'M', status: 'wizard', born: '1959', death: '1996', parent: 'Albus Dumbledore' },
  { name: 'Remus Lupin', gender: 'M', status: 'wizard', born: '1960', death: '1998', parent: 'Albus Dumbledore' },
  { name: 'Arthur Weasley', gender: 'M', status: 'wizard', born: '1950', death: null, parent: 'Albus Dumbledore' },
  { name: 'Molly Weasley', gender: 'F', status: 'witch', born: '1950', death: null, parent: 'Arthur Weasley' },
  { name: 'Bill Weasley', gender: 'M', status: 'wizard', born: '1970', death: null, parent: 'Ron Weasley' },
  { name: 'Charlie Weasley', gender: 'M', status: 'wizard', born: '1972', death: null, parent: 'Arthur Weasley' },
  { name: 'Percy Weasley', gender: 'M', status: 'wizard', born: '1976', death: null, parent: 'Arthur Weasley' },
  { name: 'Fred Weasley', gender: 'M', status: 'wizard', born: '1978', death: '1998', parent: 'Arthur Weasley' },
  { name: 'George Weasley', gender: 'M', status: 'wizard', born: '1978', death: null, parent: 'Arthur Weasley' },
  { name: 'Ron Weasley', gender: 'M', status: 'wizard', born: '1980', death: null, parent: 'Arthur Weasley' },
  { name: 'Ginny Weasley', gender: 'F', status: 'witch', born: '1981', death: null, parent: 'Arthur Weasley' },
  { name: 'Harry Potter', gender: 'M', status: 'wizard', born: '1980', death: null, parent: 'Arthur Weasley' },
  { name: 'Hermione Granger', gender: 'F', status: 'witch', born: '1979', death: null, parent: 'Harry Potter' },
  { name: 'James Sirius Potter', gender: 'M', status: 'wizard', born: '2004', death: null, parent: 'Harry Potter' },
  { name: 'Albus Severus Potter', gender: 'M', status: 'wizard', born: '2006', death: null, parent: 'Harry Potter' },
  { name: 'Lily Luna Potter', gender: 'F', status: 'witch', born: '2008', death: null, parent: 'Harry Potter' }
];

