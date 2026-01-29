/**
 * Google Apps Script for RESONANCE Festival Registration
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Replace the default code with this entire file
 * 4. Save the project
 * 5. Click "Deploy" > "New deployment"
 * 6. Choose "Web app"
 * 7. Set "Execute as" to "Me" 
 * 8. Set "Who has access" to "Anyone"
 * 9. Click "Deploy"
 * 10. Copy the Web app URL and update it in your code
 */

// Sheet names - create these sheets in your Google Sheet
const SHEET_NAMES = {
  REGISTRATIONS: 'Registrations',
  TEAM_MEMBERS: 'TeamMembers',
  AUDITIONS: 'Auditions'
};

// Initialize sheets when script is first run
function initializeSheets() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Create sheets if they don't exist
  Object.values(SHEET_NAMES).forEach(sheetName => {
    if (!spreadsheet.getSheetByName(sheetName)) {
      const sheet = spreadsheet.insertSheet(sheetName);
      
      // Add headers based on sheet type
      if (sheetName === SHEET_NAMES.REGISTRATIONS) {
        sheet.getRange(1, 1, 1, 16).setValues([[
          'Name', 'Email', 'Phone', 'College', 'Branch', 'Year', 
          'Event ID', 'Event Name', 'Registration Type', 'Team Name', 
          'Team Size', 'Entry Fee', 'Payment ID', 'Payment Status', 
          'Created At', 'Timestamp'
        ]]);
        sheet.autoResizeColumns(1, 16);
      } else if (sheetName === SHEET_NAMES.TEAM_MEMBERS) {
        sheet.getRange(1, 1, 1, 7).setValues([[
          'Registration ID', 'Name', 'Email', 'Phone', 'Branch', 'Year', 'Role'
        ]]);
        sheet.autoResizeColumns(1, 7);
      } else if (sheetName === SHEET_NAMES.AUDITIONS) {
        sheet.getRange(1, 1, 1, 8).setValues([[
          'Name', 'Email', 'Phone', 'College', 'Branch', 'Year', 
          'Audition Type', 'Timestamp'
        ]]);
        sheet.autoResizeColumns(1, 8);
      }
    }
  });
}

// Main function to handle web requests with CORS support
function doPost(e) {
  try {
    // Initialize sheets if needed
    initializeSheets();
    
    // Handle CORS preflight request
    if (!e.postData || !e.postData.contents) {
      return createCORSResponse({
        status: 'error',
        message: 'No data received'
      });
    }
    
    const data = JSON.parse(e.postData.contents);
    console.log('Received data:', data);
    
    let result;
    
    switch (data.type) {
      case 'registration':
        result = handleRegistration(data);
        break;
      case 'team_members':
        result = handleTeamMembers(data);
        break;
      case 'audition':
        result = handleAudition(data);
        break;
      case 'test':
        result = { status: 'success', message: 'Test connection successful!' };
        break;
      default:
        result = { status: 'error', message: 'Unknown data type: ' + data.type };
    }
    
    console.log('Result:', result);
    return createCORSResponse(result);
      
  } catch (error) {
    console.error('Error in doPost:', error);
    return createCORSResponse({
      status: 'error',
      message: error.toString(),
      stack: error.stack
    });
  }
}

// Handle OPTIONS requests for CORS
function doOptions(e) {
  return createCORSResponse({ status: 'success', message: 'CORS preflight successful' });
}

// Create CORS-enabled response
function createCORSResponse(data) {
  const response = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  
  // Add CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  return response;
}

// Handle registration data
function handleRegistration(data) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.REGISTRATIONS);
    
    if (!sheet) {
      throw new Error('Registrations sheet not found');
    }
    
    // Add timestamp if not included
    const rowData = data.data || [];
    if (rowData.length > 0 && rowData[rowData.length - 1] !== new Date().toLocaleString()) {
      rowData.push(new Date().toLocaleString());
    }
    
    // Add row to sheet
    sheet.appendRow(rowData);
    
    return {
      status: 'success',
      message: 'Registration added successfully',
      rowCount: sheet.getLastRow()
    };
    
  } catch (error) {
    console.error('Error handling registration:', error);
    return {
      status: 'error',
      message: error.toString()
    };
  }
}

// Handle team members data
function handleTeamMembers(data) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.TEAM_MEMBERS);
    
    if (!sheet) {
      throw new Error('TeamMembers sheet not found');
    }
    
    const rowsData = data.data || [];
    
    // Add each team member as a new row
    rowsData.forEach(rowData => {
      sheet.appendRow(rowData);
    });
    
    return {
      status: 'success',
      message: `${rowsData.length} team members added successfully`,
      rowCount: sheet.getLastRow()
    };
    
  } catch (error) {
    console.error('Error handling team members:', error);
    return {
      status: 'error',
      message: error.toString()
    };
  }
}

// Handle audition data
function handleAudition(data) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.AUDITIONS);
    
    if (!sheet) {
      throw new Error('Auditions sheet not found');
    }
    
    const rowData = data.data || [];
    
    // Add timestamp if not included
    if (rowData.length > 0 && rowData[rowData.length - 1] !== new Date().toLocaleString()) {
      rowData.push(new Date().toLocaleString());
    }
    
    // Add row to sheet
    sheet.appendRow(rowData);
    
    return {
      status: 'success',
      message: 'Audition registration added successfully',
      rowCount: sheet.getLastRow()
    };
    
  } catch (error) {
    console.error('Error handling audition:', error);
    return {
      status: 'error',
      message: error.toString()
    };
  }
}

// Test function - run this to test the script
function testFunction() {
  try {
    const result = handleRegistration({
      data: [
        'Test User', 'test@example.com', '1234567890', 'Test College', 
        'CS', '3', 'test-event', 'Test Event', 'solo', '', 1, 100, 
        'test-payment', 'success', new Date().toLocaleString()
      ]
    });
    
    console.log('Test result:', result);
    return result;
    
  } catch (error) {
    console.error('Test error:', error);
    return { status: 'error', message: error.toString() };
  }
}

// Helper function to get sheet URL (for debugging)
function getSheetUrl() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getUrl();
}

// Helper function to list all sheets
function listSheets() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = spreadsheet.getSheets();
  return sheets.map(sheet => sheet.getName());
}
