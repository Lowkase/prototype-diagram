// ----------------------------------------------------------------------------------------------------
// MODALS - ADD RELATIONSHIP
// ----------------------------------------------------------------------------------------------------
"use strict";

var modalEditConnectionId = null;
var persitedName = null;

// Click - Close modal
$(document).on('click', '.m-modal-edit-relationship .m-modal-close', function() {
    // Hide modal
    resetEditRelationshipModal();
    $(".m-modal-edit-relationship").hide();
});

// Click - Delete relationship from diagram
$(document).on('click', '.m-modal-edit-relationship .m-modal-delete', function() {
    // Get window names
    var fromNode = $("#" + selectedConn.sourceId ).find(".window-name").html();
    var toNode = $("#" + selectedConn.targetId ).find(".window-name").html();
    $(".m-modal-delete-rule-text").html("Delete connection from " + fromNode + " to " + toNode + "?");
    $(".m-modal-delete-rule").show();
});

// Click - Delete Apply
$(document).on('click', '.m-modal-delete-rule .m-modal-apply', function() {
    // Trash the connection
    instance.detach(selectedConn);

    // Find and delete relationship data
    for (var i=0; i < mappedRelationships.length; i++) {
        if(mappedRelationships[i][0] === modalEditConnectionId){
            mappedRelationships.splice(i, 1);
        }
    }

    // Hide modal
    resetEditRelationshipModal();
    $(".m-modal-delete-rule").hide();
    $(".m-modal-edit-relationship").hide();

});

// Click - Delete Close
$(document).on('click', '.m-modal-delete-rule .m-modal-close', function() {
     $(".m-modal-delete-rule").hide();
});

// Click - Apply
$(document).on('click', '.m-modal-edit-relationship .m-modal-apply', function() {

    // Strip values
    var endpointFrom = $(".m-modal-edit-relationship-endpoint-object-1").html();
    var endpointTo = $(".m-modal-edit-relationship-endpoint-object-2 option:selected").html();
    var relationshipName = $(".m-modal-edit-relationship-name").val();
    var relationshipClass = $(".m-modal-edit-relationship-class option:selected").html();
    var relationshipProcessing = $('input[name=m-modal-edit-relationship-processing-options]').filter(':checked').val();

    // Relationship name is required
    if(!relationshipName){
        $(".m-modal-edit-relationship-name-con > div").html("Required");
        $(".m-modal-edit-relationship-name-con > div").css("display", "inline-block");
        return false;        
    }

    // Check if relationship name already used
    if(isEditRelationshipNameExist(relationshipName) == true){
        $(".m-modal-edit-relationship-name-con > div").html("Name already exists");
        $(".m-modal-edit-relationship-name-con > div").css("display", "inline-block");
        return false;        
    }

    instance.detach(selectedConn);

    // Build toNode
    var fromNode = $(".window-name:contains('" + endpointFrom + "')")[0].parentNode.parentNode;
    var toNode = $(".window-name:contains('" + endpointTo + "')")[0].parentNode.parentNode;

    // Get remaining endpoints for each window
    var remainingEndpointsFrom = availableEndpoints(fromNode);
    var remainingEndpointsTo = availableEndpoints(toNode);

    // Make sure both windows have enough remaining endpoints
    if(remainingEndpointsFrom.length > 0 && remainingEndpointsTo.length > 0){

        // Build node names
        var fromNodeName =  endpointFrom + relationshipName + "From" + remainingEndpointsFrom[0];
        var toNodeName =  endpointTo - relationshipName + "To" + remainingEndpointsTo[0];

        // Build frome node
        var newSourceEndpoint = instance.addEndpoint(selectedNode, sourceEndpoint, { anchor: remainingEndpointsFrom[0], uuid: fromNodeName });

        // Build to node
        var newTargetEndpoint = instance.addEndpoint(toNode, targetEndpoint, { anchor: remainingEndpointsTo[0], uuid: toNodeName });

        // Disable dragging on end points
        newSourceEndpoint.setEnabled(false);
        newTargetEndpoint.setEnabled(false);

        // Build connector
        var builtConnector = instance.connect({uuids: [fromNodeName, toNodeName], editable: true, deleteEndpointsOnDetach: true});

        // Persist data
        for (var i=0; i < mappedRelationships.length; i++) {
            if(mappedRelationships[i][0] === modalEditConnectionId){
                mappedRelationships.splice(i, 1);
            }
        }
        mappedRelationships.push([builtConnector.id, relationshipName, relationshipClass, relationshipProcessing]);

        // Hide the modal
        resetEditRelationshipModal();
        $(".m-modal-edit-relationship").hide();
    } else {
        $(".m-modal-info-message-text").html("No endpoints available.  The maxium number of endpoints on an object is 8.");
        $(".m-modal-info-message").show();
    }
});


// Function - Build Dropdown Lists
function showModalEditRelationship(selectedConn) {
    // Get window names
    modalEditConnectionId = selectedConn.id;
    var fromNode = $("#" + selectedConn.sourceId ).find(".window-name").html();
    var toNode = $("#" + selectedConn.targetId ).find(".window-name").html();

    // Load object lists
    var windows = $(".window-name");

    // Clear out the options
    $(".m-modal-edit-relationship-endpoint-object-2 option").remove();

    // Show "from" node value
    $(".m-modal-edit-relationship-endpoint-object-1").html(fromNode);

    // Build options
    $( ".window-name" ).each(function() {
        if( $(this).html() !== fromNode ){
            $(".m-modal-edit-relationship-endpoint-object-2").append("<option>" + $(this).html() + "</option>");    
        }
    });

    // Find and load up relationship data
    for (var i=0; i < mappedRelationships.length; i++) {
        if(mappedRelationships[i][0] === modalEditConnectionId){
            $(".m-modal-edit-relationship-name").val(mappedRelationships[i][1]);
            $(".m-modal-edit-relationship-class option:contains('" + mappedRelationships[i][2] + "')").prop("selected", true);
            $("input[name=m-modal-edit-relationship-processing-options][value='" + mappedRelationships[i][3] + "']").attr('checked', 'checked');
            persitedName = mappedRelationships[i][1];
            //console.log(map =pedRelationships[i][1]);
            //console.log(mappedRelationships[i][2]);
            //console.log(mappedRelationships[i][3]);
        }
    }

    $(".m-modal-edit-relationship").show();
}


// Funciton -  Available Endpoints
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
function isEditRelationshipNameExist(relationshipName){
    for (var i=0; i < mappedRelationships.length; i++) {
        if(mappedRelationships[i][1] === relationshipName && mappedRelationships[i][1] !== persitedName){
            return true;
        }
    }
    return false;
}

// Funciton - reset the modal on exit
function resetEditRelationshipModal(){
    $(".m-modal-edit-relationship-name-con > div").css("display", "none");
}
