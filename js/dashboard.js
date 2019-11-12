d3.dsv(" ", "./data10K.txt").then(function (data) {
	AppendGraph(data,10000);
});

function AppendGraph(data,len) {
	var dX = 50;
	var dY = 100;
	var width = 1800;
	var maxX = Math.max(...data.map(d => d.eX));
	var maxY = Math.max(...data.map(d => d.eY));
		
	var numberScale = maxX > maxY ? maxX : maxY;
	var middleNumber = len/3;
	var lengthArray = len;
	console.log(numberScale);
	var index = 0;

	function x(number) {
		return number / numberScale * width ;
	}

	function xx(number, min) {
		return x((middleNumber + number - min));
	}
	function indexWindow(i) {
		index = index + 1;
		return index;
	}

	function formatPolygon(d, dX, dY) {
		return x(d.sX) + "," + dX + " " + x(d.eX) + "," + dX + " " + x(d.eY) + "," + dY + " " + x(d.sY) + "," + dY + " ";
	}
	function formatPolygonScale(d, dX, dY) {
		debugger;
		var fX=100;
		var fY=-10;
		return `${x(parseInt(d.sX) + fX)},${parseInt(dX)+fY} ${x(parseInt(d.eX)+fX)},${parseInt(dX)+fY} ${x(parseInt(d.eY)+fX)},${dY-fY} ${x(parseInt(d.sY)+fX)},${parseInt(dY)-fY}`;
	}
	function formatPolygonScale2(d, min) {
		var fD = 15;
		var fX = 200;
		var fY = 400;
		return `${xx(parseInt(d.sX) - fD, min)},${fX} ${xx(parseInt(d.eX) + fD, min)},${fX} ${xx(parseInt(d.eY) + fD, min)},${fY} ${xx(parseInt(d.sY) - fD, min)},${fY}`;
	}

	var vis = d3.select("#graph")
		.append("svg")
		.attr("width", "100%")
		.attr("height", "100%");

	vis.append("svg:line")
		//append dX
		.attr("class", "nodes")
		.attr("x1", function (d) { return 0; })
		.attr("x2", function (d) { return x(lengthArray); })
		.attr("y1", function (d) { return dX; })
		.attr("y2", function (d) { return dX; })
		.attr("style", "stroke:black;stroke-width:0.25");

	vis.append("svg:line")
		//append dX
		.attr("class", "nodes")
		.attr("x1", function (d) { return 0; })
		.attr("x2", function (d) { return x(lengthArray); })
		.attr("y1", function (d) { return dY; })
		.attr("y2", function (d) { return dY; })
		.attr("style", "stroke:black;stroke-width:0.25");

	vis.selectAll(".window")
		.data(data)
		.enter()
		.append("svg:polygon")
		.attr("class", "window")
		.attr("class",
			function(d, i) {
				return 'p' + i;
			})
		//append dX
		.attr("points",
			function(d) {
				return formatPolygon(d, dX, dY);
			})
		//.attr("x2", function (d) { return x(d.eX); })
		//.attr("y1", function (d) { return dX; })
		//.attr("y2", function (d) { return dX; })
		.attr("style", "fill:red;stroke:red;stroke-width:0.01;stroke-width:0")
		//.on("click", handleMouseOver)
		.on("mouseover", handleOnClick);
		//.on("mouseout", handleMouseOut);
	//append dY
	//vis.selectAll(".lines")
	//		.data(data)
	//		.enter()
	//		.append("svg:line")
	//		//append dX
	//		.attr("class", "nodes")
	//		.attr("x1", function(d) { return x(d.sY); })
	//		.attr("x2", function(d) { return x(d.eY); })
	//		.attr("y1", function(d) { return dY; })
	//		.attr("y2", function(d) { return dY; })
	//	.attr("style", "stroke:rgb(255,0,0);stroke-width:1");

	//vis.selectAll(".lines")
	//		.data(data)
	//		.enter()
	//		.append("svg:line")
	//		//append dX
	//		.attr("class", "nodes")
	//		.attr("x1", function(d) { return x(d.sX); })
	//		.attr("x2", function(d) { return x(d.eX); })
	//		.attr("y1", function(d) { return dX; })
	//		.attr("y2", function(d) { return dX; })
	//	.attr("style", "stroke:rgb(255,0,0);stroke-width:1");
	//append text

	//vis.selectAll("polygon").data(data).enter().append("text")
	//	.on("mouseover", function (d, i) {
	//		debugger;
	//		alert("yo");
	//		//d3.select(this)
	//		//	.append("text")
	//		//	.attr("x", function (d) { return x(d.sX); })
	//		//	.attr("y", function (d) { return dX - 10; })
	//		//	.text(function (d) { return x(d.sX) + "," + x(d.eX); })
	//		//	.attr("font-size", "10px");
	//	})
	//	.on("mouseout", function(d, i) {

	//	});
	//var textLabels = node.attr("x", function(d) { return x(d.sX); })
	//	.attr("y", function(d) { return dX-10; })
	//	.text(function (d) { return x(d.sX)  + "," +x(d.eX); })
	//	.attr("font-size", "10px");
	function handleMouseOver(d, i) {
		
		for (var j = 0; j < 2; j++) {
			var t = "polygon.p" + (i + j);
			console.log(t);
			var chart = d3.selectAll(t);
			chart.transition()
				.duration(1000)
				.style("fill","blue")
				.attr("points",
					function (d) {
						return formatPolygonScale(d, dX, dY);
					});
		}

		//var zoom = d3.classed(otherId).enter()
		//	.attr("style", "fill:blue;stroke:red;stroke-width:0.01;stroke-width:2");
		//console.log(zoom);

		// Specify where to put label of text
		vis.append("text").attr("x", function (dt) { return x(d.sX); })
			.attr("y", function (dt) { return dX - 10; })
			.text(function (dt) { return "(" +d.sX + "," + d.eX + ")-(" +d.sY + "," +d.eY + ") : " + d.mi; })
			.attr("font-size", "10px");
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
			debugger 
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
			.text(function (dt) { return "(" +d.sX + "," + d.eX + ")-(" +d.sY + "," +d.eY + ") : " + d.mi; })
			.attr("font-size", "10px");
	}
	function handleMouseOut(d, i) {
		for (var j = 0; j < 2; j++) {
			var t = "polygon.p" + (i + j);
			console.log(t);
			var chart = d3.selectAll(t);
			chart.transition()
				.duration(1000)
				.style("fill", "red")
				.attr("points",
					function (d) {
						return formatPolygon(d, dX, dY);
					});

		}

		d3.select(this).attr({
			style: "fill:lime;stroke:purple;stroke-width:1"
		});
		vis.selectAll("text").remove();
		// Specify where to put label of text
	}
	function revert() {
			var t = "polygon";
			console.log(t);
			var chart = d3.selectAll(t);
			chart.transition()
				.duration(100)
				.style("fill", "red")
				.attr("points",
					function (d) {
						return formatPolygon(d, dX, dY);
					});
		chart.on("mouseover", handleOnClick);
		vis.selectAll("text").remove();
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
