var mainContainer, visContainer, controlsContainer, SVGContainer;
var DEFAULT_start_number = 10;
var starting_number;

var SVG_HEIGHT = 400;
var SVG_WIDTH = 600;
var X_OFFSET = 20;
var CIRCLE_R = 10;
var R_EXPAND_FACTOR = 1.75;

var FADE_IN_TIME = 1000;
var DEFAULT_SPEED_FACTOR = 0.75;
var speed_factor;

var solutionTime;
var BACKGROUND_COLOR = "#f2f2f2";
var CIRCLE_SELECT_BORDER_COLOR = "#ff0000";

var TIME_FACTOR = 1000;
var EASE_DURATION = 1200;

var original_fill, original_cx, original_cy;

function setup()
{
  initializeSingleEnvironment();
}


function start()
{
  // Rules
  // 1. If number is even, half it.
  // 2. If number is odd, multiply it by 3 and add 1
  //
  // Continue process until number == 1
  var converged, new_number, number, 
      history, index_gen;
  
  converged = false;
  history = [starting_number];
  index_gen = 0
  while (!converged)
  {
    // Define current number
    number = history[index_gen];

    // Calculate new number
    new_number = (number % 2 == 0) ? (number / 2) : (3*number + 1);
    
    // Push new number to history
    history.push(new_number);

    // Check if converged
    converged = (new_number == 1) ? true : false;

    // Incremenet generation index
    index_gen++;
  }
  solutionTime = history.length-1;
  updateVis(history);
  
}







function setupControls()
{
  controlsContainer = mainContainer.append("div").attr("id", "controls_container");
  
  controlsContainer.append("h1")
                    .html("Collatz Conjecture")
                    .style("font-family", "monospace")
                    .style("font-size", "16px");
  
  // Start button
  controlsContainer.append("input")
                    .attr("type", "button")
                    .attr("value", "Start!")
                    .attr("id", "start_button")
                    .style("font-size", "12px")
                    .on("click", function()
                    {
                      clearPlot();
                      start();
                    });
  // Reset button
  controlsContainer.append("input")
                    .attr("type", "button")
                    .attr("value", "Reset")
                    .attr("id", "reset_button")
                    .style("font-size", "12px")
                    .on("click", function()
                    {
                      reset();
                    });
  
  // Starting number
  controlsContainer.append("p").html("Starting Number: ").style("font-family", "monospace")
                    .append("input")
                    .attr("type", "number")
                    .attr("value", starting_number)
                    .attr("min", 0)
                    .attr("step", 1)
                    .style("font-size", "12px")
                    .style("font-family", "monospace")
                    .on("change", function()
                    {
                      starting_number = this.value;
                    });
  
  // Speed Factor
  controlsContainer.append("p").html("Speed Factor: ").style("font-family", "monospace")
                    .append("input")
                    .attr("type", "number")
                    .attr("value", speed_factor)
                    .attr("min", 0)
                    .attr("max", 1)
                    .attr("step", 0.05)
                    .style("font-size", "12px")
                    .style("font-family", "monospace")
                    .on("change", function()
                    {
                      speed_factor = this.value;
                    });
}







function reset()
{
  d3.select("#main_container").remove();
  initializeSingleEnvironment();
}











function setupVis()
{
  visContainer = mainContainer.append("div").attr("id", "vis_container");
  
  SVGContainer = visContainer.append("svg")
                      .attr("id", "svg_container")
                      .attr("height", SVG_HEIGHT)
                      .attr("width", SVG_WIDTH);
  
  var background = SVGContainer.append("rect")
                      .attr("id", "svg_background")
                      .attr("height", SVG_HEIGHT)
                      .attr("width", SVG_WIDTH)
                      .style("fill", BACKGROUND_COLOR)
                      .style("stroke", "#000000")
                      .attr("height", SVG_HEIGHT)
                      .attr("width", SVG_WIDTH);
}





function updateVis(history)
{
  var current_object;
  var new_x, new_y;
  var control_container_height;
  var this_object, text_width, text_height;
  
  control_container_height = parseInt(controlsContainer[0][0].clientHeight);
  
  var xScale, yScale, colorScale, fadeScale;
  
  
  xScale = d3.scale.ordinal()
                .domain(d3.range(0, history.length))
                .rangeBands([0, SVG_WIDTH*0.8]);
  
  yScale = d3.scale.linear()
                .domain([0, d3.max(history)])
                .range([0, SVG_HEIGHT*0.9]);
  
 
  colorScale = d3.scale.linear()
                .domain([0, d3.max(history)])
                .range(["#00ff00", "#ff0000"]);
  
  
  fadeScale = d3.scale.linear()
                .domain([0, FADE_IN_TIME])
                .range(["0", "1"]);

  // Solution time
  visContainer.append("div")
              .attr("id", "solution")
              .style("opacity", 0)
              .text( function()
              {
                return "Solution at time-step " + solutionTime + ".";
              })
              .style("font-family", "monospace")
              .style("font-size", "16px")   
              .style("position", "absolute")
              .style("left", function()
              {
                this_obj = d3.select(this);
                text_width = parseInt(this_obj[0][0].clientWidth);
    
                return (SVG_WIDTH - text_width) +"px";
              })
              .style("top", function()
              {
                return control_container_height + "px";
              });
  
  
  // X axis label
  visContainer.append("div")
              .attr("id", "x_label")
              .style("opacity", "0")
              .text("Time Steps")
              .style("font-family", "monospace")
              .style("font-size", "16px")   
              .style("position", "absolute")
              .style("left", "0")
              .style("top", function()
              {
                return SVG_HEIGHT*1.075 + control_container_height + "px";
              })
              .style("left", function()
              {
                this_obj = d3.select(this);
                text_width = parseInt(this_obj[0][0].clientWidth);

                return (SVG_WIDTH / 2 - text_width) +"px";
              });
  
  
  
  // Tooltip
  var tooltip = visContainer.append("div")
                .attr("id", "tool_tip")
                .style("position", "absolute")
                .style("opacity", "0")
        
  
  // Circles
  var circlesContainer = SVGContainer.selectAll("circ")
      .data(history).enter()
      .append("circle")
      .attr("class", "data_circle")
      .style("opacity", "0")
      .style("fill", function(d, i) 
      {
        return colorScale(d);
      })
      .attr("cx", function(d, i)
      {
        return 0;
      })
      .attr("cy", function(d, i)
      {
        return SVG_HEIGHT - yScale(d) - CIRCLE_R;
      })
      .attr("r", CIRCLE_R) 
      .on("mouseover", function(d, i)
      {
        current_object = d3.select(this);
        
        tooltip.html( function ()
            {
              return "Number: " + d + "; Time-step: " + i;
            })
            .style("left", function()
            {
              new_x = parseInt(current_object.attr('cx'));
              return new_x + "px";
            })
            .style("top", function()
            {
              new_y = parseInt(current_object.attr('cy')) + control_container_height - CIRCLE_R*R_EXPAND_FACTOR;
             
              return new_y + "px";
            })
            .style("font-family", "monospace")
            .style("font-weight", "bold")
            .transition()
              .duration(1000)
              .style("opacity", "1")
              .style("font-size", "18px");
        
        original_fill = this.style.fill;
        
        
        current_object.style("stroke-opacity", "0")
                      .style("stroke", CIRCLE_SELECT_BORDER_COLOR)
                      .style("fill", colorScale(d))
                      .style("stroke-width", 3)
                      .transition() 
                        .duration(700)
                        .style("stroke-opacity", "1")
                        .attr("r", CIRCLE_R*R_EXPAND_FACTOR)
                        .style("opacity", "0.75");
      })
      .on("mousemove", function(d, i)
      {
        
      })
      .on("mouseout", function(d, i)
      {
        current_object = d3.select(this);
        
        tooltip.transition()
              .duration(300)
              .style("opacity", "0")
              .style("font-size", "10px");
        
        current_object
            
            .transition() 
                .style("fill", original_fill)
                .style("opacity", "1.0")
                .duration(300)
                .style("stroke-opacity", "0")
                .attr("r", CIRCLE_R)
                .style("opacity", "1");
      });
  
  
  // Text X
  var xLabelContainer = SVGContainer.append("g").selectAll("text")
      .data(history).enter()
      .append("text")
      .style("opacity", "0")
      .style("font-family", "monospace")
      .attr("class", "data_text")
      .attr("x", "0")
      .attr("y", function(d, i)
      {
        return SVG_HEIGHT;
      })
      .text( function (d, i) { return i; })
      .style("font-size", "10px")
      .on("mouseover", function(d, i)
      { 
        current_object = d3.select(this);
        
        current_object.transition() 
                        .duration(700)
                        .style('font-size', "40px");
      })
      .on("mouseout", function()
      {
        current_object = d3.select(this);
        
        current_object.transition() 
                        .duration(250)
                        .style('font-size', "10px"); 
      });

  // Circle Transitions
  circlesContainer.transition()
    .style("opacity", "1")
    .attr("cx", function(d, i)
    {
      return xScale(i) + X_OFFSET;
    })
    .delay( function(d, i)
    {
      return i * TIME_FACTOR / (solutionTime * speed_factor);
    })
    .duration(EASE_DURATION)
    .ease("elastic");
  
  
  // Text Transitions
  xLabelContainer.transition()
    .style("opacity", "1")
    .attr("x", function(d, i)
    {
      return xScale(i) + X_OFFSET*0.7;
    })
    .delay( function(d, i)
    {
      return i*TIME_FACTOR / (solutionTime*speed_factor);
    })
    .duration(EASE_DURATION*1.6)
    .ease("elastic");
  
  
  
  // Solution time transition
  d3.select("#solution").transition()
    .style("opacity", "1")
    .delay( function(d, i)
    {
      return EASE_DURATION*1.8;
    });
  
  
  // xlabel time transition
  d3.select("#x_label").transition()
    .duration(EASE_DURATION*1.7)
    .style("opacity", "1")

  
    
  
  
  
}


function clearPlot()
{
  d3.selectAll(".data_circle").remove();
  d3.selectAll(".data_text").remove();
  d3.select("#solution").remove();
}


function initializeConstants()
{
  starting_number = DEFAULT_start_number;
  speed_factor = DEFAULT_SPEED_FACTOR;
}

function initializeSingleEnvironment()
{
  initializeConstants()
  mainContainer = d3.select("body").append("div").attr("id", "main_container");
  setupControls();
  setupVis();
}
