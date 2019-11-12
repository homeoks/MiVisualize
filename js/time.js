var fromIndex = 0;
var toIndex = 1000;

d3.select("#fromIndex").on("input", function () {
	fromIndex = parseInt(this.value);
	DrawChartWithIndex(fromIndex, toIndex);
});
d3.select("#toIndex").on("input", function () {
	toIndex = parseInt(this.value);
	DrawChartWithIndex(fromIndex, toIndex);
});
window.onload = function () {
	DrawChartWithIndex(fromIndex, toIndex);
};
function DrawChartWithIndex(fromIndex, toIndex) {
	d3.select('.textFrom').text(fromIndex); 
	d3.select('.textTo').text(toIndex); 

	if (fromIndex >= toIndex) {
		fromIndex = 0;
		toIndex = 1000;
	}
	d3.dsv(" ", "./1K.txt").then(function (dataIndex) {
		d3.dsv(" ", "./data1K.txt").then(function (dataMi) {
			AppendGraph(dataIndex, dataMi,fromIndex,toIndex);
		});
	});
}



function AppendGraph(data, dataMi, fromIndex, toIndex) {
	d3.select("svg").remove();
	// 2. Use the margin convention practice
	var margin = { top: 50, right: 50, bottom: 50, left: 50 }
		, width = window.innerWidth - margin.left - margin.right // Use the window's width
		, height = window.innerHeight - margin.top - margin.bottom; // Use the window's height
	console.log(data);
	// The number of datapoints
	var len = toIndex - fromIndex;
	var maxX = Math.max(...data.map(d => d.x));
	// 5. X scale will use the index of our data
	var xScale = d3.scaleLinear()
		.domain([fromIndex, toIndex]) // input
		.range([0, width]); // output

	// 6. Y scale will use the randomly generate number
	var yScale = d3.scaleLinear()
		.domain([0, maxX]) // input
		.range([height, 0]); // output

	var y2Scale = d3.scaleLinear()
		.domain([0, 1]) // input
		.range([height, 0]); // output

	// 7. d3's line generator
	var lineX = d3.line()
		.x(function (d, i) { return xScale(i); }) // set the x values for the line generator
		.y(function (d) { return yScale(d.x); }) // set the y values for the line generator
		.curve(d3.curveMonotoneX) // apply smoothing to the line

	//var lineMi = d3.line()
	//	.x(function (d, i) { return xScale(d.sX); }) // set the x values for the line generator
	//	.y(function (d) { return y2Scale(d.mi); }) // set the y values for the line generator
	//	.curve(d3.curveMonotoneX) // apply smoothing to the line

	var lineY = d3.line()
		.x(function (d, i) { return xScale(i); }) // set the x values for the line generator
		.y(function (d) { return yScale(d.y); }) // set the y values for the line generator
		.curve(d3.curveMonotoneX) // apply smoothing to the line

	// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
	
	// 1. Add the SVG to the page and employ #2
	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// 3. Call the x axis in a group tag
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

	// 4. Call the y axis in a group tag
	svg.append("g")
		.attr("class", "y axis")
		.call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

	// 4. Call the y axis in a group tag
	//svg.append("g")
	//	.attr("class", "y2 axis")
	//	.attr("transform", "translate("+width+",0)")
	//	.call(d3.axisRight(y2Scale)); // Create an axis component with d3.axisLeft

	// 9. Append the path, bind the data, and call the line generator
	svg.append("path")
		.datum(data) // 10. Binds data to the line
		.attr("class", "line") // Assign a class for styling
		.attr("d", lineX) // 11. Calls the line generator	
		.attr("stroke", "lightblue");
	//svg.append("path")
	//	.datum(data) // 10. Binds data to the line
	//	.attr("class", "line") // Assign a class for styling
	//	.attr("d", lineMi) // 11. Calls the line generator	
	//	.attr("stroke", "violet"); 
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
			function(d, i) {
				return 'p' + i;
			})
		//append dX
		.attr("points",
			function(d, i) {
				return formatPolygon(d);
			})
		//.attr("x2", function (d) { return x(d.eX); })
		//.attr("y1", function (d) { return dX; })
		//.attr("y2", function (d) { return dX; })
		.attr("style", "fill:dimgray;stroke-width:1")
		.attr("opacity", "0.5")
		.on("mouseover",
			function (d, i) {
				return handleMouseOver(d,i);
			})
		.on("mouseout", handleMouseOut);

	function formatPolygon(d) {
		var valueSX = data[d.sX].x;
		var valueEX = data[d.eX].x;
		var valueSY = data[d.sY].y;
		var valueEY = data[d.eY].y;
		console.log(d.sX);
		console.log(valueSX);
		console.log(d.eX);

		console.log(valueEX);
		console.log(d.sY);

		console.log(valueSY);
		console.log(d.eY);

		console.log(valueEY);

		return xScale(d.sX) + "," + yScale(valueSX) + " " + xScale(d.eX)
			+ "," + yScale(valueEX) + " " + xScale(d.eY) + "," + yScale(valueEY) 
			+ " " + xScale(d.sY) + "," + yScale(valueSY) + " ";

		//return yScale(valueSX) + "," + xScale(d.sX) + " " + yScale(valueEX)
		//	+ "," + xScale(d.eX) + " " + yScale(valueEY) + "," + xScale(d.eY)
		//	+ " " + yScale(valueSY) + "," + xScale(d.sY) + " ";
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
			.attr("cx", function (d, i) { return xScale(d.eX)})
			.attr("cy", function (d) { return yScale(data[d.eX].x)})
			.attr("r",1)
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

		//for (var j = 0; j < 2; j++) {
		//	var t = "polygon.p" + (i + j);
		//	console.log(t);
		//	var chart = d3.selectAll(t);
		//	chart.transition()
		//		.duration(1000)
		//		.style("fill", "blue")
		//		.attr("points",
		//			function (d) {
		//				return formatPolygonScale(d, dX, dY);
		//			});
		//}

		//var zoom = d3.classed(otherId).enter()
		//	.attr("style", "fill:blue;stroke:red;stroke-width:0.01;stroke-width:2");
		//console.log(zoom);
		var valueSX = data[d.sX].x;
		var valueEX = data[d.eX].x;
		var valueSY = data[d.sY].y;
		var valueEY = data[d.eY].y;
		// Specify where to put label of text
		svg.append("text").attr("class","miText").attr("x", function(dt) {
				console.log(xScale(d.sX), i);
				return xScale(d.sX);
			})
			.attr("y", function(dt) {
				console.log(yScale(valueSX));
				return yScale(valueSX)+10;
			})
			.text(function (dt) { return "(" + d.mi+")";})
			.attr("font-style", "bold")
			.attr("font-size", "20px")
			.attr("fill", "black");
		
	}
	function handleOnClick(d, i) {
		revert();

		var min = len;
		for (var jMin = -10; jMin < 10; jMin++) {
			var tMin = "polygon.p" + (i + jMin);
			var c = d3.select(tMin).data();
			if (typeof c[0] !== 'undefined') {
				var temp = parseInt(c[0].sX);
				if (temp < min)
					min = temp;
			}
		}
		for (var j = -10; j < 10; j++) {
			var t = "polygon.p" + (i + j);
			console.log(t);
			var chart = d3.selectAll(t);
			chart.transition()
				.duration(1000)
				.style("fill", "blue")
				.attr("points",
					function (d) {
						//return formatPolygonScale(d, dX,dY);
						return formatPolygonScale2(d, min);
					})
				;

			chart.on("mouseover", null);
		}

		//var zoom = d3.classed(otherId).enter()
		//	.attr("style", "fill:blue;stroke:red;stroke-width:0.01;stroke-width:2");
		//console.log(zoom);

		// Specify where to put label of text
		vis.append("text").attr("x", function (dt) { return x(d.sX); })
			.attr("y", function (dt) { return dX - 10; })
			.text(function (dt) { return "Helllo" })
			.attr("font-size", "10px");
	}
	function handleMouseOut(d, i) {
		//for (var j = 0; j < 2; j++) {
		//	var t = "polygon.p" + (i + j);
		//	console.log(t);
		//	var chart = d3.selectAll(t);
		//	chart.transition()
		//		.duration(1000)
		//		.style("fill", "red")
		//		.attr("points",
		//			function (d) {
		//				return formatPolygon(d, dX, dY);
		//			});

		//}

		d3.select(this).attr({
			style: "fill:lime;stroke:purple;stroke-width:1"
		});
		svg.selectAll(".miText").remove();
		// Specify where to put label of text
	}
}













































//d3.dsv(" ", "./data.txt").then(function (data) {
//	var width = 420,
//	barHeight = 20;

//var x = d3.scaleLinear()
//	.range([0, width]);

//var chart = d3.select(".chart")
//	.attr("width", width);

//function abc(data) {
//	x.domain([0, d3.max(data, function (d) { return x(d.sX); })]);

//	chart.attr("height", barHeight * data.length);

//	var bar = chart.selectAll("g")
//		.data(data)
//		.enter().append("g")
//		.attr("transform", function (d, i) { return "translate(0," + i * barHeight + ")"; });

//	bar.append("rect")
//		.attr("width", function (d) { return x(x(d.sX)); })
//		.attr("height", barHeight - 1);

//	bar.append("text")
//		.attr("x", function (d) { return x(x(d.sX)) - 3; })
//		.attr("y", barHeight / 2)
//		.attr("dy", ".35em")
//		.text(function (d) { return x(d.sY) + "-" + x(d.sX); });
//}

//function type(d) {
//	d.value = +d.value; // coerce to number
//	return d;
//}

//abc(data);
//});
