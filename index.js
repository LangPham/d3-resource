import * as d3 from "d3";
import Swal from "sweetalert2";
import moment from "moment";

// Dataset
var dataset = [
  // { start: new Date, end: Date.now() + 60 * 60 * 1000, id: 1 },
  {
    start: new Date(2023, 2, 7, 19, 0, 0),
    end: new Date(2023, 2, 7, 20, 0, 0),
    id: 1,
    content: "Dragon",
    group: "one",
  },
  //
  {
    start: new Date(2023, 2, 7, 20, 0, 0),
    end: new Date(2023, 2, 7, 21, 0, 0),
    id: 2,
    content: "Lion",
    group: "two",
  },  
];

// var padding = 10;
var margin = { top: 20, right: 20, bottom: 30, left: 40 };
var height = 400;
var width = 1200;
var xTime = d3
  .scaleTime()
  .domain([
    Date.now() - 24 * 60 * 60 * 1000 * 5,
    Date.now() + 24 * 60 * 60 * 1000 * 45,
  ])
  .nice(2)
  .range([margin.left, width - margin.right]);

var yGroup = d3
  .scaleBand()
  .domain(["one", "two", "three", "four"])
  .range([height - margin.bottom, margin.top])
  .padding(0.3);

var svg = d3
  .select("#mychart") // I'm starting off by selecting the container.
  .append("svg") // Appending an SVG element to that container.
  .attr("viewBox", [0, 0, width, height])
  .attr("width", width) // Setting the width of the SVG.
  .attr("height", height);

var xAxis = (g, x) =>
  g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

var gx = svg.append("g").call(xAxis, xTime);
// const tooltip = svg.append("g").style("pointer-events", "none");
svg
  .append("g")
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(yGroup));

var zoom = d3
  .zoom()
  .extent([
    [margin.left, 0],
    [width - margin.right, height],
  ])
  .translateExtent([
    [margin.left, -Infinity],
    [width - margin.right, Infinity],
  ])
  .on("zoom", zoomed);

  var drag = d3
  .drag()
  .on("start", dragstarted)
  .on("drag", dragged)
  .on("end", dragended);
svg
  .append("g")
  .attr("class", "rect")
  .attr("fill", "steelblue")
  .selectAll("g") // I'm selecting all of the rectangles in the SVG (note that at this point, there actually aren't any, but we'll be creating them in a couple of steps).
  .data(dataset)
  .enter()
  .append("rect") // Then I'm mapping the dataset to those rectangles.
  .attr("x", function (value, index) {
    return xTime(value.start);
  })
  .attr("y", function (value, index) {
    return yGroup(value.group);
  })
  .attr("width", function (value, index) {
    return xTime(value.end) - xTime(value.start);
  }) //chartWidth / dataset.length - padding) // The width is dynamically calculated to have an even distribution of bars that take up the entire width of the chart.
  .attr("height", yGroup.bandwidth())
  .attr("fill", "pink") // Sets the color of the bars.
  .attr("data-id", "chi test")
  .call(drag)
  .on("dblclick", function (event, data) {
    console.log("click", event)
    if (event.defaultPrevented) return;    
    title = "Edit book";
    text = "Edit book with what";
    console.log("click",data)
    Swal.fire({
      title: "Action",
      input: "radio",
      inputOptions: {
        edit: "Edit",
        remove: "Remove",
      },
      inputValidator: (value) => {
        if (!value) {
          return "You need to choose something!";
        }
      },
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value == "edit") {
          console.log("data", data);
          inputValue = moment(data.end).diff(moment(data.start), "minutes"); // 1 moment(i.end) - moment(i.start)
          console.log("inputValue", inputValue);
          Swal.fire({
            title: "Time long you book?",
            icon: "question",
            input: "range",
            inputLabel: "Minute",
            inputAttributes: {
              min: 60,
              max: 180,
              step: 15,
            },
            inputValue: inputValue,
          }).then((result) => {
            if (result.isConfirmed) {
              data.end = moment(data.start)
                .add(parseInt(result.value), "minutes")
                .toDate();              
              let transform = d3.zoomTransform(event.target);              
              let xz = transform.rescaleX(xTime);              
              d3.select(event.target).attr("width", xz(data.end) - xz(data.start));
            }
            
          });
        } else if (result.value == "remove") {
          data = null;
          d3.select(event.target).remove();
          console.log(dataset)
        }
      }
    });
  })
  //// Tooltip
  // .on("click", (event, d) => {
  //   console.log(event, d);
    
  //   tooltip = svg.append("g").attr("class", `tooltip`);
  //   title = "ddddd";
  //   tooltip.style("display", null);
  //   tooltip.attr("transform", `translate(${event.clientX},${event.clientY})`);

  //   const path = tooltip
  //     .selectAll("path")
  //     .data([,])
  //     .join("path")
  //     .attr("fill", "#f0f0f0")
  //     .attr("stroke", "black");

  //   const text = tooltip
  //     .selectAll("text")
  //     .data([,])
  //     .join("text")
  //     .call((text) =>
  //       text
  //         .selectAll("tspan")
  //         .data(
  //           `${d.content}: ${moment(d.start).format(
  //             "DD/MM/YYYY HH:mm"
  //           )} -> ${moment(d.end).format("HH:mm")} `
  //         )
  //         .join("tspan")
  //         .attr("font-weight", (_, i) => (i ? null : "bold"))
  //         .text((d) => d)
  //     );

  //   const { x, y, width: w, height: h } = text.node().getBBox();
  //   text.attr("transform", `translate(${-w / 2},${15 - y})`);
  //   path.attr(
  //     "d",
  //     `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`
  //   );
  //   // svg.property("value", O[i]).dispatch("input", { bubbles: true });
  // })
  // .on("pointerleave", (event, d) => {
  //   tooltip.remove();
  //   svg.node().value = null;
  //   svg.dispatch("input", { bubbles: true });
  // })
  

svg
  .call(zoom)
  .transition()
  .duration(150)
  .call(zoom.scaleTo, 50, [xTime(Date.now()), 0])

function zoomed(event) {
  console.log("zoomde",event)
  if (event.sourceEvent && event.sourceEvent.type == "dblclick" && event.sourceEvent.target.nodeName == "rect") {

    return ;
  }
  let xz = event.transform.rescaleX(xTime);
  // console.log("xz", event.transform);
  // path.attr("d", area(data, xz));
  svg
    .selectAll(".rect rect")
    .attr("x", function (d) {
      return xz(d.start);
    })
    .attr("width", function (d) {
      // console.log("gia tri width", xz(d.end), xz(d.start));
      return xz(d.end) - xz(d.start);
    });

  gx.call(xAxis, xz);
}
var dragStartEvent = null
var dragEndEvent = null

function dragstarted(event, d) {
  console.log("drag",event)
  dragStartEvent = event
  d3.select(this).raise().attr("stroke", "black");
}

function dragged(event, d) {
  console.log("dragged event",event)
  // console.log("dragged d",d)
  var transform = d3.zoomTransform(event.sourceEvent.srcElement)
  // console.log("transform",transform)
  let xz = transform.rescaleX(xTime);  
  let grid = xz(moment(d.start).add(15, "minutes").toDate()) - xz(d.start)
  
  d3.select(this)
    .attr("x", function(d) {   
      
      step = Math.round((event.x/grid) - (dragStartEvent.x/grid))
      new_x = moment(d.start).add(15 * step, "minutes").toDate()
  
      dragEndEvent = new_x
      return xz(new_x)
    })
  
}

function dragended(event, d) {
  
  if (dragEndEvent !== null) {
    d3.select(this).attr("stroke", null);
    dur = moment(d.end).diff(moment(d.start), 'minutes');
    
    d.start = dragEndEvent
    d.end = moment(d.start).add(dur, 'minutes').toDate()
    console.log("dur", d)
  }
  
}
