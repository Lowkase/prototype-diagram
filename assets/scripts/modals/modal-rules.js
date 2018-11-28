// ----------------------------------------------------------------------------------------------------
// MODALs - RULES
// ----------------------------------------------------------------------------------------------------
"use strict";

var modalRules_window = null;
var modalRules_dropContainer = null;
var modalRules_toValue = null;
var modalRules_fromValue = null;

var modalFromDrop = true;

// Close
$(document).on('click', '.m-modal-rules .m-modal-close', function() {
	removeAllRules();
    $(".m-modal-rules").hide();
});

// Apply
$(document).on('click', '.m-modal-rules .m-modal-apply', function() {
	rebuildPropertyList()
	storeMappings();
	updateSourceChecks();
	removeAllRules();
    $(".m-modal-rules").hide();
});

// Delete Rule
$(document).on('click', '.m-modal-rules .m-modal-rules-delete', function() {
	$(this).parent().remove();
});




// Drop None
var dropModalNone = function(dropContainer, fromValue) {
	setSelectedWindow()
	modalRules_toValue = dropContainer.parent().children(".title").html();
    buildProperty(dropContainer, fromValue, '');
    storeMappings();
	updateSourceChecks();
}

// Drop Some
var dropModalSome = function(dropContainer, fromValue) {
	modalFromDrop = true;
	setSelectedWindow()
	modalRules_dropContainer = dropContainer;
	modalRules_toValue = dropContainer.parent().children(".title").html();
	modalRules_fromValue = fromValue;
	loadRules(true);
    $(".m-modal-rules").show();
}

// Click
var clickModal = function(dropContainer){
	modalFromDrop = false;
	setSelectedWindow()
	modalRules_dropContainer = dropContainer;
	modalRules_toValue = dropContainer.parent().children(".title").html();
	loadRules(false);
    $(".m-modal-rules").show();
}




// Build Property
var buildProperty = function(dropContainer, fromValue, rule){
 	dropContainer.append( "<div class='m-mapped-property' propertyrule='" + rule + "'>" + fromValue + "</div>" );
}

// Rebuild Property List
var rebuildPropertyList = function(){
 	// Remove all mapped properties from the drop container, we will rebuid it from the rules list
 	modalRules_dropContainer.children(".m-mapped-property").remove();

	$('.m-rule-list li').each(function( index ) {
		var html = "";
		var property = $(this).children(".property").html();
		var rule = $(this).find(".m-rules-select :selected").text();
		html = html + "<div class='m-mapped-property' propertyrule='" + rule + "'>" + property + "</div>";
		modalRules_dropContainer.append(html);
	});
}




// Load Rules
var loadRules = function (fromDrop) {
	// Use all properties in the drop container to build out the rules dialog
	modalRules_dropContainer.children(".m-mapped-property").each(function( index ) {
		//console.log( $(this).html() );
		$(".m-rule-list").append( buildRule( $(this).html(), $(this).attr("propertyrule"), index ) );
	});

	// Add the dropped property if the event to trigger was drop
	if(fromDrop == true){
		//console.log( modalRules_fromValue );
		$(".m-rule-list").append( buildRule( modalRules_fromValue, "", 999 ) );
	}
};

// Build Rule
var buildRule = function (property, rule, index) {
	var html = "";

	html = html + "<li>";
	html = html + "		<div class='m-modal-rules-delete'><i class='fa fa-times-circle'></i></div>";
	html = html + "		<div class='property'>" + property + "</div>";
	html = html + "		<div class='rule'>";

	if( index > 0 ){
		html = html + "		<select class='m-rules-select'>";

		if(rule === "Concatenate")	{ html = html + "<option selected>Concatenate</option>"; } 	else { html = html + "<option>Concatenate</option>"; }
		if(rule === "Copy")			{ html = html + "<option selected>Copy</option>"; } 		else { html = html + "<option>Copy</option>"; }
		if(rule === "Split")		{ html = html + "<option selected>Split</option>"; } 		else { html = html + "<option>Split</option>"; }
		if(rule === "Substring")	{ html = html + "<option selected>Substring</option>"; } 	else { html = html + "<option>Substring</option>"; }		
		if(rule === "Value")		{ html = html + "<option selected>Value</option>"; } 		else { html = html + "<option>Value</option>"; }		

		html = html + "		</select>";
	}

	html = html + "		</div>"
	html = html + "</li>";

	return html;
};

// Remove All Rules
var removeAllRules = function (){
	$(".m-rule-list li").remove();
};




// Function - Store mappings for object
var storeMappings = function () {

	// Persist mapped properties on objects for prototye session
	// 0 - modalRules_window
	// 1 - [toProp, [fromProp, rule]] = toFrom array
	// * [fromProp, rule] = fromPropRule array

	var toFrom = []; 

	// Gather all properties LI from the properties list
	$( ".m-property li" ).each(function( index ) {
		// Extract title, mapping html from window property list
		var title = $(this).children(".title").html();
		var mapping = $(this).children(".mapping");

		// Store only if mapping exists
		if( mapping ){
			// Reset array
			var fromPropRule = [];

			// Go through all mapping values
			mapping.children(".m-mapped-property").each(function( index ) {
				// Grab the mapping
				var mappedProp = $(this).html();

				// Grab the property rule
				var mappedRule = $(this).attr("propertyrule");

				// Add mapping + rule to array
				fromPropRule.push([mappedProp, mappedRule]);
			});

			// Only save the froms and rules if they were saved to the array
			if(fromPropRule.length > 0){
				toFrom.push([title, fromPropRule]);
			}
		}
	});

	// Remove the window properties entry from mappedProperties, we just rebuilt the entry and will push it
	removeWindowProperties();

	// Push window to / from-rule information
	mappedProperties.push( [modalRules_window, toFrom] );
	//console.log(mappedProperties);
};




// Update Source Checks
var updateSourceChecks = function () {
	//var windowProperties = getWindowProperties();
	var froms = [];

	// Reset all checks
    $(".verify-msg-fail").hide();
    $(".verify-msg-success").hide();
    $(".verify-msg").hide();  
	$(".m-data-source-list li .fa").removeClass("mapped");
	$(".m-data-source-list li").removeClass("not-verified");

    // Loop through all windows
	for (var a=0; a < mappedProperties.length; a++) {
		var objectWindow = mappedProperties[a];

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

 			// Loop through each from fromProperty + from Propery rules record
            for (var x=0; x < objectPropertyFroms.length; x++) {
				// Store property name in the froms array
				froms.push( objectPropertyFroms[x][0] );
            }
        }
    }

	// Step each source property and determine if its in the froms list, if it is check it green
	$( ".m-data-source-drag" ).each(function( index ) {
		var sourcePropObject = $(this);
		var sourcePropValue = $(this).text();

		// Loop through all froms
		for(var i = 0; i < froms.length; i++) {
			if(froms[i] === sourcePropValue){
				sourcePropObject.parent().children("i").addClass("mapped");
				break;
			}
		}
	});
};




var setSelectedWindow = function () {
	modalRules_window = selectedWindow;	
};

var getWindowProperties = function () {
    for(var i = 0; i < mappedProperties.length; i++) {
        if(mappedProperties[i][0] === modalRules_window) {
            return mappedProperties[i];
        }
    }   
};

var removeWindowProperties = function() {
    for(var i = 0; i < mappedProperties.length; i++) {
        if(mappedProperties[i][0] === modalRules_window) {
            mappedProperties.splice(i, 1);
            break;
        }
    }   
};
