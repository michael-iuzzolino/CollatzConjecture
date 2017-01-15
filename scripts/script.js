

function setup()
{
  initializeMainEnvironment();
}


function startMultiple()
{
  // Iterate through i = 1 to i = max bound
  var history, solution_time;
  
  
  history = [0];
  for (var number=1; number < max_bound; number++)
  {
    solution_time = startIndividual(number);
    
    history.push(solution_time);
    
  }
  updateMultiVis(history);
}





function startIndividual(starting_number, plot=false)
{
  // Rules
  // 1. If number is even, half it.
  // 2. If number is odd, multiply it by 3 and add 1
  //
  // Continue process until number == 1
  var converged, new_number, number, 
      individual_history, index_gen;
  
  converged = false;
  
  // Check trivial case of starting number == 1
  if (starting_number == 1)
  {
    return 0;
  }
  
  individual_history = [starting_number];
  index_gen = 0
  while (!converged)
  {
    
    
    // Define current number
    number = individual_history[index_gen];

    // Calculate new number
    new_number = (number % 2 == 0) ? (number / 2) : (3*number + 1);
    
    // Push new number to individual_history
    individual_history.push(new_number);

    // Check if converged
    converged = (new_number == 1) ? true : false;

    // Incremenet generation index
    index_gen++;
  }
  solution_time = individual_history.length-1;
  
  if (plot)
  {
    single_plot_active = true;
    updateSingleVis(individual_history, solution_time);
  }
  
  return solution_time;
}












function updateMultiVis(history)
{
  var current_object;
  var new_x, new_y;
  
  var this_object, text_width, text_height;
  
  control_container_height = parseInt(controlsContainer[0][0].clientHeight);
  
  var xScale, yScale, colorScale, fadeScale;
  
  
  xScale = d3.scale.ordinal()
                .domain(d3.range(0, history.length))
                .rangeBands([0, MULTI_SVG_WIDTH*0.9]);
  
  yScale = d3.scale.linear()
                .domain([0, d3.max(history)])
                .range([0, MULTI_SVG_HEIGHT*0.9]);
  
 
  colorScale = d3.scale.linear()
                .domain([0, d3.max(history)*0.33, d3.max(history)*0.66, d3.max(history)])
                .range(["#00ff00", "#ffcc00", "#ff8000", "#ff0000"]);
  
  
  fadeScale = d3.scale.linear()
                .domain([0, FADE_IN_TIME])
                .range(["0", "1"]);

  
  
  
  
  // Y axis label
  multiVisContainer.append("div")
              .attr("id", "multi_y_label")
              .style("opacity", "0")
              .text("Solution Time")
              .style("font-size", "16px")   
              .style("position", "absolute")
              .style("left", function() { return MULTI_SVG_WIDTH*1.02+"px"; })
              .style("top", function()
              {
                return SINGLE_SVG_HEIGHT/2 + control_container_height + "px";
              });
             
  
  
  // Y axis label transition
  d3.select("#multi_y_label").transition()
    .duration(EASE_DURATION*1.7)
    .style("opacity", "1")
  
  
  
  
  // X axis label
  multiVisContainer.append("div")
              .attr("id", "multi_x_label")
              .style("opacity", "0")
              .text("Number")
              .style("font-size", "16px")   
              .style("position", "absolute")
              .style("top", function()
              {
                return SINGLE_SVG_HEIGHT*1.15 + control_container_height + "px";
              })
              .style("left", function()
              {
                this_obj = d3.select(this);
                text_width = parseInt(this_obj[0][0].clientWidth);

                return (MULTI_SVG_WIDTH / 2 - text_width) +"px";
              });
  
  
  // X axis label transition
  d3.select("#multi_x_label").transition()
    .duration(EASE_DURATION*1.7)
    .style("opacity", "1")
  
  
  
  //  X label text
  var xLabelContainer = multiSVGContainer.append("g").selectAll("text")
      .data(history).enter()
      .append("text")
      .style("opacity", "0")
      .attr("class", "time_solution_text")
      .attr("x", function(solution_time, number) { return xScale(number) + X_OFFSET*0.7;})
      .attr("y", function(solution_time, number){ return MULTI_SVG_HEIGHT; })
      .text( function (solution_time, number) 
      { 
        if (max_bound < 100)
        {
          return number;
        }
        else
        {
          var factor = Math.floor(max_bound * 0.1);
        
          if (number % factor == 0)
          {
            return number;
          }
        }
      })
      .style("font-size", "10px")
  
  
  // X label text Transitions
  xLabelContainer.transition()
    .duration(EASE_DURATION*1.6)
    .style("opacity", "1");
  
  
  
  
  // Tooltip
  var tooltip = multiVisContainer.append("div")
                .attr("id", "tool_tip")
                .style("position", "absolute")
                .style("opacity", "0")
  
  
  // Plot Prompt
  multiVisContainer.append("div")
              .attr("id", "plot_prompt")
              .style("opacity", "0")
              .text("Plot?")
              .style("font-size", "8px")   
              .style("position", "absolute");
        
  
  
  // Circles
  var circlesContainer = multiSVGContainer.selectAll("circle")
      .data(history).enter()
      .append("circle")
      .attr("class", "time_solution_circle")
      .style("opacity", "0")
      .style("fill", function(solution_time, number) 
      {
        return colorScale(solution_time);
      })
      .attr("cx", function(solution_time, number)
      {
        return 0;
      })
      .attr("cy", function(solution_time, number)
      {
        return MULTI_SVG_HEIGHT - yScale(solution_time) - CIRCLE_R;
      })
  
      .attr("r", CIRCLE_R) 
      .on("click", function(solution_time, number)
      {
        if (!plot_multiple_single_plot)
        {
          clearIndividualPlot();  
        }
        updateSinglePlot(true);
        startIndividual(number, true);  
        
      })
      .on("mouseover", function(solution_time, number)
      {
        
        // define current object
        current_object = d3.select(this);
        
        // check if single plot is active. If not, fade in  
        if (!single_plot_active)
        {
          singleVisContainer.transition()
              .duration(1000)
              .style("opacity", "0.5");
        }
        
        
        // Plot prompt
        d3.select("#plot_prompt")
              .style("left", function()
              {
                new_x = parseInt(current_object.attr('cx'));
                return new_x + "px";
              })
              .style("top", function()
              {
                new_y = parseInt(current_object.attr('cy')) + control_container_height + CIRCLE_R*R_EXPAND_FACTOR;

                return new_y + "px";
              })
              .transition()
              .duration(1000)
              .style("opacity", "1")
              .style("font-size", "16px")
        
        
        // Tooltip
        tooltip.html( function ()
            {
              return "Number: " + number + "; Solution Time: " + solution_time;
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
            .style("font-weight", "bold")
            .transition()
              .duration(1000)
              .style("opacity", "1")
              .style("font-size", "18px");
        
        
        // Define the objects current fill
        original_multi_fill = this.style.fill;
        
        // Transition
        current_object.style("stroke-opacity", "0")
                      .style("stroke", CIRCLE_SELECT_BORDER_COLOR)
                      .style("fill", colorScale(solution_time))
                      .style("stroke-width", 3)
                      .transition() 
                        .duration(700)
                        .style("stroke-opacity", "1")
                        .attr("r", CIRCLE_R*R_EXPAND_FACTOR)
                        .style("opacity", "0.75");
      })
      
      .on("mouseout", function(d, i)
      {
        // Define current object
        current_object = d3.select(this);
        
        
        // Check if single plot is active. If not, fade it out
        if (!single_plot_active)
        {
          singleVisContainer.transition()
            .duration(1000)
            .style("opacity", "0");
        }
        
        
        
        // Tooltip transition
        tooltip.transition()
              .duration(300)
              .style("opacity", "0")
              .style("font-size", "10px");
        
        
        // Current object transition
        current_object.transition() 
                .style("fill", original_multi_fill)
                .style("opacity", "1.0")
                .duration(300)
                .style("stroke-opacity", "0")
                .attr("r", CIRCLE_R)
                .style("opacity", "1");
        
        
        // Plot prompt transitions
        d3.select("#plot_prompt")
              .style("left", function()
              {
                new_x = parseInt(current_object.attr('cx'));
                return new_x + "px";
              })
              .style("top", function()
              {
                new_y = parseInt(current_object.attr('cy')) + control_container_height + CIRCLE_R*R_EXPAND_FACTOR;

                return new_y + "px";
              })
              .transition()
              .duration(300)
              .style("opacity", "0")
              .style("font-size", "8px")
        
        
      });
  
  
  
      

  // Circle Transitions
  circlesContainer.transition()
    .style("opacity", "1")
    .attr("cx", function(solution_time, number)
    { return xScale(number) + X_OFFSET; })
    .delay( function(solution_time, number)
    {
      return number * TIME_FACTOR / (solution_time * speed_factor);
    })
    .duration(EASE_DURATION)
    .ease("elastic");

}
















function updateSingleVis(individual_history, solution_time)
{
  var current_object;
  var new_x, new_y;
  
  var this_object, text_width, text_height;
  
  control_container_height = parseInt(controlsContainer[0][0].clientHeight);
  
  var xScale, yScale, colorScale, fadeScale;
  
  
  xScale = d3.scale.ordinal()
                .domain(d3.range(0, individual_history.length))
                .rangeBands([0, SINGLE_SVG_WIDTH*0.9]);
  
  yScale = d3.scale.linear()
                .domain([0, d3.max(individual_history)])
                .range([0, SINGLE_SVG_HEIGHT*0.9]);
  
 
  colorScale = d3.scale.linear()
                .domain([0, d3.max(individual_history)*0.33, d3.max(individual_history)*0.66, d3.max(individual_history)])
                .range(["#00ff00", "#ffcc00", "#ff8000", "#ff0000"]);
  
  
  fadeScale = d3.scale.linear()
                .domain([0, FADE_IN_TIME])
                .range(["0", "1"]);

  
    
  
  // Starting Number
  singleVisContainer.append("div")
              .attr("id", "starting_number_label")
              .style("opacity", 0)
              .text( function()
              {
                return "Starting Number: " + individual_history[0];
              })
              .style("font-size", "14px")   
              .style("position", "absolute")
              .style("left", function()
              {
                this_obj = d3.select(this);
                text_width = parseInt(this_obj[0][0].clientWidth);
    
                return SINGLE_SVG_WIDTH*0.02 +"px";
              })
              .style("top", function()
              {
                return MULTI_SVG_HEIGHT*1.255 + control_container_height + "px";
              });
  
  // Solution time transition
  d3.select("#starting_number_label").transition()
    .style("opacity", "1")
    .delay( function(d, i)
    {
      return EASE_DURATION*1.8;
    });
  
  
  
  // Solution time
  singleVisContainer.append("div")
              .attr("id", "solution_label")
              .style("opacity", 0)
              .text( function()
              {
                return "Solution at time-step " + solution_time + ".";
              })
              .style("font-size", "14px")   
              .style("position", "absolute")
              .style("left", function()
              {
                this_obj = d3.select(this);
                text_width = parseInt(this_obj[0][0].clientWidth);
    
                return (SINGLE_SVG_WIDTH - text_width) +"px";
              })
              .style("top", function()
              {
                return MULTI_SVG_HEIGHT*1.255 + control_container_height + "px";
              });
  
  // Solution time transition
  d3.select("#solution_label").transition()
    .style("opacity", "1")
    .delay( function(d, i)
    {
      return EASE_DURATION*1.8;
    });
  
  
  
  // X axis label
  d3.select("#singleSVGContainer").append("div")
              .attr("id", "x_label")
              .style("opacity", "0")
              .text("Time Steps")
              .style("font-size", "16px")   
              .style("position", "absolute")
              .style("top", function()
              {
                return MULTI_SVG_HEIGHT*1.2 + SINGLE_SVG_HEIGHT*1.075 + control_container_height + "px";
              })
              .style("left", function()
              {
                this_obj = d3.select(this);
                text_width = parseInt(this_obj[0][0].clientWidth);

                return (SINGLE_SVG_WIDTH / 2 - text_width) +"px";
              });
  
  
  // X axis label transition
  d3.select("#x_label").transition()
    .duration(EASE_DURATION*1.7)
    .style("opacity", "1")
  
  
  
  // X axis Text
  var xLabelContainer = singleSVGContainer.append("g").selectAll("text")
      .data(individual_history).enter()
      .append("text")
      .style("opacity", "0")
      .attr("class", "data_text")
      .attr("x", "0")
      .attr("y", function(d, i)
      {
        return SINGLE_SVG_HEIGHT;
      })
      
      .text( function (number, time_step) 
      { 
        if (solution_time < 100)
        {
          return time_step;
        }
        else
        {
          var factor = Math.floor(solution_time * 0.1);
        
          if (time_step % factor == 0)
          {
            return time_step;
          }
        }
      })
//      .text( function (d, i) { return i; })
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

  
  
  
  // X axis Text Transitions
  xLabelContainer.transition()
    .style("opacity", "1")
    .attr("x", function(d, i)
    {
      return xScale(i) + X_OFFSET*0.7;
    })
    .delay( function(d, i)
    {
      return i*TIME_FACTOR / (solution_time*speed_factor);
    })
    .duration(EASE_DURATION*1.6)
    .ease("elastic");
  
  
  
  
  
  // Tooltip
  var tooltip = singleVisContainer.append("div")
                .attr("id", "tool_tip")
                .style("position", "absolute")
                .style("opacity", "0")
        
  
  // Circles
  var circlesContainer = singleSVGContainer.selectAll("circ")
      .data(individual_history).enter()
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
        return SINGLE_SVG_HEIGHT - yScale(d) - CIRCLE_R;
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
              new_y = MULTI_SVG_HEIGHT*1.20 + parseInt(current_object.attr('cy')) + control_container_height - CIRCLE_R*R_EXPAND_FACTOR;
             
              return new_y + "px";
            })
            .style("font-weight", "bold")
            .transition()
              .duration(1000)
              .style("opacity", "1")
              .style("font-size", "18px");
        
        original_single_fill = this.style.fill;
        
        
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
     
      .on("mouseout", function(d, i)
      {
        current_object = d3.select(this);
        
        tooltip.transition()
              .duration(300)
              .style("opacity", "0")
              .style("font-size", "10px");
        
        current_object
            
            .transition() 
                .style("fill", original_single_fill)
                .style("opacity", "1.0")
                .duration(300)
                .style("stroke-opacity", "0")
                .attr("r", CIRCLE_R)
                .style("opacity", "1");
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
      return i * TIME_FACTOR / (solution_time * speed_factor);
    })
    .duration(EASE_DURATION)
    .ease("elastic");
  
  
  
}



