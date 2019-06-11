
//// Code ported to Paper.js from http://the389.com/9/1/
// with permission.

// project.importSVG(localhost:3333/content/assets/Path.svg));
// project.importSVG(localhost:3333/content/assets/Path2.svg));

var width, height, center;
var points = 12;
var smooth = true;
var path = new Path();
var mousePos = view.center / 2;
var pathHeight = mousePos.y;

var ce = view.center
var topsegments = [new Point(ce.x-view.size.width/2, ce.y-view.size.height/2), new Point(ce.x+view.size.width/2, ce.y-view.size.height/2)]
var bottonsegments = [new Point(ce.x-view.size.width/2, ce.y+view.size.height/2), new Point(ce.x+view.size.width/2, ce.y+view.size.height/2)]
path.fillColor = {
        gradient: {
            stops: ['red', 'blue']
        },
        origin: new Path(topsegments),
        destination: new Path(bottonsegments)
    };
// path.fillColor = 'rgba(191, 148, 182, 0.29)';
// stops: ['rgba(255, 75, 31, .23)', 'rgba(31, 221, 255, .31)']
path.strokeColor = 'white';

var intLinesNum = 12;
var integrationLines = [];
var labelTexts = [];

initializePath();

function initializePath() {
	center = view.center;
	width = view.size.width;
	height = view.size.height / 2;
	path.segments = [];
	path.add(view.bounds.leftCenter);
	for (var i = 1; i < points; i++) {
		var point = new Point(width / points * i, center.y);
		path.add(point);
	}
	path.add(view.bounds.rightCenter);
	path.fullySelected = false; // show the points on the path here 
}

function onFrame(event) {
	for (var prevLines = 0; prevLines < integrationLines.length; prevLines++) {
		integrationLines[prevLines].remove();
	}
	integrationLines.length = 0;
	for (var pT = 0; pT < labelTexts.length; pT++) {
		labelTexts[pT].remove();
	}
	labelTexts.length = 0;
	if (mousePos.y > height+(height/1.8)) {
		mousePosYCeil = height+(height/1.8);
	} else if (mousePos.y < height-(height/1.8)) {
		mousePosYCeil = height-(height/1.8);
	} else {
		mousePosYCeil = mousePos.y;
	}
	pathHeight += (center.y - mousePosYCeil - pathHeight) / 10;
	for (var i = 1; i < points; i++) {
		var sinSeed = event.count + (i + i % 10) * 2000;
		var sinHeight = Math.sin(sinSeed / 200) * pathHeight;
		var yPos = Math.sin(sinSeed / 100) * sinHeight + height;
		path.segments[i].point.y = yPos;
	}
	for (var ni = 1; ni < intLinesNum; ni++) {
		var xPos = (width / intLinesNum) * ni;
		var centerpoint = new Point(xPos, height);
		var endpoint = new Point(xPos, path.segments[ni%12].point.y);
		var intpath = new Path.Line(centerpoint, endpoint);
		intpath.strokeColor = new Color(1, 1, 1, 0.25);
		intpath.strokeCap = 'butt';
		intpath.strokeWidth = 3;
		integrationLines.push(intpath)
		var highlightwidth = (width / intLinesNum) / 2
		if ((mousePos.x > (xPos - highlightwidth)) && (mousePos.x < (xPos + highlightwidth))) {
			var labeltext = new PointText({
				point: endpoint,
				content: height-endpoint.y,
				fillColor: new Color(1, 1, 1, 0.85),
				fontSize: Math.log(Math.abs(height-endpoint.y))*5, 
				fontFamily: 'Helvetica'
			});
		} else {
			var labeltext = new PointText({
				point: endpoint,
				content: height-endpoint.y,
				fillColor: new Color(1, 1, 1, 0.2),
				fontSize: 9, 
				fontFamily: 'Helvetica'
			});
		}
		labelTexts.push(labeltext)
	}
	if (smooth)
		path.smooth({ type: 'continuous' });
}

function onMouseMove(event) {
	mousePos = event.point;
}

function onMouseDown(event) {
	smooth = !smooth;
	if (!smooth) {
		// If smooth has been turned off, we need to reset
		// the handles of the path:
		for (var i = 0, l = path.segments.length; i < l; i++) {
			var segment = path.segments[i];
			segment.handleIn = segment.handleOut = null;
		}
	}
}

// Reposition the path whenever the window is resized:
function onResize(event) {
	initializePath();
}

function onKeyDown(event) {
	// When a key is pressed, set the content of the text item:
	
	// if (event.key == '1') {
	// 	points = 12;
	// 	initializePath();
	// }
	// if (event.key == '2') {
	// 	points = 24;
	// 	initializePath();
	// }
	// if (event.key == '3') {
	// 	points = 48;
	// 	initializePath();
	// }
	// if (event.key == '4') {
	// 	points = 4;
	// 	initializePath();
	// }
}
