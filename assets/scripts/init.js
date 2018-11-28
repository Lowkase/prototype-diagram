// ----------------------------------------------------------------------------------------------------
// INIT
// ----------------------------------------------------------------------------------------------------
"use strict";

// Global Declarations
var selectedWindow = null;
var selectedNode = null;
var selectedConn = null;
var selectedItem = "";
var countCanvasObjects = 0;
var countHardwareObjects = 0;


// All Objects
// 0 - Name
// 1 - Description
// 2 - Type
// 3 - isFocal
// 4 - Properties
var allObjects = [
    ['Computer Asset', 'Computer Asset Description', 'info', false, 
        ['Record Id', 'Display Name', 'Asset Tag', 'Serial Number', 'Description', 'Life Cycle Status', 'Life Cycle Changed By', 'Life Cycle Change Notes', 'Life Cycle Status Change Date', 'Received Date', 'Planned Refresh Date', 'Last Scanned Date', 'Last Verified Date', 'Last Discovered Date',  'Type', 'Cost', 'Cost Currency', 'Cost Currency', 'Ownership Type', 'Ownership Type']
    ],
    ['Location', 'Location Description', 'info', false,
        ['ID', 'Display Name', 'Nickname', 'Description', 'Status', 'Object Status', 'Asset Status', 'Address', 'City', 'Country', 'E-mail', 'Phone Number', 'State', 'Zip Code', 'Show on Scanner', 'Bar Code', 'Type', 'Ownership Type']
    ],
    ['Purchase Order', 'Purchase Order Description', 'info', false,
        ['Purchase Order Number', 'Life Cycle', 'Type', 'Reference', 'Notes', 'Authorization Limit', 'Currency', 'Shipping Amount Currency', 'Adjustment Amount Currency', 'Purchase Order Date', 'Approved Date', 'Fulfilled Date', 'Date Required', 'Type', 'Bill To', 'Ship To', 'Same as Billing', 'Shipping Instructions', 'Payment Terms', 'Nickname', 'Adjustment Reason', 'Tax Rate', 'Shipping', 'Description', 'Adjustments']
    ],
    ['Purchase Order Line Item', 'Purchase Order Line Item Description', 'info', false,
        ['ID', 'Display Name', 'Product Type', 'Status', 'Object Status', 'Asset Status', 'Price', 'Currency', 'Quantity', 'Adjustment Reason', 'Last Changed Date', 'Product Number', 'Product Name', 'Taxable', 'Created on Approval', 'Total Price', 'Currency for the Total Price', 'Nickname', 'Notes', 'Adjustment Reason', 'Tax Rate', 'Shipping', 'Description', 'Adjustments']
    ]

];

/*
    ['General Asset', 'General Asset Description', 'info', false,
        ['ID', 'Asset ID', 'Life Cycle', 'Last Scanned Date', 'Last Verified Date', 'Received Date', 'Return/Disposal Date', 'Serial Number', 'Cost', 'Cost ISO Currency Code', 'Description', 'Designated Use', 'Life Cycle Change Date', 'Life Cycle Change Notes', 'Life Cycle Changed By', 'Nickname', 'Ownership Type', 'Readiness Status', 'Type', 'Object Status', 'Asset Status', 'Notes', 'Display Name'] 
    ],
    ['Warranty Agreement', 'Warranty Agreement Description', 'info', false,
        ['ID', 'Duration', 'Duration Unit', 'Cost', 'Cost ISO Currency Code', 'Nickname', 'Description', 'Life Cycle', 'Life Cycle Change Date', 'Life Cycle Change Notes', 'Life Cycle Changed By', 'Terms and Conditions', 'Object Status', 'Asset Status', 'Notes', 'Display Name',]
    ],
    ['Hardware Catalog - Serialized', 'Hardware Catalog Serialized Description', 'hardware', false,
        ['ID', 'Manufacturer Part Number', 'Refresh Cycle Duration', 'Refresh Cycle Duration Unit', 'Supplier Part Number', 'Cost', 'Cost ISO Currency Code', 'Description', 'Image', 'Last Updated', 'Nickname', 'Status', 'Type', 'Object Status', 'Asset Status', 'Notes', 'Display Name']
    ],
    ['Hardware Catalog - Non-serialized', 'Hardware Catalog Non-Serialized Description', 'hardware', false,
        ['ID', 'Manufacturer Part Number', 'Supplier Part Number', 'Cost', 'Cost ISO Currency Code', 'Description', 'Image', 'Last Updated', 'Nickname', 'Status', 'Type', 'Object Status', 'Asset Status', 'Notes', 'Display Name']
    ],
    ['Hardware Cost Event', 'Hardware Cost Event Description', 'hardware', false,
        ['ID', 'Type', 'Amount', 'Amount ISO Currency Code', 'Description', 'Effective Date', 'Life Cycle', 'Nickname', 'Reference', 'Object Status', 'Asset Status', 'Notes', 'Display Name']
    ]
*/

// Persist mapped properties on objects for prototye session
// 0 - modalRules_window
// 1 - [toProp, [fromProp, rule]] = toFrom array
// * [fromProp, rule] = fromPropRule array
var mappedProperties = [];


// Persist mappaed relationships
// 0 - connector id
// 1 - relationship name
// 2 - class
// 3 - processing option
var mappedRelationships = [];


// Defalut import file
var importFile = [ 'AssetTag', 'SerialNumber', 'Model', 'Manufacturer', 'ShipDate', 'ClassType', 'Cost', 'CostCurrency', 'PONumber', 'PODate', 'POLIQTY', 'POLIName', 'POLIAmount', 'MadeModel', 'Location', 'Warranty' ];


// Start the app from here
var startApp = function () {
    initDiagram();
    initObjects();
    initMapping();
};