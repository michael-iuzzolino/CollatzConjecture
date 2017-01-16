
var mainContainer, controlsContainer, 
    multiSVGContainer,
    singleSVGContainer,
    singleVisContainer,
    singlePlot,
    multiVisContainer;


var plot_multiple_single_plot = false;
var DEFAULT_MAX_BOUND = 100;
var max_bound;
var single_plot_active = false;


var SINGLE_SVG_HEIGHT = 400;
var SINGLE_SVG_WIDTH = 600;
var MULTI_SVG_HEIGHT = 400;
var MULTI_SVG_WIDTH = 600;





var X_OFFSET = 20;
var Y_OFFSET = 20;
var CIRCLE_R = 10;
var R_EXPAND_FACTOR = 1.75;

var FADE_IN_TIME = 1000;
var DEFAULT_SPEED_FACTOR = 0.75;
var speed_factor;

var control_container_height;
var BACKGROUND_COLOR = "#f2f2f2";
var CIRCLE_SELECT_BORDER_COLOR = "#ff0000";

var TIME_FACTOR = 1000;
var EASE_DURATION = 1200;

var original_single_fill, original_multi_fill;