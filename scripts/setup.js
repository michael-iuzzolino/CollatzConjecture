function setupIndividualVis()
{
  singleVisContainer = mainContainer.append("div").attr("id", "single_vis_container");
  

    
  singleVisContainer.append("h2").html("Individual Plot");
  
  
  
  
  singleSVGContainer = singleVisContainer.append("svg")
                      .attr("id", "single_svg_container")
                      .attr("height", SINGLE_SVG_HEIGHT)
                      .attr("width", SINGLE_SVG_WIDTH);
  
  var background = singleSVGContainer.append("rect")
                      .attr("id", "svg_background")
                      .attr("height", SINGLE_SVG_HEIGHT)
                      .attr("width", SINGLE_SVG_WIDTH)
                      .style("fill", BACKGROUND_COLOR)
                      .style("stroke", "#000000")
  
  
  singleVisContainer.style("opacity", "0");
  
  
  // Setup reset button
  singleVisContainer.append("div").attr("id", "single_plot_control").append("input")
                .attr("type", "button")
                .attr("value", "Clear Plot")
                .attr("id", "clear_plot_button")
                .on("click", function()
                {
                  updateSinglePlot(false);
                  clearIndividualPlot();
                });
  
}


function updateSinglePlot(show)
{
  single_plot_active = show;
  if (!show)
  {
    singleVisContainer.transition()
              .duration(1000)
              .style("opacity", "0");

  }
  else
  {
    singleVisContainer.transition()
              .duration(500)
              .style("opacity", "1");
  }
  
}



function reset()
{
  d3.select("#main_container").remove();
  initializeMainEnvironment();
}








function setupMultiVis()
{
  
  multiVisContainer = mainContainer.append("div").attr("id", "multi_vis_container")
  
  // Header
  multiVisContainer.append("div").append("h2").html("Main Plot");
  
  
  // Define Container
  multiSVGContainer = multiVisContainer.append("svg")
                      .attr("id", "multi_svg_container")
                      .attr("height", MULTI_SVG_HEIGHT)
                      .attr("width", MULTI_SVG_WIDTH);
  
  var background = multiSVGContainer.append("rect")
                      .attr("id", "svg_background")
                      .attr("height", MULTI_SVG_HEIGHT)
                      .attr("width", MULTI_SVG_WIDTH)
                      .style("fill", BACKGROUND_COLOR)
                      .style("stroke", "#000000")
               
}









function setupControls()
{
  controlsContainer = mainContainer.append("div").attr("id", "controls_container");
  
  controlsContainer.append("h1")
                    .html("Collatz Conjecture");
  
  // Start button
  controlsContainer.append("input")
                    .attr("type", "button")
                    .attr("value", "Start!")
                    .attr("id", "start_button")
                    .on("click", function()
                    {
                      clearAllPlots();
                      startMultiple();
                    });
  // Reset button
  controlsContainer.append("input")
                    .attr("type", "button")
                    .attr("value", "Reset")
                    .attr("id", "reset_button")
                    .on("click", function()
                    {
                      reset();
                    });
  
  
  // Speed Factor
  controlsContainer.append("p").html("Max Bound: ")
                    .append("input")
                    .attr("type", "number")
                    .attr("value", max_bound)
                    .attr("min", 0)
                    .attr("step", 1)
                    .on("change", function()
                    {
                      max_bound = this.value;
                    });
  
  // Speed Factor
  controlsContainer.append("p").html("Speed Factor: ")
                    .append("input")
                    .attr("type", "number")
                    .attr("value", speed_factor)
                    .attr("min", 0)
                    .attr("max", 1)
                    .attr("step", 0.05)
                    .on("change", function()
                    {
                      speed_factor = this.value;
                    });
}






function clearIndividualPlot()
{
  updateSinglePlot(false);
  d3.selectAll(".data_circle").remove();
  d3.selectAll(".data_text").remove();
  d3.selectAll("#starting_number_label").remove();
  d3.select("#solution_label").remove();
  
}
function clearAllPlots()
{
  updateSinglePlot(false);
  d3.selectAll(".time_solution_circle").remove();
  d3.selectAll(".time_solution_text").remove();
  d3.selectAll(".data_circle").remove();
  d3.selectAll(".data_text").remove();
  d3.selectAll("#starting_number_label").remove();
  d3.select("#solution_label").remove();
}


function initializeConstants()
{
  single_plot_active = false;
  max_bound = DEFAULT_MAX_BOUND;
  speed_factor = DEFAULT_SPEED_FACTOR;
}

function initializeMainEnvironment()
{
  initializeConstants();
  mainContainer = d3.select("body").append("div").attr("id", "main_container");
  setupControls();
  setupMultiVis();
  setupIndividualVis();
}




