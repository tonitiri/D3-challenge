// @TODO: YOUR CODE HERE!
// Step 1: Set up our chart
//= ================================
var svgWidth = 1000;
var svgHeight = 700;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Step 3:
// Import data from the data.csv file
// =================================
d3.csv("assets/data/data.csv").then(stateData => {
    console.log(stateData);

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    stateData.forEach(data => {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.abbr = data.abbr;
        data.state = data.state;
    });


    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(stateData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(stateData, d => d.healthcare)])
        .range([height, 0]);



    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);


    // Step 4: Append Axes to the chart
    // ==============================
    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
        .call(leftAxis);



    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 7)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks healthcare(%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 28})`)
        .attr("class", "axisText")
        .text("In Poverty(%)");




    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("id", "circleCustomTooltip")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "20")
        .attr("fill", "blue")
        .style("fill", function (d) {
            return d.abbr
        })
        .attr("opacity", ".8")


    // .append("text")
    // .text(function (d) { return d.abbr; })
    // .attr("font-family", "sans-serif")
    // .attr("font-size", "10px")
    // .attr("text-anchor", "middle")
    // .attr("font-color", "black");

    var dotLabels = chartGroup.selectAll("text")
        .data(stateData)
        .enter()
        .append("text")
        .attr("id", "textplace")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .text(function (d) { return d.abbr })
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("fill", "white");


    // Step 6: Initialize tool tip
    // ==============================
    // var toolTip = d3.tip()
    //     .attr("class", "d3-tip")
    //     // .offset([80, -60])
    //     .html(function (d) {
    //         return (`${data.abbr}<br>poverty percentage: ${data.poverty}<br>healthcare ratio: ${data.healthcare}`);
    //     });

    // var toolTip = d3.selectAll('#circle')
    //     .append('div')
    //     .attr("class", "tooltip")
    //     // .offset([80, -60])
    //     .html(function (d) {
    //         return (`${d.abbr}<br>poverty percentage: ${d.poverty}<br>healthcare ratio: ${d.healthcare}`);
    //     });

    // create a tooltip
    var tooltip2 = d3.select("#circleCustomTooltip")
        .append("div")
        .style("position", "absolute")
        .style("visibility", "visible")
        .style("background-color", "black")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "15px")
        .html(function (d) {
            return (`inner text: ${d.abbr}<br>poverty percentage: ${d.poverty}<br>healthcare ratio: ${d.healthcare}`);
        });

    // Step 7: Create tooltip in the chart
    // ==============================
    d3.select("#circleCustomTooltip")
        .on("mouseover", function () { return tooltip2.style("visibility", "visible"); })
        .on("mousemove", function () { return tooltip2.style("top", (event.pageY - 2390) + "px").style("left", (event.pageX - 800) + "px"); })
        .on("mouseout", function () { return tooltip2.style("visibility", "hidden"); });


    // chartGroup.call(tooltip2);

    // // Step 8: Create event listeners to display and hide the tooltip
    // // ==============================
    // circlesGroup.on("click", function (data) {
    //     tooltip2.show(data, this);
    // })
    //     // onmouseover event
    //     .on("mouseover", function (data, index) {
    //         tooltip2.html(data);
    //     });

}).catch(function (error) {
    console.log(error);
});


