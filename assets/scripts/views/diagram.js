// ----------------------------------------------------------------------------------------------------
// VIEWS - DIAGRAM
// ----------------------------------------------------------------------------------------------------
"use strict";

// SETTINGS
// ----------------------------------------------------------------------------------------------------
var diagram_container                       = "jsplumb-con";
var diagram_grid                            = [20, 20];

var sourceEndPoint_colorStroke              = "#777";
var sourceEndPoint_colorFill                = "transparent";
var sourceEndPoint_radius                   = 5;
var sourceEndPoint_lineWidth                = 2;
var sourceEndPoint_shape                    = "Dot";
var sourceEndPoint_isSource                 = true;
var sourceEndpoint_connectorType            = "Flowchart";
var sourceEndpoint_stub                     = [40, 60];
var sourceEndpoint_gap                      = 10;
var sourceEndpoint_cornerRadius             = 5;
var sourceEndpoint_alwaysRespectStubs       = true;

var targetEndPoint_color                    = "#777";
var targetEndPoint_radius                   = 6;
var targetEndPoint_shape                    = "Dot";
var targetEndpoint_maxConnections           = -1;
var targetEndpoint_dropOptions_hoverClass   = "hover";
var targetEndpoint_dropOptions_activeClass  = "active";
var targetEndpoint_isTarget                 = true;

var endpointHover_fillColor                 = "#216477";
var endpointHover_strokeColor               = "#216477";

var connection_lineWidth                    = 4;
var connection_color                        = "#61B7CF";
var connection_joinStyle                    = "round";
var connection_outlineColor                 = "#fff";
var connection_outlineWidth                 = 2;
var connection_arrowPosition                = 1;
var connection_labelPosition                = 0.5;
var connection_labelId                      = "label";
var connection_labelCssClass                = "connection-action";

var connectionHover_lineWidth               = 4;
var connectionHover_color                   = "#216477";
var connectionHover_joinStyle               = "diamond";
var connectionHover_outlineColor            = "#fff";
var connectionHover_outlineWidth            = 2;

var connectionSelcted_Connector             = "StateMachine";

var drag_Cursor                             = "default";
var drag_zIndex                             = 2000;


// jsPlumb Instance
var instance = jsPlumb.getInstance({
    // Default drag options
    DragOptions: { cursor: drag_Cursor, zIndex: drag_zIndex },

    // Connection overlay elements
    ConnectionOverlays: [
        [ "Arrow", { location: connection_arrowPosition } ],
        [ "Label", { location: connection_labelPosition, id: connection_labelId, cssClass: connection_labelCssClass }]
    ],

    // Diagram container
    Container: diagram_container
});


// Connection
var connectorPaintStyle = { lineWidth: connection_lineWidth, strokeStyle: connection_color, joinstyle: connection_joinStyle, outlineColor: connection_outlineColor, outlineWidth: connectionHover_outlineWidth }
var connectorHoverStyle = { lineWidth: connectionHover_lineWidth, strokeStyle: connectionHover_color, joinstyle: connectionHover_joinStyle, outlineColor: connectionHover_outlineColor, outlineWidth: connectionHover_outlineWidth }
var endpointHoverStyle  = { fillStyle: endpointHover_fillColor, strokeStyle: endpointHover_strokeColor }


// Connection Hover
var connectionBasicType = {
    connector: connectionSelcted_Connector
};


// Source Endpoint
var sourceEndpoint = {
    endpoint: sourceEndPoint_shape,
    paintStyle: { strokeStyle: sourceEndPoint_colorStroke, fillStyle: sourceEndPoint_colorFill, radius: sourceEndPoint_radius, lineWidth: sourceEndPoint_lineWidth },
    isSource: sourceEndPoint_isSource,
    connector: [ sourceEndpoint_connectorType, { stub: sourceEndpoint_stub, gap: sourceEndpoint_gap, cornerRadius: sourceEndpoint_cornerRadius, alwaysRespectStubs: sourceEndpoint_alwaysRespectStubs } ],
    connectorStyle: connectorPaintStyle,
    hoverPaintStyle: endpointHoverStyle,
    connectorHoverStyle: connectorHoverStyle,
    dragOptions: {}
}


// Target Endpoint
var targetEndpoint = {
    endpoint: targetEndPoint_shape,
    paintStyle: { fillStyle: targetEndPoint_color, radius: targetEndPoint_radius },
    hoverPaintStyle: endpointHoverStyle,
    maxConnections: targetEndpoint_maxConnections,
    dropOptions: { hoverClass: targetEndpoint_dropOptions_hoverClass, activeClass: targetEndpoint_dropOptions_activeClass },
    isTarget: targetEndpoint_isTarget
}


// Init
var init = function (connection) {
    // Construct connection label element
    // connection.getOverlay("label").setLabel(connection.sourceId.substring(15) + "-" + connection.targetId.substring(15));
};


// Register Connection Type
instance.registerConnectionType("basic", connectionBasicType);


// Init (suspend drawing)
instance.batch(function () {

    // Make all the windows draggable
    instance.draggable(jsPlumb.getSelector(".m-diagram .window"), { grid: diagram_grid });

    // Listen for new connections, init them the same way we init connections at startup
    instance.bind("connection", function (connInfo, originalEvent) {
        init(connInfo.connection);
    });

    // Click event on connection
    instance.bind("click", function (conn, originalEvent) {
        conn.toggleType("basic");
        selectedConn = conn;
        showModalEditRelationship(selectedConn);
    });

    //instance.bind("connectionDrag", function (connection) {
    //    console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
    //});

    //instance.bind("connectionDragStop", function (connection) {
    //    console.log("connection " + connection.id + " was dragged");
    //});

    //instance.bind("connectionMoved", function (params) {
    //    console.log("connection " + params.connection.id + " was moved");
    //});
});


// Start the plumb
jsPlumb.fire("jsPlumbDemoLoaded", instance);




// EVENTS
// ----------------------------------------------------------------------------------------------------

// Mouseover - Flyout
$(".properties-list-menu-caret").on("mouseover", function () {
    $(".object-options").show();
});

// Mouseover - Flyout
$(".object-options").on("mouseover", function () {
    $(".object-options").show();
});

// Mouseleave - Flyout
$(".object-options").on("mouseleave", function () {
    $(".object-options").hide();
    $(".object-options-secondary").hide();
});

// Mouseover - Flyout Secondary
$("#object-options-create").on("mouseover", function () {
    $(".object-options-secondary").show();
});

// Mouseover - Flyout Secondary
$(".object-options li").not("#object-options-create").on("mouseover", function () {
    $(".object-options-secondary").hide();
});

// Mouseover - Flyout Secondary
$(".object-options-secondary").on("mouseover", function () {
    $(".object-options").show();
    $(".object-options-secondary").show();
});

// Mouseleave - Flyout Secondary
$(".object-options-secondary").on("mouseleave", function () {
    $(".object-options").hide();
    $(".object-options-secondary").hide();
});

// Click - Close Warning Modal
$(document).on('click', '.m-modal-info-message .m-modal-close', function() {
    // Hide modal
    $(".m-modal-info-message").hide();
});

// Click - Window
$(document).on('click', '.window', function() {
    // Save the selected node so we can use it for other events
    selectedWindow = $(this).attr("id");
    selectedItem = $(this).find(".window-name").html();
    windowSwitch();
});


// Click - Verify
$(document).on('click', '.nav-verify', function() {
    var notVerifiedCount = 0;

    $( ".m-data-source-drag" ).each(function( index ) {
        if( ! $(this).parent().children("i").hasClass("mapped") ){
            $(this).parent().addClass("not-verified");
            notVerifiedCount = notVerifiedCount + 1;
        }
    });

    if(notVerifiedCount > 0){
        // Update number not verified
        $(".verify-msg-objs").html(notVerifiedCount);        

        $(".verify-msg-fail").show();
    } else {
        $(".verify-msg-success").show();
    }

    $(".verify-msg").slideDown();  
});


// Click - Change Focal Checkbox
$(document).on('change', '#object-focal-checkbox', function() {
    windowSwitchFocal(selectedWindow);
});


// Need a funciton for is-window-active  on/off
function windowSwitch(){
    // Reset all window color states
    $(".window").each(function( index ) {
        // Get window name from each
        var windowName = $(this).find(".window-name").html();

        // Remove active classes
        $(this).removeClass("is-window-active");
        $(this).removeClass("is-window-focal-active");

        // Is this window the selected window?
        if(selectedItem === windowName ){
            // Is this the focal window?
            if( $(this).hasClass("is-window-focal") ){
                $(this).addClass("is-window-focal-active");
                $("#object-focal-checkbox").prop( "checked", true );
            } else {
                $(this).addClass("is-window-active");
                $("#object-focal-checkbox").prop( "checked", false );
            }
        }
    });

    // Rebuild the property list
    loadPropertyList(selectedItem);
}



function windowSwitchFocal(pWindow){
    if( $("#object-focal-checkbox").prop( "checked") == true ){
        windowInitFocal(pWindow);
        windowSwitch();

        // Update the Canvas Object List to show Focal color
        $(".m-object-canvas").removeClass("is-object-canvas-focal");
        var canvasObjectId = "canvas" + $(".window-name:contains('" + selectedWindow + "')").parent().parent().attr("id"); 
        $("#" + canvasObjectId).addClass("is-object-canvas-focal");
    } else {
       // Can't uncheck the focal
       $("#object-focal-checkbox").prop( "checked", true );
    }
}



function windowInitFocal(pWindow) {
    // Step each stored object
    for (var i=0; i < allObjects.length; i++) {
        // Set all persisted objects to focal false
        allObjects[i][3] = false;

        // If object is selected window
        if(pWindow === allObjects[i][0]){
            // Persist the focal object
            allObjects[i][3] = true;
        }
    }

    // Reset all window color states
    $(".window").each(function( index ) {
        $(this).removeClass("is-window-focal");
        $(this).removeClass("is-window-focal-active");

        if(pWindow === $(this).find(".window-name").html() ){
            $(this).addClass("is-window-focal");
            $(this).addClass("is-window-focal-active");
        }
    });
}






// FUNCTIONS
// ----------------------------------------------------------------------------------------------------
var initDiagram = function () {
    // Grab the focal object we identifed in the previous page
    selectedItem = localStorage.getItem('focalObject');

    // Add the new focal object window to the diagram at 60px/60px
    var windowId = addPlumbWindow( selectedItem, 60, 60, true );

    // Build corresponding canvas object in the canvas list
    buildCanvasObject( selectedItem, windowId, true );

    // Update property list
    loadPropertyList(selectedItem)

    // Init the drag/drop events for diagram elements
    initDiagramDragDrop();

    // Update focal object
    windowInitFocal(selectedItem);
    windowSwitch();
};

var initDiagramDragDrop = function () {
    // Data object drop
    $('.jsplumb-con').droppable( {
        accept: '.m-object-drag',
        drop: function(event, ui) {
            // Grab the Object name
            selectedItem = $(ui.helper.context.firstElementChild).html()

            // Get cursor x/y in jsplumb-con
            var x = event.pageX - $('.jsplumb-con').offset().left - 35;
            var y = event.pageY - $('.jsplumb-con').offset().top - 15;

            // Create the new window from dropped object
            var windowId = addPlumbWindow(selectedItem, x, y, false);

            // Build corresponding canvas object for the newly dropped object
            buildCanvasObject( selectedItem, windowId, false );

            // Update windowState
            windowSwitch();
        }
    });
};

// Function: Add Plumb Window
function addPlumbWindow(windowName, x, y, isFocal){
    // Get count of windows, increment by 1
    var windowCount = $(".jsplumb-con .window").length + 1;

    // Build new window HTML
    var windowHtml = "";
    windowHtml = windowHtml + "<div class='window";

    // Style focal window
    if(isFocal){
        windowHtml = windowHtml + " is-window-focal' ";
    } else {
        windowHtml = windowHtml + "' ";
    }

    // Finish new window build
    windowHtml = windowHtml + "style='top:" + y + "px; left:" + x + "px;' id='flowchartWindow" + windowCount + "'>";
    windowHtml += "<div><div class='window-name'>" + windowName + "</div><i class='fa fa-plus-circle m-diagram-add-realationship'></i></div>";
    windowHtml += "</div>";

    // Append new window to diagram
    $('.jsplumb-con').append(windowHtml);

    instance.draggable(jsPlumb.getSelector(".m-diagram .window"), { grid: [20, 20] });
    instance.bind("connection", function (connInfo, originalEvent) {
        init(connInfo.connection);
    });

    return "flowchartWindow" + windowCount;
}