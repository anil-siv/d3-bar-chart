const width = 800;
const height = 400;
const padding = 50;
//let xScale, yScale

// create blank SVG on chart div and assign it dynamic width and height, viewBox makes the chart responsive
const svg = d3
  .select("#chart")
  .append("svg")
  .attr("viewBox", "0 0 860 430")
  .attr("preserveAspectRatio", "xMidyMid");

//fetch the json file
d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
).then((response) => {
  let barWidth = width / response["data"].length;

//spit out formatted date from file
  let yearsMap = response.data.map((elem) => {
    {
      return [new Date(elem[0]), elem[1]];
    }
  });

//helper function to put date in format to pass FCC test case...
  const stringifyDate = (date) => {
    let mm = date.getMonth() + 1;
    if (mm < 10) {
      mm = "0" + mm;
    }
    let dd = date.getDate();
    if (dd < 10) {
      dd = "0" + dd;
    }
    let yyyy = date.getFullYear();

    return yyyy + "-" + mm + "-" + dd;
  };

 //set scales - x uses time because it's scaled against date obj
 const xScale = d3
    .scaleTime()
    .domain([d3.min(yearsMap, (d) => d[0]), d3.max(yearsMap, (d) => d[0])])
    .range([padding, width - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(yearsMap, (d) => d[1])])
    .range([height, padding]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

//create empty tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute");

  const mousemove = (event, d, i) => {
    const text = d3
      .select("#tooltip")
      .attr("data-date", stringifyDate(d[0]))
      .html("<p>" + stringifyDate(d[0]) + ": $" + d[1].toFixed(2) + " Bn</p>")
      .style("left", "40vw")
      .style("top", height - 100 + "px")
      .style("transform", "translateX(60px)");
  };

//plot chart
  svg
    .selectAll("rect")
    .data(yearsMap)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d) => stringifyDate(d[0]))
    .attr("data-gdp", (d) => d[1])
    .attr("x", (d, i) => xScale(d[0]))
    .attr("y", (d, i) => yScale(d[1]))
    .attr("width", barWidth)
    .attr("height", (d) => height - yScale(d[1]))
    .on("mouseover", (event, d) => {
      d3.select("#tooltip").style("opacity", 1);
    })
    .on("mouseleave", (event, d) => {
      d3.select("#tooltip").style("opacity", 0);
    })
    .on("mousemove", mousemove);

// add axes
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + height + ")")
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);
});
