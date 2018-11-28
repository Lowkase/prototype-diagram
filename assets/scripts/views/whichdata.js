// ----------------------------------------------------------------------------------------------------
// VIEWS - WHICH DATA
// ----------------------------------------------------------------------------------------------------
"use strict";

// Build focal object dropdown
buildFocalObjectDropdown();

// Click - Select Asset 
$(document).on('click', '.select-asset li', function() {
    // Update asset menu
    $(".select-asset li").removeClass("active");
    $(this).addClass("active");

    // Hide all sections
    $(".details").hide();
    $(".focal-object").hide();
    $(".continue").hide();

    // Reset all remaining sections
    $(".details input").prop('checked', false);

    // Show details sections
    $(".details").fadeIn();
});


// Click - Details Check Radio Button
$(document).on('click', '.details input', function() {
    // Hide remaining sections
    $(".focal-object").hide();
    $(".continue").hide();

    // Show focal object section
    $(".focal-object").fadeIn();
    $(".continue").fadeIn();
});


// Change - Focal Object list
$(document).on('change', '.focal-object-list', function() {
    // Update the focal object
    selectedItem = $(this).find(":selected").text();
});


// Click - Continue
$(document).on('click', '.m-btn-continue', function() {
    // Save focal object to local storage so we can retreive them when we are in designstudio.html
    localStorage.setItem('focalObject', selectedItem );

    // Redirect to design studio
    window.location.href='diagram.html';
});


// Function - Build the default focal oject dropdown
function buildFocalObjectDropdown(){
    for (var i=0; i < allObjects.length; i++) {
        if(i == 0){
            selectedItem = allObjects[i][0];
        }
        $("#focal-object-list").append( "<option>" + allObjects[i][0] + "</option>" );
    } 
}