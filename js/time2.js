var fromIndex = 0;
var toIndex = 1000;
var fileName = "1K";
var d3FromIndexRange = d3.select("#fromIndex");
var d3ToIndexRange = d3.selectAll("#toIndex");
var d3FromIndexInput = d3.selectAll("#txtFrom");
var d3ToIndexInput = d3.selectAll("#txtTo");
var d3FileName = d3.selectAll(".fileName");

var maxRange = 1000;
d3FromIndexRange.on("input", function () {
	fromIndex = parseInt(this.value);
	DrawChartWithIndex(fromIndex, toIndex, fileName);
});
d3FromIndexInput.on("input", function () {
	fromIndex = parseInt(this.value);
	DrawChartWithIndex(fromIndex, toIndex, fileName);
});
d3ToIndexInput.on("input", function () {
	toIndex = parseInt(this.value);
	DrawChartWithIndex(fromIndex, toIndex, fileName);
});

d3FileName.on("input", function () {
	fileName = this.value;

	if (fileName === "1K") {
		d3FromIndexRange.attr("max", 1000);
		d3ToIndexRange.attr("max", 1000);
		toIndex = toIndex > 1000 ? 1000 : toIndex;
		maxRange = 1000;
	}
	if (fileName === "10K") {
		d3FromIndexRange.attr("max", 10000);
		d3ToIndexRange.attr("max", 10000);
		maxRange = 10000;
	}
	if (fileName === "100K") {
		d3FromIndexRange.attr("max", 100000);
		d3ToIndexRange.attr("max", 100000);
		maxRange = 100000;
	}

	DrawChartWithIndex(fromIndex, toIndex, fileName);
});
d3ToIndexRange.on("input", function () {
	toIndex = parseInt(this.value);
	DrawChartWithIndex(fromIndex, toIndex, fileName);
});
window.onload = function () {
	DrawChartWithIndex(fromIndex, toIndex, fileName);
};
function DrawChartWithIndex(fromIndex, toIndex, fileName) {
	d3FromIndexInput.property("value", fromIndex);
	d3ToIndexInput.property("value", toIndex);

	if (fromIndex >= toIndex) {
		fromIndex = 0;
		toIndex = maxRange;
	}
	d3.text("./" + fileName + ".txt").then(function (text) {
		var dataIndex = d3.csvParseRows(text).map(function (row) {
			var d = row[0].split("	");
			return {
				x: d[0],
				y: d[1]
			};
		});
		d3.text("./data" + fileName + ".txt").then(function (text) {
			var dataMi = d3.csvParseRows(text).map(function (row) {
				var d = row[0].split(" ");
				return {
					sX: d[0],
					eX: d[1],
					a: d[2],
					sY: d[3],
					eY: d[4],
					b: d[5],
					mi: d[6]
				};
			});

			AppendGraph(dataIndex, dataMi, fromIndex, toIndex);
		});
	});
}



function AppendGraph(data, dataMi, fromIndex, toIndex) {
	d3.select("svg").remove();
	// 2. Use the margin convention practice
	var margin = { top: 50, right: 50, bottom: 50, left: 50 }
		, width = window.innerWidth - margin.left - margin.right // Use the window's width
		, height = window.innerHeight - margin.top - margin.bottom; // Use the window's height
	// The number of datapoints
	var len = toIndex - fromIndex;
	var maxX = Math.max(...data.map(d => d.x));
	// 5. X scale will use the index of our data

	function xScale(number) {
		//if (number < fromIndex)
		//	return 0;
		//if (number > toIndex)
		//	return width;
		return d3ScaleX(number);
	}

	var d3ScaleX = d3.scaleLinear()
		.domain([fromIndex, toIndex]) // input
		.range([0, width]); // output

	// 6. Y scale will use the randomly generate number
	var yScale = d3.scaleLinear()
		.domain([0, maxX]) // input
		.range([height, 0]); // output

	// 7. d3's line generator
	var lineX = d3.line()
		.x(function (d, i) { return xScale(i); }) // set the x values for the line generator
		.y(function (d) { return yScale(d.x); }) // set the y values for the line generator
		.curve(d3.curveMonotoneX); // apply smoothing to the line

	var lineY = d3.line()
		.x(function (d, i) { return xScale(i); }) // set the x values for the line generator
		.y(function (d) { return yScale(d.y); }) // set the y values for the line generator
		.curve(d3.curveMonotoneX);

	var svg = d3.select("body").append("svg")
		.attr("width", window.innerWidth)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		;

	// 3. Call the x axis in a group tag
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(d3ScaleX))
		; // Create an axis component with d3.axisBottom

	// 4. Call the y axis in a group tag
	svg.append("g")
		.attr("class", "y axis")
		.call(d3.axisLeft(yScale))
		; // Create an axis component with d3.axisLeft
	svg.append("path")
		.datum(data) // 10. Binds data to the line
		.attr("class", "line") // Assign a class for styling
		.attr("d", lineX) // 11. Calls the line generator	
		.attr("stroke", "lightblue");
	svg.append("path")
		.datum(data) // 10. Binds data to the line
		.attr("class", "line") // Assign a class for styling
		.attr("d", lineY) // 11. Calls the line generator
		.attr("stroke", "pink"); // 11. Calls the line generator


	svg.selectAll(".window")
		.data(dataMi)
		.enter()
		.append("polygon")
		.attr("class", "window")
		.attr("class",
			function (d, i) {
				return 'p' + i;
			})
		//append dX
		.attr("points",
			function (d, i) {
				return formatPolygon(d);
			})
		.attr("style", "fill:dimgray;stroke-width:1")
		.attr("opacity", "0.5")
		.on("mouseover",
			function (d, i) {
				return handleMouseOver(d, i);
			})
		.on("mouseout", handleMouseOut);

	function formatPolygon(d) {
		var valueSX = data[d.sX].x;
		var valueEX = data[d.eX].x;
		var valueSY = data[d.sY].y;
		var valueEY = data[d.eY].y;

		var txtSX = xScale(d.sX) + "," + yScale(valueSX);
		var txtEX = xScale(d.eX) + "," + yScale(valueEX);
		var txtEY = xScale(d.eY) + "," + yScale(valueEY);
		var txtSY = xScale(d.sY) + "," + yScale(valueSY);

		if (valueEX > valueSX && valueSY > valueEY)
			return txtSX + " " + txtEX + " " + txtSY
				+ " " + txtEY + " ";

		return txtSX + " " + txtEX + " " + txtEY
			+ " " + txtSY + " ";
	}
	function formatPolygon2(d) {
		var lenWindow = d.eX - d.sX;
		var strX = "";
		var strY = "";
		for (var lx = 0; lx < lenWindow; lx++) {
			var indexX = parseInt(d.sX) + lx;
			var valueIndexX = data[indexX].x;
			strX += xScale(indexX) + "," + yScale(valueIndexX) + " ";
		}
		for (var ly = lenWindow; ly > 0; ly--) {
			var indexY = parseInt(d.sY) + ly;
			console.log(indexY);
			var valueIndexY = data[indexY].y;
			strY += xScale(indexY) + "," + yScale(valueIndexY) + " ";
		}
		console.log(strX);
		console.log(strY);
		return strX + " " + strY;
	}
	//// 12. Appends a circle for each datapoint
	appendDot();
	function appendDot() {
		var dot = svg.selectAll(".dot")
			.data(dataMi)
			.enter();
		dot.append("circle") // Uses the enter().append() method
			.attr("class", "dot") // Assign a class for styling
			.attr("cx", function (d, i) { return xScale(d.sX) })
			.attr("cy", function (d) { return yScale(data[d.sX].x) })
			.attr("r", 1)
			.attr("fill", "black");

		dot.append("circle") // Uses the enter().append() method
			.attr("class", "dot") // Assign a class for styling
			.attr("cx", function (d, i) { return xScale(d.sY) })
			.attr("cy", function (d) { return yScale(data[d.sY].y) })
			.attr("r", 1)
			.attr("fill", "black");
		dot.append("circle") // Uses the enter().append() method
			.attr("class", "dot") // Assign a class for styling
			.attr("cx", function (d, i) { return xScale(d.eX) })
			.attr("cy", function (d) { return yScale(data[d.eX].x) })
			.attr("r", 1)
			.attr("fill", "black");
		dot.append("circle") // Uses the enter().append() method
			.attr("class", "dot") // Assign a class for styling
			.attr("cx", function (d, i) { return xScale(d.eY) })
			.attr("cy", function (d) { return yScale(data[d.eY].y) })
			.attr("r", 1)
			.attr("fill", "black");
	}


	//handel event

	function handleMouseOver(d, i) {
		var valueSX = data[d.sX].x;
		var valueEX = data[d.eX].x;
		var valueSY = data[d.sY].y;
		var valueEY = data[d.eY].y;
		// Specify where to put label of text
		svg.append("text").attr("class", "miText").attr("x", function (dt) {
			console.log(xScale(d.sX), i);
			return xScale(d.sX);
		})
			.attr("y", function (dt) {
				console.log(yScale(valueSX));
				return yScale(valueSX) + 10;
			})
			.text(function (dt) { return "(" + d.mi + ")"; })
			.attr("font-style", "bold")
			.attr("font-size", "20px")
			.attr("fill", "black");

	}

	function handleMouseOut(d, i) {
		d3.select(this).attr({
			style: "fill:lime;stroke:purple;stroke-width:1"
		});
		svg.selectAll(".miText").remove();
	}
}

