// ----------------------------------------------------------------------------------------------------
// MODALs - UPLOAD
// ----------------------------------------------------------------------------------------------------
"use strict";

// Click - Open Modal
$(document).on('click', '.m-data-source-placeholder', function() {
    $(".m-modal-upload").show();
});


// Click - Close Modal
$(document).on('click', '.m-modal-upload .m-modal-close', function() {
    // Hide modal
    $(".m-modal-upload").hide();
});


// CLick - Upload File
$(document).on('click', '.m-modal-upload .m-modal-upload', function() {
    $(".data-list-placeholder").hide();
    $(".m-modal-upload").hide();

	// Load the source list
	loadSourceList();

    $(".data-list").fadeIn();
    $(".nav-verify").show();
});