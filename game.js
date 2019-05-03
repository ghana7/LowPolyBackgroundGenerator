class Triangle {
	constructor(p1, p2, p3) {
		this.p1 = p1; //Point
		this.p2 = p2; //Point
		this.p3 = p3; //Point
		this.red = (p1.red + p2.red + p3.red) / 3; //Number
		this.blue = (p1.blue + p2.blue + p3.blue) / 3; //Number
		this.green = (p1.green + p2.green + p3.green) / 3; //Number
	}
	
	draw() {
		fillPolygon([this.p1.x, this.p1.y, this.p2.x, this.p2.y, this.p3.x, this.p3.y], makeColor(this.red, this.green, this.blue, 1));
	}
}

class Polygon {
	constructor(...args) {
		this.points = args;
		var totalRed = 0;
		var totalBlue = 0;
		var totalGreen = 0;
		for(var i = 0; i < this.points.length; i++) {
			totalRed += this.points[i].red;
			totalGreen += this.points[i].green;
			totalBlue += this.points[i].blue;
		}
		this.red = totalRed / this.points.length;
		this.green = totalGreen / this.points.length;
		this.blue = totalBlue / this.points.length;
	}
	
	draw() {
		var coords = [];
		for(var i = 0; i < this.points.length; i++) {
			coords.push(this.points[i].x);
			coords.push(this.points[i].y);
		}
		fillPolygon(coords, makeColor(this.red, this.green, this.blue, 1));
		strokePolygon(coords, makeColor(this.red, this.green, this.blue, 1), 3);
	}
}
class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		var bary1 = 1 - x / screenWidth - y / screenHeight;
		var bary2 = x / screenWidth;
		var bary3 = y / screenHeight;
		
		this.red = bary1 * TOP_LEFT_RED + bary2 * TOP_RIGHT_RED + bary3 * BOT_LEFT_RED;
		this.green = bary1 * TOP_LEFT_GREEN + bary2 * TOP_RIGHT_GREEN + bary3 * BOT_LEFT_GREEN;
		this.blue = bary1 * TOP_LEFT_BLUE + bary2 * TOP_RIGHT_BLUE + bary3 * BOT_LEFT_BLUE;
	}
	
	draw() {
		fillCircle(this.x, this.y, 12, makeColor(this.red, this.green, this.blue, 1));
	}
	
	toString() {
		return "(" + this.x + ", " + this.y + ")";
	}
}

class Line {
	constructor(p1, p2) {
		this.p1 = p1;
		this.p2 = p2;
		this.red = (this.p1.red + this.p2.red) / 2;
		this.green = (this.p1.green + this.p2.green) / 2;
		this.blue = (this.p1.blue + this.p2.blue) / 2;
		this.borderingPolys = 0;
	}
	
	Length() {
		return(distanceBetween(this.p1, this.p2));
	}
	
	draw() {
		strokeLine(this.p1.x, this.p1.y, this.p2.x, this.p2.y, makeColor(this.red, this.green, this.blue), 8);
	}
	
	toString() {
		return("p1: " + this.p1 + " p2: " + this.p2);
	}
	Intersects(otherLine) {
		var o1 = orientation(this.p1, this.p2, otherLine.p1);
		var o2 = orientation(this.p1, this.p2, otherLine.p2);
		var o3 = orientation(otherLine.p1, otherLine.p2, this.p1);
		var o4 = orientation(otherLine.p1, otherLine.p2, this.p2);
		
		if(o1 != o2 && o3 != o4) {
			return true;
		}
		
		if(o1 == 0 && onSegment(this.p1, otherLine.p1, this.p2)) {
			return true;
		}
		if(o2 == 0 && onSegment(this.p1, otherLine.p2, this.p2)) {
			return true;
		}
		if(o3 == 0 && onSegment(otherLine.p1, this.p1, otherLine.p2)) {
			return true;
		}
		if(o4 == 0 && onSegment(otherLine.p1, this.p2, otherLine.p2)) {
			return true;
		}
		return false;
	}
	
	SharesEndpointWith(otherLine) {
		return(this.p1 == otherLine.p1 || this.p1 == otherLine.p2 || this.p2 == otherLine.p1 || this.p2 == otherLine.p2);
	}
	
}

///////////////////////////////////////////////////////////////
//                                                           //
//                    CONSTANT STATE                         //

// TODO: DECLARE and INTIALIZE your constants here
var START_TIME = currentTime();

var TOP_LEFT_RED = Math.random();
var TOP_LEFT_GREEN = Math.random();
var TOP_LEFT_BLUE = Math.random();

var BOT_LEFT_RED = Math.random();
var BOT_LEFT_GREEN = Math.random();
var BOT_LEFT_BLUE = Math.random();

var TOP_RIGHT_RED = Math.random();
var TOP_RIGHT_GREEN = Math.random();
var TOP_RIGHT_BLUE = Math.random();

var UPDATING_LIVE = false;

var MAX_LINE_LENGTH = 420;
///////////////////////////////////////////////////////////////
//                                                           //
//                     MUTABLE STATE                         //

// TODO: DECLARE your variables here
var lastKeyCode;
var points;
var triangles;
var lines;
var polygons;
var voidPointsRemaining;
///////////////////////////////////////////////////////////////
//                                                           //
//                      EVENT RULES                          //

// When setup happens...
function onSetup() {
    // TODO: INITIALIZE your variables here
	points = [];
	triangles = [];
	polygons = [];
	lines = [];
	voidPointsRemaining = [];
	for(var i = 0; i < 50; i++) {
		var x = Math.random() * screenWidth;
		var y = Math.random() * screenHeight;
		
		points.push(new Point(x, y));
	}
	points.push(new Point(0, 0));
	points.push(new Point(0, screenHeight));
	points.push(new Point(screenWidth, 0));
	points.push(new Point(screenWidth, screenHeight));
	if(!UPDATING_LIVE) {
		spreadPointArray(points, 1000);
		
		generateObjects();
	}
	console.log(polygons);
    lastKeyCode = 0;
}


// When a key is pushed
function onKeyStart(key) {
    lastKeyCode = key;
}


// Called 30 times or more per second
function onTick() {
	
	
	if(UPDATING_LIVE) {
		generateObjects();
		spreadPointArray(points, 1);
	}
	
	
	
    clearRectangle(0, 0, screenWidth, screenHeight);

    
	//for(var i = 0; i < triangles.length; i++) {
	//	triangles[i].draw();
	//}
	for(var i = 0; i < polygons.length; i++) {
		polygons[i].draw();
	}
	//for(var i = 0; i < lines.length; i++) {
	//	lines[i].draw();
	//}
	//
	//for(var i = 0; i < points.length; i++) {
	//	points[i].draw();
	//}
	
	
	//spreadPointArray(points, 1);
}


///////////////////////////////////////////////////////////////
//                                                           //
//                      HELPER RULES                         //

function generateObjects() {
	for(var i = 0; i < points.length - 1; i++) {
		for(var j = i + 1; j < points.length; j++) {
			if(distanceBetween(points[i], points[j]) < MAX_LINE_LENGTH) {
				lines.push(new Line(points[i], points[j]));
			}
		}
	}
	cleanUpEdges(points, lines);
	clearIntersections(lines);
	cleanUpEdges(points, lines);
	
	for(var i = 0; i < points.length - 2; i++) {
		for(var j = i + 1; j < points.length - 1; j++) {
			for(var k = j + 1; k < points.length; k++) {
				if(formsHollowPolygon(lines, points[i], points[j], points[k])) {
					
					polygons.push(new Polygon(points[i], points[j], points[k]));
					lineConnecting(points[i], points[j], lines).borderingPolys++;
					lineConnecting(points[i], points[k], lines).borderingPolys++;
					lineConnecting(points[j], points[k], lines).borderingPolys++;
				}
			}
		}
	}

	voidPointsRemaining = findVoidPoints(points, lines);
	console.log(voidPointsRemaining.length);
	
	var iterationsOfVoidPoints = 0;
	while(voidPointsRemaining.length > 0) {
		iterationsOfVoidPoints++;
		if(iterationsOfVoidPoints > 500) {
			break;
		}
		voidPointsRemaining = findVoidPoints(points, lines);
		var randVoidPoint1 = voidPointsRemaining[Math.floor(Math.random() * voidPointsRemaining.length)];
		var randVoidPoint2 = voidPointsRemaining[Math.floor(Math.random() * voidPointsRemaining.length)];
		
		if(randVoidPoint1 != randVoidPoint2 && lineConnecting(randVoidPoint1, randVoidPoint2, lines) == null) {
			var newLine = new Line(randVoidPoint1, randVoidPoint2);
			
			var intersection = false;
			for(var i = 0; i < lines.length; i++) {
				if(newLine.Intersects(lines[i]) && !newLine.SharesEndpointWith(lines[i])) {
					console.log("line " + newLine + " intersects with line " + lines[i]);
					intersection = true;
				}
			}
			
			if(!intersection) {
				console.log("new line");
				lines.push(newLine);
				for(var i = 0; i < points.length; i++) {
					if(formsHollowPolygon(lines, newLine.p1, newLine.p2, points[i])) {
						console.log(voidPointsRemaining.length);
						console.log("new poly");
						var newPoly = new Polygon(newLine.p1, newLine.p2, points[i])
						polygons.push(newPoly);
						if(lineConnecting(newLine.p1, newLine.p2, lines) != null) {
							lineConnecting(newLine.p1, newLine.p2, lines).borderingPolys++;
							console.log("line border polys increased to " + lineConnecting(newLine.p1, newLine.p2, lines).borderingPolys);
						}
						if(lineConnecting(newLine.p1, points[i], lines) != null) {
							lineConnecting(newLine.p1, points[i], lines).borderingPolys++;
							console.log("line border polys increased to " + lineConnecting(newLine.p1, points[i], lines).borderingPolys);
						}
						if(lineConnecting(newLine.p2, points[i], lines) != null) {
							lineConnecting(newLine.p2, points[i], lines).borderingPolys++;
							console.log("line border polys increased to " + lineConnecting(newLine.p2, points[i], lines).borderingPolys);
						}
					}
				}
			}
		}
	}
}


function spreadPointArray(pointArray, iterations) {
	for(var i = 0; i < iterations; i++) {
		for(var j = 0; j < pointArray.length; j++) {
			var currentPoint = pointArray[j];
			var closestPoint = getClosestPoint(currentPoint, pointArray);
			var deltaX = currentPoint.x - closestPoint.x;
			var deltaY = currentPoint.y - closestPoint.y;
		
			deltaX /= distanceBetween(currentPoint, closestPoint);
			deltaY /= distanceBetween(currentPoint, closestPoint);
		
			currentPoint.x += deltaX;
			currentPoint.y += deltaY;
			if(currentPoint.x < 0) {
				currentPoint.x = 0;
			}
			if(currentPoint.x > screenWidth) {
				currentPoint.x = screenWidth;
			}
			if(currentPoint.y < 0) {
				currentPoint.y = 0;
			}
			if(currentPoint.y > screenHeight) {
				currentPoint.y = screenHeight;
			}
		}
	}
}

function getClosestPoint(point, pointArray) {
	var minDistance = 100000;
	var closestPoint;
	for(var i = 0; i < pointArray.length; i++) {
		var distance = distanceBetween(point, pointArray[i])
		if(point != pointArray[i] && distance < minDistance) {
			minDistance = distance;
			closestPoint = pointArray[i];
		}
	}
	return closestPoint;
}

function distanceFromWall(point) {
	var minDistance = 100000;
	if(point.x < screenWidth / 2) {
		if(point.x < minDistance) {
			minDistance = point.x;
		}
	} else {
		if(screenWidth - point.x < minDistance) {
			minDistance = screenWidth - point.x;
		}
	}
	if(point.y < screenHeight / 2) {
		if(point.y < minDistance) {
			minDistance = point.y;
		}
	} else {
		if(screenHeight - point.y < minDistance) {
			minDistance = screenHeight - point.y;
		}
	}
	return minDistance;
}

function distanceBetween(point1, point2) {
	return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}

function triArea(point1, point2, point3) {
	return Math.abs(point1.x * (point2.y - point3.y) + point2.x * (point3.y - point1.y) + point3.x * (point1.y - point2.y))/2;
}

function isAcute(point1, point2, point3) {
	var distance1 = distanceBetween(point1, point2);
	var distance2 = distanceBetween(point2, point3);
	var distance3 = distanceBetween(point1, point3);
	var max = Math.max(distance1, distance2, distance3);
	
	return(max * max < (distance1 * distance1 + distance2 * distance2 + distance3 * distance3 - max * max));
}

function orientation(p1, p2, p3) {
	var tempValue = (p2.y - p1.y) * (p3.x - p2.x) - (p2.x - p1.x) *(p3.y - p2.y);
	if(tempValue == 0) {
		return 0;
	}
	if(tempValue > 0) {
		return 1; //clockwise
	} else {
		return -1; //counterclockwise
	}
}

function onSegment(p1, p2, p3) {
	if(p2.x <= Math.max(p1.x, p3.x) && p2.x >= Math.max(p1.x, p3.x) && p2.y <= Math.max(p1.y, p3.y) && p2.y >= Math.max(p1.y, p3.y)) {
		return true;
	}
	
	return false;
}
function clearIntersections(lineArray) {
	for(var i = 0; i < lineArray.length - 1; i++) {
		for(var j = i + 1; j < lineArray.length; j++) {
			if(lineArray[i].Intersects(lineArray[j]) &&  !lineArray[i].SharesEndpointWith(lineArray[j])) {
			
				lineArray.splice(j, 1);
				j--;
			}
		}
	}
}

function cleanUpEdges(pointArray, lineArray) {
	
	for(var i = 0; i < pointArray.length - 1; i++) {
		for(var j = i + 1; j < pointArray.length; j++) {
			if(areOnSameEdge(pointArray[i],pointArray[j]) && lineConnecting(pointArray[i], pointArray[j], lineArray) != null) {
				lineArray.splice(lineArray.indexOf(lineConnecting(pointArray[i], pointArray[j], lineArray)), 1);
			}
		}
	}
	var leftPoints = [];
	var topPoints = [];
	var rightPoints = [];
	var botPoints = [];
	for(var i = 0; i < pointArray.length; i++) {
		var point = pointArray[i];
		if(point.x == 0) leftPoints.push(point);
		if(point.y == 0) topPoints.push(point);
		if(point.x == screenWidth) rightPoints.push(point);
		if(point.y == screenHeight) botPoints.push(point);
	}
	
	leftPoints.sort(function(p1, p2) {
		return p1.x + p1.y - p2.x - p2.y;
	});
	topPoints.sort(function(p1, p2) {
		return p1.x + p1.y - p2.x - p2.y;
	});
	rightPoints.sort(function(p1, p2) {
		return p1.x + p1.y - p2.x - p2.y;
	});
	botPoints.sort(function(p1, p2) {
		return p1.x + p1.y - p2.x - p2.y;
	});
	
	for(var i = 0; i < leftPoints.length - 1; i++) {
		lineArray.push(new Line(leftPoints[i], leftPoints[i + 1]));
	}
	for(var i = 0; i < topPoints.length - 1; i++) {
		lineArray.push(new Line(topPoints[i], topPoints[i + 1]));
	}
	for(var i = 0; i < rightPoints.length - 1; i++) {
		lineArray.push(new Line(rightPoints[i], rightPoints[i + 1]));
	}
	for(var i = 0; i < botPoints.length - 1; i++) {
		lineArray.push(new Line(botPoints[i], botPoints[i + 1]));
	}
	/*
	for(var i = 0; i < pointArray.length - 1; i++) {
		for(var j = i + 1; j < pointArray.length; j++) {
			if(areOnSameEdge(pointArray[i],pointArray[j]) && lineConnecting(pointArray[i], pointArray[j], lineArray) == null) {
				lineArray.push(new Line(pointArray[i], pointArray[j]));
			}
		}
	}*/
}

function isOnEdge(point) {
	if(point.x == 0) return 1;
	if(point.y == 0) return 2;
	if(point.x == screenWidth) return 3;
	if(point.y == screenHeight) return 4;
	return 0;
}

function areOnSameEdge(point1, point2) {
	if(point1.x == 0 && point2.x == 0) return true;
	if(point1.y == 0 && point2.y == 0) return true;
	if(point1.x == screenWidth && point2.x == screenWidth) return true;
	if(point1.y == screenHeight && point2.y == screenHeight) return true;
	return false;
}
function isOnTriangle(line, triangle) {
	var point1 = triangle.p1;
	var point2 = triangle.p2;
	var point3 = triangle.p3;
	
	if(line.p1 == point1 && line.p2 == point2 || line.p2 == point1 && line.p1 == point2) {
		
		return true;
	}
	if(line.p1 == point2 && line.p2 == point3 || line.p2 == point2 && line.p1 == point3) {
		
		return true;
	}
	if(line.p1 == point1 && line.p2 == point3 || line.p2 == point1 && line.p1 == point3) {
		
		return true;
	}
	
	return false;
}

function isEdgeLine(line) {
	return((line.p1.x == 0 && line.p2.x == 0) || (line.p1.x == screenWidth && line.p2.x == screenWidth) || (line.p1.y == 0 && line.p2.y == 0) || (line.p1.y == screenHeight && line.p2.y == screenHeight));
}

function lineConnecting(point1, point2, lineArray) {
	
	for(var i = 0; i < lineArray.length; i++) {
		var line = lineArray[i];
		if(line.p1 == point1 && line.p2 == point2 || line.p2 == point1 && line.p1 == point2) {
			return line;
		}
		
	}
	return null;
}

function formsHollowPolygon(lineArray, ...args) {
	//args; //array holding all the points being checked
	var connectionsPerPoint = {};
	var numConnections = 0;
	var numPoints = args.length;
	for(var i = 0; i < numPoints; i++) {
		connectionsPerPoint[args[i]] = 0;
	}
	//record all connections
	for(var i = 0; i < numPoints - 1; i++) {
		for(var j = i + 1; j < numPoints; j++) {
			if(lineConnecting(args[i], args[j], lineArray)) {
				connectionsPerPoint[args[i]] += 1;
				connectionsPerPoint[args[j]] += 1;
				numConnections++;
			}
		}
	}
	
	var validConnectionNumbers = true;
	for(var i = 0; i < numPoints; i++) {
		if(connectionsPerPoint[args[i]] != 2) {
			validConnectionNumbers = false;
		}
	}
	
	//polygon with no additional lines in the center
	if(numConnections == numPoints && validConnectionNumbers) {
		return true;
	}
	return false;
	
}

function findVoidPoints(pointArray, lineArray) {
	var voidPoints = [];
	for(var i = 0; i < lineArray.length; i++) {
		var line = lineArray[i];
		if(isEdgeLine(line)) {
			if(line.borderingPolys < 1) {
				if(!voidPoints.includes(line.p1)) {
					voidPoints.push(line.p1);
				}
				if(!voidPoints.includes(line.p2)) {
					voidPoints.push(line.p2);
				}
			}
		} else {
			if(line.borderingPolys < 2) {
				if(!voidPoints.includes(line.p1)) {
					voidPoints.push(line.p1);
				}
				if(!voidPoints.includes(line.p2)) {
					voidPoints.push(line.p2);
				}
			}
		}
	}
	return voidPoints;
}