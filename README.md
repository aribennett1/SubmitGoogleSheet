# Introduction

The Submit Google Sheet Web App is a Google Apps Script-powered web application designed to streamline the process of logging job assignments and various timeslots using a Google Sheet template. This application empowers users to efficiently manage and track job assignments for specific days, enhancing coordination and transparency.

# Features

- Creates a duplicate of a customizable Google Sheets template for logging job assignments and timeslots.
- Enables users to input job assignments and timeslots for a specific day using the duplicated sheet.
- Renames the sheet to match the entered day's date upon assignment completion.
- Sends an email notification to management containing the completed sheet for review and approval.
- Utilizes Google Sheets' conditional formatting to highlight edited cells post-submission.
- Implements an alert system to warn users against exiting the page without submitting assignments, preventing data loss.
- Safeguards data integrity by automatically deleting incomplete sheets upon exit.

# Usage

1. Access the web application using the provided URL.
2. Input job assignments and associated timeslots for the designated day.
3. After completing assignment entry, click the Submit button to confirm.
4. The script will rename the sheet to match the day's date and send it to management for review.
5. Edited cells will be visibly marked using conditional formatting, facilitating post-submission revisions.
6. Exiting the page without submission triggers a warning alert to protect against data loss.
# Conditional Formatting
The application leverages Google Sheets' conditional formatting feature to enhance visibility. Cells edited after submission are flagged with red text, providing a clear indication of changes made after initial entry. This transparency aids in tracking and accountability.

# Data Integrity
The script prioritizes data integrity. Exiting the application without submission prompts an alert. If the user proceeds to exit, the script will automatically delete the incomplete sheet, ensuring the system remains clean and accurate.

# Notes
- Customize the script to match your organization's specific requirements, such as folder IDs and email recipients.
- Consider additional security measures if handling sensitive data, such as restricting access to authorized personnel.
