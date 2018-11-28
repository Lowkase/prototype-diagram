// ----------------------------------------------------------------------------------------------------
// VIEWS - MAPPING
// ----------------------------------------------------------------------------------------------------
"use strict";

var initMapping = function () {
    initMappingDraggable();
    initMappingDroppable();
};

// Drag - From
var initMappingDraggable = function () {
    $(".m-data-source-drag").draggable({
        revert: "invalid" ,
        appendTo: 'body',
        scroll: false,
        cursor: 'pointer',
        helper: "clone",
        start: function(event, ui) {},
        stop: function(event, ui) {}
    });
};

// Drop - To
var initMappingDroppable = function () {
    $('.m-property li .mapping').droppable( {
        accept: '.m-data-source-drag',
        drop: function(event, ui) {
            var dropContainer = $(this);
            var fromValue = ui.helper.context.textContent;

            if( dropContainer.html() ){
                // Show rules dialog
                dropModalSome(dropContainer, fromValue);
            } else {
                // Display single mapping in cell
                dropModalNone(dropContainer, fromValue);
            }
        }
    });
};

// Click - Mapping instance
$(document).on('click', '.m-property .mapping', function() {
    if( $(this).find(".m-mapped-property").length > 1 ){
        clickModal($(this));
    }
});


var loadPropertyList = function (object) {
    // Update the global selectedWindow variable so its seeded
    selectedWindow = object;

    // Remove all LI
    $(".m-property li").remove();

    // Build new LI
    var propertyHtml = "";

    // Build the property list for the object supplied
    for (var i=0; i < allObjects.length; i++) {

        // Only process the object that was passed
        if(object === allObjects[i][0]){

            // Get the property list from the object
            var propertyList = allObjects[i][4];

            // Build the list based on the propertlyList values
            for (var x=0; x < propertyList.length; x++) {
                propertyHtml = propertyHtml + "<li>";
                propertyHtml = propertyHtml + "    <div class='title'>" + propertyList[x] + "</div>";
                propertyHtml = propertyHtml + "    <div class='mapping'>" + loadMappedProperties(propertyList[x]) + "</div>";
                propertyHtml = propertyHtml + "</li>";
            }

            break;
        }
    }

    // Add new list to the property area
    $(".m-property").append(propertyHtml);

    // Update the properties title
    $(".active-properties-list").html(object);

    // Make all these new property items droppable
    initMappingDroppable();

    // Reset the source checks
    updateSourceChecks();
};


var loadMappedProperties = function (objectProperty) {
    // Get the window we want to work with
    var objectWindow = getObjectProperties();
    var html = "";

    // Ensure we have a window
    if(objectWindow != false){
        // Get the windowName
        var objectWindowName = objectWindow[0];

        // Get toProperty / fromProperty + fromProperty Name/Rules
        var objectPropRules = objectWindow[1];

        // Loop throuch each to / from data
        for (var i=0; i < objectPropRules.length; i++) {
            // Get toProperty
            var objectPropertyName = objectPropRules[i][0];

            // Get fromProperty + from Property rules array
            var objectPropertyFroms = objectPropRules[i][1];

            // Make sure we are going to spit out HTML for the objectProperty that was passed in
            if(objectProperty === objectPropertyName){
                // Loop through each from fromProperty + from Propery rules record
                for (var x=0; x < objectPropertyFroms.length; x++) {
                    // Build the property using the property name
                    html = html + "<div class='m-mapped-property' propertyrule='" + objectPropertyFroms[x][1] + "'>" + objectPropertyFroms[x][0] + "</div>";
                }
            }
        }
    }

    return html;
};


var loadSourceList = function () {
    // Remove all LI
    $(".m-data-source-list li").remove();

    // Build new LI
    var sourceHtml = "";

    // Build the list
    for (var i=0; i < importFile.length; i++) {
        sourceHtml = sourceHtml + "<li>";
        sourceHtml = sourceHtml + "    <div class='m-data-source-drag'>" + importFile[i] + "</div>";
        sourceHtml = sourceHtml + "    <i class='fa fa-check'></i>";
        sourceHtml = sourceHtml + "</li>";
    }

    // Add new list to the property area
    $(".m-data-source-list").append(sourceHtml);

    // Set these new items to draggable
    initMappingDraggable();
};



var getObjectProperties = function () {
    for(var i = 0; i < mappedProperties.length; i++) {
        if(mappedProperties[i][0] === selectedWindow) {
            return mappedProperties[i];
        }
    }
    return false;
};
