import * as d3 from "d3";

// axis
// .ticks(2)
// .render()
// Sample dataset. In a real application, you will probably get this data from another source such as AJAX.
var dataset = [5, 10, 15, 20, 25];

var padding = 10;
var margin = { top: 20, right: 0, bottom: 30, left: 0 };
var height = 500;
var width = 820;
var time = d3
  .scaleLinear()
  .domain([0, 100])
  .range([padding, width - padding]);



  var zoom = d3.zoom()
  .scaleExtent([1, 32])
  .extent([[margin.left, 0], [width - margin.right, height]])
  .translateExtent([[margin.left, -Infinity], [width - margin.right, Infinity]])
  .on("zoom", zoomed);

  function zoomed(event) {
    
     let xz = event.transform.rescaleX(time);
     console.log(xz)
    // path.attr("d", area(data, xz));
    // gx.call(xAxis, xz);
  }

var axisX1 = d3.axisBottom(time).ticks(10, ",f");
var xAxis = (g, x) => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 50).tickSizeOuter(0))
var svg = d3
  .select("#mychart") // I'm starting off by selecting the container.
  .append("svg") // Appending an SVG element to that container.
  .attr("viewBox", [0, 0, width, height])
  .attr("width", width - margin.left - margin.right) // Setting the width of the SVG.
  .attr("height", height - margin.top - margin.bottom) // And setting the height of the SVG.
  .attr("background", "red")
  .call(zoom);

var g = svg.append("g").attr("transform", "translate(0,0) scale(1)").call(xAxis, time );
//   .call(zoom);
// .call(g => g.select(".domain")
// .remove())
console.log(svg);

// The next step is to create the rectangles that will make up the bars in our bar chart.
// svg
//   .selectAll("rect") // I'm selecting all of the rectangles in the SVG (note that at this point, there actually aren't any, but we'll be creating them in a couple of steps).
//   .data(dataset) // Then I'm mapping the dataset to those rectangles.
//   .enter() // This step is important in that it allows us to dynamically create the rectangle elements that we selected previously.
//   .append("rect") // For each element in the dataset, append a new rectangle.
//   .attr("x", function (value, index) {
//     // Set the X position of the rectangle by taking the index of the current item we are creating, multiplying it by the calculated width of each bar, and adding a padding value so we can see some space between bars.
//     return index * (chartWidth / dataset.length) + padding;
//   })
//   .attr("y", function (value, index) {
//     // Set the rectangle by subtracting the scaled height from the height of the chart (this has to be done becuase SVG coordinates start with 0,0 at their top left corner).
//     return chartHeight - value * heightScalingFactor;
//   })
//   .attr("width", chartWidth / dataset.length - padding) // The width is dynamically calculated to have an even distribution of bars that take up the entire width of the chart.
//   .attr("height", function (value, index) {
//     // The height is simply the value of the item in the dataset multiplied by the height scaling factor.
//     return value * heightScalingFactor;
//   })
//   .attr("fill", "pink") // Sets the color of the bars.
//   .attr("data-id", "chi test")
//   .on("click", function (d, i) {
//     console.log(d);
//     console.log(i);
//   });
/**
 *  Gets the maximum value in a collection of numbers.
 */
// function getMax(collection) {
//   var max = 0;

//   collection.forEach(function (element) {
//     max = element > max ? element : max;
//   });

//   return max;
// }

// function spanOver(d, i) {
//   var span = d3.select(this);
//   span.classed("spanOver", true);
// }

// function spanOut(d, i) {
//   var span = d3.select(this);
//   span.classed("spanOver", false);
// }

// var div = d3.select('#divID');

// svg.selectAll('span')
