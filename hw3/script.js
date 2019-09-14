changeData()
/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */
function staircase() {
  //select an element from main document
  rectsGroup = document.getElementById('aBarChart');
  console.log(rectsGroup.children.length);
  for(var i=0; i<rectsGroup.children.length; i++){
    rectsGroup.children[i].setAttribute("width", i*"20"+50)
  }

  //Now loop through each 
  // ****** TODO: PART II ******
}

//Function to add color to hover element
function jsHoverColor(x){
  x.style.fill = 'purple';
}
function jsHoverOriginal(x){
  x.style = null;
}

//



/**
 * Render the visualizations
 * @param data
 */
function update(data) {
  /**
   * D3 loads all CSV data as strings. While Javascript is pretty smart
   * about interpreting strings as numbers when you do things like
   * multiplication, it will still treat them as strings where it makes
   * sense (e.g. adding strings will concatenate them, not add the values
   * together, or comparing strings will do string comparison, not numeric
   * comparison).
   *
   * We need to explicitly convert values to numbers so that comparisons work
   * when we call d3.max()
   **/

  for (let d of data) {
    d.a = +d.a; //unary operator converts string to number
    d.b = +d.b; //unary operator converts string to number
  }

  // Set up the scales
  // TODO: The scales below are examples, modify the ranges and domains to suit your implementation.
  let aScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.a)])
    .range([0, 14]);

  let bScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.b)])
    .range([0, 10]);

  let iScale = d3
    .scaleLinear()
    .domain([0, data.length])
    .range([0, 10]);

  // ****** TODO: PART III (you will also edit in PART V) ******

  // TODO: Select and update the 'a' bar chart bars
  //select the barchart by the id
  var aBarChart = d3.select("#aBarChart");
  //UPDATE rectangles with the data
  var aRects = aBarChart.selectAll('rect').data(data); //enter
  aRects
    .exit()
    .style('opacity', 1)
    .transition()
    .duration(1000)
    .style('opacity',0)
    .remove();
    
  var aRectsEnter = aRects.enter()
    .append('rect')
    .attr("height", 18)
    .attr('transform', (d,i) => "translate(18, " + i*20 + ") scale(-1,1)");
  //EXIT remove old elements
  //MERGE
  aRects = aRectsEnter.merge(aRects)
  //CHANGE ATTRIBURES  
  //aRects
    .transition().duration(1000)
    .attr('width', d => aScale(d.a)*10)
    .attr('onmouseover', 'jsHoverColor(this)')
    .attr('onmouseout', 'jsHoverOriginal(this)');

  // TODO: Select and update the 'b' bar chart bars
  //var bBarChart = d3.select();
  //UPDATE retangles
  var bRects = d3.select("#bBarChart").selectAll('rect').data(data);
  bRects
    .exit()
    .style('opacity', 1)
    .transition()
    .duration(1000)
    .style('opacity',0)
    .remove();

  var bRectsEnter = bRects.enter()
    .append('rect')
    .attr('transform', (d,i) => "translate(0, "+ i*20 +")")
    .attr('height', 18);
  //EXIT
  //MERGE
  bRects = bRectsEnter.merge(bRects);
  //CHANGE ATTR
  bRects
    .transition().duration(1000)
    .attr('width', d => bScale(d.b)*10)
    .attr('onmouseover', 'jsHoverColor(this)')
    .attr('onmouseout', 'jsHoverOriginal(this)');

  // TODO: Select and update the 'a' line chart path using this line generator
  let aLineGenerator = d3
    .line()
    .x((d, i) => iScale(i))
    .y(d => aScale(d.a));
  
  //select aLine and add data
  //ENTER
  var aLineChart = d3.select('#aLineChart').data([data]);
  aLineChart
    .exit()
    .style('opacity', 1)
    .transition()
    .duration(1000)
    .style('opacity',0)
    .remove();

  var aLineChartEnter = aLineChart.enter().append('path');
  //EXIT
  //MERGE
  aLineChart = aLineChartEnter.merge(aLineChart);
  //CHANGE ATTR
  aLineChart
    .transition().duration(1000)
    .attr('d',d => aLineGenerator(d));
  


  // TODO: Select and update the 'b' line chart path (create your own generator)
  let bLineGenerator = d3
    .line()
    .x((d, i) => iScale(i))
    .y(d => aScale(d.b));
  //select aLine and add data
  //ENTER
  var bLineChart = d3.select('#bLineChart').data([data]);
  bLineChart
    .exit()
    .style('opacity', 1)
    .transition()
    .duration(1000)
    .style('opacity',0)
    .remove();

  var bLineChartEnter = bLineChart.enter().append('path');
  //EXIT
  
  //MERGE
  bLineChart = bLineChartEnter.merge(bLineChart);
  //CHANGE ATTR
  bLineChart
    .transition().duration(1000).ease(d3.easeLinear)
    .attr('d',d => bLineGenerator(d));
  
  

  // TODO: Select and update the 'a' area chart path using this area generator
  let aAreaGenerator = d3
    .area()
    .x((d, i) => iScale(i))
    .y0(0)
    .y1(d => aScale(d.a));

  //select aLine and add data
  //ENTER
  var aAreaChart = d3.select('#aAreaChart').data([data]);
  aAreaChart
    .exit()
    .style('opacity', 1)
    .transition()
    .duration(1000)
    .style('opacity',0)
    .remove();

  var aAreaChartEnter = aAreaChart.enter().append('path');
  //MERGE
  aAreaChart = aAreaChartEnter.merge(aAreaChart);
  //CHANGE ATTR
  aAreaChart
    .transition().duration(1000)
    .attr('d',d => aAreaGenerator(d));//Generate the area
    
  // TODO: Select and update the 'b' area chart path (create your own generator)
  let bAreaGenerator = d3
    .area()
    .x((d, i) => iScale(i))
    .y0(0)
    .y1(d => aScale(d.b));

  //select aLine and add data
  //ENTER
  var bAreaChart = d3.select('#bAreaChart').data([data]);
  bAreaChart
    .exit()
    .style('opacity', 1)
    .transition()
    .duration(1000)
    .style('opacity',0)
    .remove();

  var bAreaChartEnter = bAreaChart.enter().append('path');
  //EXIT
  //MERGE
  bAreaChart = bAreaChartEnter.merge(bAreaChart);
  //CHANGE ATTR
  bAreaChart
    .transition().duration(1000)
    .attr('d', d => bAreaGenerator(d));
  

  // TODO: Select and update the scatterplot points
  height = 300;
  width = 300;
  padding = 25;

  let xaScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.a)])
    .range([0, width])
    .nice();

  let ybScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.b)*1.2])
    .range([height,0])
    .nice();

  var sPlot = d3.select('#scatterplot').
      selectAll('circle').data(data);
  sPlot
    .exit()
    .style('opacity', 1)
    .transition()
    .duration(1000)
    .style('opacity',0)
    .remove();

  var sPlotEnter = sPlot.enter().append('circle');
  sPlot = sPlotEnter.merge(sPlot);
  sPlot
    .attr('title', (d,i) => d.a + "," + d.b)
    .on('click', (d,i) => console.log(d) )
    .transition().duration(1000)
    .on('start', () => d3.select(this))
    .ease(d3.easeElastic)
    .delay( (d,i) => i / data.length *500 )
    .attr("r", 8)
    .attr('cx', d => xaScale(d.a))
    .attr('cy', d => ybScale(d.b))
    .on('end', () => d3.select(this).transition().duration(500));

  //AXIS
  var plotDim = d3.select('.scatter-plot');
  plotDim
    .attr('width', width + 2 * padding)
    .attr('height', height + 2 * padding)
    .attr("transform", "translate(" + padding + "," + padding + ")");

  plotDim
    .select('rect')
    .attr('width', width)
    .attr('height', height)
    .attr("transform", "translate(" + padding + "," + padding + ")");

  let xAxis = d3.axisBottom();
        xAxis.scale(xaScale);

  plotDim.select('#x-axis')
    .classed("axis", true)
    // moving the axis to the right place
    .transition().duration(1000)
    .attr("transform", "translate(" + padding + "," + (height + padding) + ")")
    .call(xAxis);

  let yAxis = d3.axisLeft();
        yAxis.scale(ybScale);

  plotDim.select('#y-axis')
    .classed("axis", true)
    // moving the axis to the right place
    //.attr("transform", "translate(" + padding + "," + (width + padding) + ")")
    .transition().duration(1000)
    .attr('transform', "translate(" + padding + "," + padding + ")")
    .call(yAxis);
  


  //****** TODO: PART IV ******
}

//TROUBLESHOOT
//update("data/anscombe_I.csv")

/**
 * Update the data according to document settings
 */
async function changeData() {
  //  Load the file indicated by the select menu
  let dataFile = document.getElementById("dataset").value;
  try {
    const data = await d3.csv("data/" + dataFile + ".csv");
    if (document.getElementById("random").checked) {
      // if random
      update(randomSubset(data)); // update w/ random subset of data
    } else {
      // else
      update(data); // update w/ full data
    }
  } catch (error) {
    alert("Could not load the dataset!");
  }
}

/**
 *  Slice out a random chunk of the provided in data
 *  @param data
 */
function randomSubset(data) {
  console.log(data)
  console.log(data.filter(d => Math.random() > 0.5))
  return data.filter(d => Math.random() > 0.5);
}
