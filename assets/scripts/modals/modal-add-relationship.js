// ----------------------------------------------------------------------------------------------------
// MODALS - ADD RELATIONSHIP
// ----------------------------------------------------------------------------------------------------
"use strict";

// Click - Add Relationship (from Window in Diagram)
$(document).on('click', '.m-diagram-add-realationship', function() {
    if( countCanvasObjects < 2 ){
        $(".m-modal-info-message-text").html("Only one object on the diagram, please add at least on more object before attempting to create a relationship.");
        $(".m-modal-info-message").show();
        return false;
    }

    // Save the selected node so we can use it for modal events
    selectedNode = $(this)[0].parentNode.parentNode;

    // Load object lists
    var windows = $(".window-name");

    // Clear out the options
    $(".m-modal-add-relationship-endpoint-object-2 option").remove();

    // Show "from" node value
    var fromNode = $(this).parent().parent().find(".window-name").html();
    $(".m-modal-add-relationship-endpoint-object-1").html(fromNode);

    // Build options
    $( ".window-name" ).each(function() {
        if( $(this).html() !== fromNode ){
            $(".m-modal-add-relationship-endpoint-object-2").append("<option>" + $(this).html() + "</option>");    
        }
    });

    // Show modal
    $(".m-modal-add-relationship").show();
});


// Click - Close Modal
$(document).on('click', '.m-modal-add-relationship .m-modal-close', function() {
    // Hide modal
    resetAddRelationshipModal();
    $(".m-modal-add-relationship").hide();
});


// Click - Apply
$(document).on('click', '.m-modal-add-relationship .m-modal-apply', function() {
    // Strip values
    var endpointFrom = $(".m-modal-add-relationship-endpoint-object-1").html();
    var endpointTo = $(".m-modal-add-relationship-endpoint-object-2 option:selected").html();
    var relationshipName = $(".m-modal-add-relationship-name").val();
    var relationshipClass = $(".m-modal-add-relationship-class option:selected").html();
    var relationshipProcessing = $('input[name=m-modal-add-relationship-processing-options]').filter(':checked').val();

    // Relationship name is required
    if(!relationshipName){
        $(".m-modal-add-relationship-name-con > div").html("Required");
        $(".m-modal-add-relationship-name-con > div").css("display", "inline-block");
        return false;        
    }

    // Check if relationship name already used
    if(isAddRelationshipNameExist(relationshipName)){
        $(".m-modal-add-relationship-name-con > div").html("Name already exists");
        $(".m-modal-add-relationship-name-con > div").css("display", "inline-block");
        return false;        
    }

    // Build toNode
    var toNode = $(".window-name:contains('" + endpointTo + "')")[0].parentNode.parentNode;

    // Get remaining endpoints for each window
    var remainingEndpointsFrom = availableEndpoints( selectedNode );
    var remainingEndpointsTo = availableEndpoints(toNode);

    // Make sure both windows have enough remaining endpoints
    if(remainingEndpointsFrom.length > 0 && remainingEndpointsTo.length > 0){
        // Build node names
        var fromNodeName =  endpointFrom + relationshipName + "From" + remainingEndpointsFrom[0];
        var toNodeName =  endpointTo - relationshipName + "To" + remainingEndpointsTo[0];

        // Build from node
        var newSourceEndpoint = instance.addEndpoint(selectedNode, sourceEndpoint, { anchor: remainingEndpointsFrom[0], uuid: fromNodeName });

        // Build to node
        var newTargetEndpoint = instance.addEndpoint(toNode, targetEndpoint, { anchor: remainingEndpointsTo[0], uuid: toNodeName });

        // Disable dragging on end points
        newSourceEndpoint.setEnabled(false);
        newTargetEndpoint.setEnabled(false);

        // Build connector
        var builtConnector = instance.connect({uuids: [fromNodeName, toNodeName], editable: true, deleteEndpointsOnDetach: true});

        // Persist data
        mappedRelationships.push([builtConnector.id, relationshipName, relationshipClass, relationshipProcessing]);

        // Hide the modal
        resetAddRelationshipModal();
        $(".m-modal-add-relationship").hide();
    } else {
        $(".m-modal-info-message-text").html("No endpoints available.  The maxium number of endpoints on an object is 8.");
        $(".m-modal-info-message").show();
    }

});

// Funciton - Available Endpoints
function availableEndpoints(parentnode){
    var endpoints = instance.getEndpoints( parentnode );
    //console.log(endpoints[0].anchor.type);
    //console.log(endpoints);

    // Define all endpoint types in an array
    var remainingEndpoints = ["Right", "Left", "Top", "Bottom", "TopRight", "BottomRight", "TopLeft", "BottomLeft"];

    if(typeof endpoints !== 'undefined'){
        // Loop through all endpoints
        for (var i=0; i < endpoints.length; i++) {
            var remainingEndpointIndex = remainingEndpoints.indexOf(endpoints[i].anchor.type);
            remainingEndpoints.splice(remainingEndpointIndex, 1);
            //console.log(endpoints[i].anchor.type)
        }
    }

    //console.log(remainingEndpoints);
    return remainingEndpoints;
}

// Function - IsRelationshipNameExist
function isAddRelationshipNameExist(relationshipName){
    for (var i=0; i < mappedRelationships.length; i++) {
        if(mappedRelationships[i][1] === relationshipName){
            return true;
        }
    }
    return false;
}

// Function - Reset Add Modal
function resetAddRelationshipModal(){
    $(".m-modal-add-relationship-name").val("");
    $('.m-modal-add-relationship-class option:eq(0)').prop('selected', true);
    $('#m-modal-add-relationship-default-radio').prop('checked', true);
    $(".m-modal-add-relationship-name-con > div").css("display", "none");
}
