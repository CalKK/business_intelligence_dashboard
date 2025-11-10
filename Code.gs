// 1. Get your folder ID (the folder that will hold the .csv files)
const FOLDER_ID = "";

// 2. Get your central sheet ID (your "database" sheet)
const CENTRAL_SHEET_ID = "";

// 3. The name of the tab in your central sheet (e.g., "Sheet1")
const SHEET_NAME = "";

// 4. Define the exact headers and order of your Central Sheet
// Define the exact headers and order of your Central Sheet
const MASTER_HEADERS = [];

/*PART 1: THE DATA PIPELINE (ETL for CSV)*/

/* Main function to run the entire ETL process (CSV).*/
function runDataPipeline_CSV() {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const csvFiles = folder.getFilesByType(MimeType.CSV); 
  
  let allData = []; // To store data from all files

  Logger.log("--- STARTING FINAL PIPELINE ---");

  while (csvFiles.hasNext()) {
    const file = csvFiles.next();
    Logger.log("Processing CSV file: " + file.getName());
    
    const csvString = file.getBlob().getDataAsString();
    if (!csvString) {
      Logger.log("Skipping empty file: " + file.getName());
      continue; 
    }
    
    const parsedData = Utilities.parseCsv(csvString);
    if (parsedData.length < 2) { 
      Logger.log("Skipping file: Not enough rows.");
      continue; 
    }

    // Find the real header row 
    let headerRowIndex = -1;
    let csvHeaders = [];
    
    // We know from the log the header is at Row 4, but we'll search just in case
    const searchLimit = Math.min(10, parsedData.length); 

    for (let i = 0; i < searchLimit; i++) {
      const row = parsedData[i];
      const rowString = row.join(",").toUpperCase(); // Join all cells into one string

      // Check if this single string contains all our key headers
      // We use our corrected MASTER_HEADERS variable to check
      if (rowString.includes("") && 
          rowString.includes("") &&
          rowString.includes("")) { 
        
        // This is the header row
        headerRowIndex = i;
        csvHeaders = parsedData[i]; // Get the original headers
        Logger.log("SUCCESS: Found real header row at index " + i);
        break; // Stop searching
      }
    }
    //  END HEADER SEARCH 

    // Check if we ever found the header row
    if (headerRowIndex === -1) {
      Logger.log("!!! ERROR: Could not find header row in file: " + file.getName() + ". Skipping file.");
      continue; // Go to the next file
    }

    // 2. Create the "map"
    const headerMap = {};
    csvHeaders.forEach((header, index) => {
      headerMap[header.trim().toUpperCase()] = index; 
    });

    // 3. Extract the data rows
    const dataRows = parsedData.slice(headerRowIndex + 1);

    if (dataRows.length === 0) {
        Logger.log("File has headers but no data rows. Skipping.");
        continue;
    }

    // 4. Loop through each data row and re-order it
    dataRows.forEach(row => {
      // Skip any blank rows (like rows 1-3)
      if (!row || row.length < 2 || row[0].trim() === "") {
         return; 
      }
      
      const newOrderedRow = [];
      MASTER_HEADERS.forEach(masterHeader => {
        // masterHeader will be e.g. "" (all caps)
        const csvIndex = headerMap[masterHeader]; 
        
        if (csvIndex !== undefined && row[csvIndex] !== undefined) {
          newOrderedRow.push(row[csvIndex]);
        } else {
          newOrderedRow.push(""); 
        }
      });
      allData.push(newOrderedRow);
    });
  }

  // 5. LOAD: Overwrite the central sheet
  if (allData.length > 0) {
    Logger.log("Found " + allData.length + " total data rows to write.");
    overwriteCentralSheet(allData);
  } else {
    Logger.log("!!! FAILURE: No valid data rows were found after processing all files.");
  }
}
/**
 * Helper: Clears and overwrites the central data sheet
 */
function overwriteCentralSheet(data) {
  try {
    const sheet = SpreadsheetApp.openById(CENTRAL_SHEET_ID).getSheetByName(SHEET_NAME);
    
    // Clear all data *except* the header row (row 1)
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) { 
      sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
    }
    
    // Paste the new, aggregated data starting from row 2
    sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
    Logger.log("Central Sheet successfully overwritten with " + data.length + " rows.");
    
  } catch (e) {
    Logger.log("Error loading data to central sheet: " + e);
  }
}


/*PART 2: THE WEB APP*/

/**
 * Serves the 'Dashboard.html' file as a webpage.
 */
function doGet() {
  // It should just be 'Dashboard'
  return HtmlService.createHtmlOutputFromFile('Dashboard')
    .setTitle("BI Dashboard")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Gets data from the central sheet to send to the dashboard.
 * (This function is unchanged)
 */
function getDashboardData() {
  const sheet = SpreadsheetApp.openById(CENTRAL_SHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues(); 
  return data;
}
