// ----------------------------------------------------------------------------------------------------
// VIEWS - OBJECTS
// ----------------------------------------------------------------------------------------------------
"use strict";

// Init - Objects
var initObjects = function () {
    // Build Hardware Class Objects
    for (var i=0; i < allObjects.length; i++) {
        if( allObjects[i][2] === "hardware" ){
            $(".hardware-list .m-object").append( buildObject( allObjects[i], true ) );
            countHardwareObjects = countHardwareObjects + 1;
        }
    }
    $(".counter-hardware-objects").html(countHardwareObjects);

    // Build All Objects
    for (var i=0; i < allObjects.length; i++) {
        $(".all-objects-list .m-object").append( buildObject( allObjects[i], true ) );
    }

    // Init the drag drop events
    initObjectDraggable();
};


// Init - Object Draggable
var initObjectDraggable = function () {
    // Data object drag
    $(".m-object-drag").draggable({
        revert: "invalid" ,
        appendTo: 'body',
        scroll: false,
        cursor: 'pointer',
        helper: "clone",
        start: function(event, ui) {
            //console.log("start - drag");
        },

        stop: function(event, ui) {
            //console.log("stop - drag");
        }
    });
};


// Click - Delete Canvas Object
$(document).on('click', '.m-delete-window', function() {
    // Get canvas object
    var canvasId = $(this).parent().attr("id");

    // Get Id of window
    var windowId = canvasId.substring(6);

    // Remove window from the diagram
    instance.remove(windowId);

    // Remove canvas object
    $(this).parent().remove();

    // Update the global countCanvasObjects
    countCanvasObjects = countCanvasObjects - 1;
    $(".counter-canvas-objects").html(countCanvasObjects);

    // Empty the property list
    loadPropertyList(null);
});


// Function - Build Canvas Object
var buildCanvasObject = function (objectName, windowId, isFocal) {
    for (var i=0; i < allObjects.length; i++) {
        if( objectName === allObjects[i][0] ){
            $(".object-list .m-object").append( buildObject( allObjects[i], false, windowId, isFocal ) );
            break;
        }
    }

    // Update the global countCanvasObjects
    countCanvasObjects = countCanvasObjects + 1;
    $(".counter-canvas-objects").html(countCanvasObjects);
};


// Function - Build Object
var buildObject = function (object, isDraggable, windowId, isFocal) {
    var html = "";

    if(isDraggable){
        html = html +   "<li class='m-object-drag'>";
    } else {
        if(isFocal){
            html = html +   "<li class='m-object-canvas is-object-canvas-focal' id='canvas" + windowId + "'>";
        } else {
            html = html +   "<li class='m-object-canvas' id='canvas" + windowId + "'>";    
        }      
    }
    
    html = html +       "<div class='title'>" + object[0] + "</div>";
    html = html +       "<div class='description'>" + object[1] + "</div>";

    if(!isDraggable){
        html = html +   "<div class='fa fa-times-circle m-delete-window'></div>";
    }
    
    html = html +   "</li>";

    return html;
};