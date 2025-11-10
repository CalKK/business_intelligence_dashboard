# Business Dashboard

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/business-dashboard/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A comprehensive business intelligence dashboard built with Google Apps Script and HTML/CSS/JavaScript. This project automates data extraction, transformation, and loading (ETL) from CSV files into a central Google Sheet, and provides a web-based dashboard for visualizing key performance indicators (KPIs) such as total revenue, transaction counts, unique customers, and average transaction value.

## Features

- **ETL Pipeline**: Automatically processes CSV files from a specified Google Drive folder, extracts headers, transforms data, and loads it into a central Google Sheet.
- **Web Dashboard**: Interactive HTML dashboard displaying real-time KPIs fetched from the central sheet.
- **Error Handling**: Robust logging and error handling for data processing and web serving.
- **Configurable**: Easily customizable constants for folder IDs, sheet IDs, headers, and more.

## Installation

### Prerequisites

- A Google Account with access to Google Drive and Google Sheets.
- Google Apps Script enabled (available in Google Drive or Google Sheets).
- Basic knowledge of Google Apps Script deployment.

### Steps

1. **Clone or Download the Repository**:
   - Download the `Code.gs` and `Dashboard.html` files from this repository.

2. **Set Up Google Apps Script**:
   - Open [Google Apps Script](https://script.google.com/).
   - Create a new project.
   - Copy the contents of `Code.gs` into the script editor.
   - Upload `Dashboard.html` as an HTML file in the Apps Script project (under "Files" > "Add a file" > "HTML").

3. **Configure Constants**:
   - In `Code.gs`, update the following constants with your specific IDs and settings:
     ```javascript
     const FOLDER_ID = "your-folder-id-here"; // ID of the Google Drive folder containing CSV files
     const CENTRAL_SHEET_ID = "your-sheet-id-here"; // ID of the central Google Sheet
     const SHEET_NAME = "Sheet1"; // Name of the tab in the central sheet
     const MASTER_HEADERS = ["TRANS DATE", "TRANS AMOUNT", "PAYER MOBILE", "MPESA TRANS REF NUMBER"]; // Exact headers in order
     ```
   - Obtain folder and sheet IDs from their URLs (e.g., `https://drive.google.com/drive/folders/FOLDER_ID`).

4. **Deploy the Web App**:
   - In the Apps Script editor, click "Deploy" > "New deployment".
   - Select type "Web app".
   - Set "Execute as" to your account and "Who has access" to "Anyone" (or restrict as needed).
   - Note the deployment URL for accessing the dashboard.

5. **Prepare Data**:
   - Ensure CSV files are placed in the specified Google Drive folder.
   - The central Google Sheet should have the headers in row 1 matching `MASTER_HEADERS`.

## Usage

### Running the ETL Pipeline

To process CSV files and update the central sheet:

1. In the Apps Script editor, run the `runDataPipeline_CSV` function.
2. Check the logs for processing status and any errors.

Example code snippet to trigger the pipeline programmatically:

```javascript
function triggerPipeline() {
  runDataPipeline_CSV();
}
```

### Accessing the Dashboard

- Navigate to the deployed web app URL.
- The dashboard will load and display KPIs based on the data in the central sheet.

Example of fetching data manually (for testing):

```javascript
function testDataFetch() {
  const data = getDashboardData();
  Logger.log(data);
}
```

## API Documentation

This project exposes the following functions via Google Apps Script:

### `runDataPipeline_CSV()`
- **Description**: Executes the ETL process for CSV files.
- **Parameters**: None
- **Returns**: Void
- **Usage**: Call this function to process all CSV files in the specified folder and update the central sheet.

### `doGet()`
- **Description**: Serves the HTML dashboard as a web page.
- **Parameters**: None (standard Apps Script web app entry point)
- **Returns**: HtmlOutput object
- **Usage**: Automatically called when accessing the web app URL.

### `getDashboardData()`
- **Description**: Retrieves all data from the central sheet.
- **Parameters**: None
- **Returns**: 2D array of sheet data (including headers)
- **Usage**: Called by the dashboard's JavaScript to populate KPIs.

### `overwriteCentralSheet(data)`
- **Description**: Clears and overwrites the central sheet with new data.
- **Parameters**: `data` (2D array of rows to write)
- **Returns**: Void
- **Usage**: Internal helper function for loading data.

## Configuration Options

Customize the following constants in `Code.gs` for your setup:

- `FOLDER_ID`: Google Drive folder ID containing CSV files.
- `CENTRAL_SHEET_ID`: Google Sheet ID for the central database.
- `SHEET_NAME`: Name of the sheet tab (default: "Sheet1").
- `MASTER_HEADERS`: Array of header names in the desired order for the central sheet.

For advanced configuration, modify the header search logic in `runDataPipeline_CSV` to adjust how headers are detected in CSV files.

## Contributing

We welcome contributions to improve this project! Please follow these guidelines:

1. **Fork the Repository**: Create a fork on GitHub.
2. **Create a Branch**: Use a descriptive branch name (e.g., `feature/add-new-kpi`).
3. **Make Changes**: Ensure code is well-documented and follows Google Apps Script best practices.
4. **Test Thoroughly**: Verify ETL processing and dashboard functionality.
5. **Submit a Pull Request**: Provide a clear description of changes and why they are beneficial.

### Code Style
- Use consistent indentation (2 spaces).
- Add comments for complex logic.
- Follow JavaScript naming conventions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Troubleshooting

### Common Issues

1. **CSV Files Not Processing**:
   - Ensure CSV files are in the correct Google Drive folder.
   - Check that `FOLDER_ID` is accurate.
   - Verify CSV headers match the expected format (headers should be detectable within the first 10 rows).

2. **Dashboard Not Loading**:
   - Confirm the web app is deployed and the URL is correct.
   - Check browser console for JavaScript errors.
   - Ensure `CENTRAL_SHEET_ID` and `SHEET_NAME` are valid.

3. **Data Not Appearing in Sheet**:
   - Run `runDataPipeline_CSV` and review Apps Script logs for errors.
   - Verify `MASTER_HEADERS` matches your data structure.
   - Check permissions: The script must have access to the folder and sheet.

4. **Permission Errors**:
   - When deploying, ensure "Execute as" is set to your account.
   - Grant necessary permissions for Drive and Sheets access.

### Debugging Tips
- Use `Logger.log()` statements in Apps Script for debugging.
- Test functions individually in the Apps Script editor.
- For web app issues, inspect the page source and console logs.

If issues persist, please open an issue on GitHub with detailed error messages and steps to reproduce.

## Support

For questions or support, please:
- Check the troubleshooting section above.
- Review Google Apps Script documentation.
- Open an issue on the GitHub repository.


