import { google } from 'googleapis';
import { RegistrationData, TeamMemberData } from './excelService';

// Google Sheets configuration
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // You'll get this from your Google Sheets URL
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

interface GoogleSheetsConfig {
  spreadsheetId: string;
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
}

class GoogleSheetsService {
  private spreadsheetId: string;
  private apiKey: string;
  private auth: any;

  constructor(config: GoogleSheetsConfig) {
    this.spreadsheetId = config.spreadsheetId;
    this.apiKey = config.apiKey || '';
    
    // Initialize auth if credentials are provided
    if (config.clientId && config.clientSecret && config.refreshToken) {
      this.auth = new google.auth.OAuth2(
        config.clientId,
        config.clientSecret
      );
      this.auth.setCredentials({
        refresh_token: config.refreshToken
      });
    }
  }

  /**
   * Write registration data directly to Google Sheets
   */
  async addRegistration(registration: RegistrationData): Promise<void> {
    try {
      const sheets = google.sheets({ version: 'v4', auth: this.auth });
      
      // Prepare row data in the same order as your spreadsheet columns
      const rowData = [
        registration.name || '',
        registration.email || '',
        registration.phone || '',
        registration.college || '',
        registration.branch || '',
        registration.year || '',
        registration.event_id || '',
        registration.event_name || '',
        registration.registration_type || 'solo',
        registration.team_name || '',
        registration.team_size || 1,
        registration.entry_fee || 0,
        registration.razorpay_payment_id || '',
        registration.payment_status || 'pending',
        new Date().toLocaleString()
      ];

      // Append to the 'Registrations' sheet
      await sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Registrations!A:O', // Adjust range based on your sheet
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [rowData]
        }
      });

      console.log('Registration added to Google Sheets successfully');
    } catch (error) {
      console.error('Error adding registration to Google Sheets:', error);
      throw new Error('Failed to add registration to Google Sheets');
    }
  }

  /**
   * Add team members to Google Sheets
   */
  async addTeamMembers(teamMembers: TeamMemberData[], registrationId: string): Promise<void> {
    try {
      const sheets = google.sheets({ version: 'v4', auth: this.auth });
      
      const rowsData = teamMembers.map(member => [
        registrationId,
        member.name || '',
        member.email || '',
        member.phone || '',
        member.branch || '',
        member.year || '',
        member.role || 'member'
      ]);

      await sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'TeamMembers!A:G',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: rowsData
        }
      });

      console.log('Team members added to Google Sheets successfully');
    } catch (error) {
      console.error('Error adding team members to Google Sheets:', error);
      throw new Error('Failed to add team members to Google Sheets');
    }
  }

  /**
   * Get all registrations from Google Sheets
   */
  async getRegistrations(): Promise<RegistrationData[]> {
    try {
      const sheets = google.sheets({ version: 'v4', auth: this.auth });
      
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Registrations!A:O'
      });

      const rows = response.data.values || [];
      if (rows.length === 0) return [];

      // Skip header row and convert to RegistrationData
      return rows.slice(1).map((row, index) => ({
        id: `row_${index + 2}`, // Google Sheets row number
        name: row[0] || '',
        email: row[1] || '',
        phone: row[2] || '',
        college: row[3] || '',
        branch: row[4] || '',
        year: row[5] || '',
        event_id: row[6] || '',
        event_name: row[7] || '',
        registration_type: row[8] as 'solo' | 'team' || 'solo',
        team_name: row[9] || undefined,
        team_size: parseInt(row[10]) || 1,
        entry_fee: parseFloat(row[11]) || 0,
        razorpay_payment_id: row[12] || undefined,
        payment_status: row[13] || 'pending',
        created_at: row[14] || new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error getting registrations from Google Sheets:', error);
      throw new Error('Failed to get registrations from Google Sheets');
    }
  }

  /**
   * Update payment status for a registration
   */
  async updatePaymentStatus(registrationId: string, paymentId: string, status: string): Promise<void> {
    try {
      const sheets = google.sheets({ version: 'v4', auth: this.auth });
      
      // Find the row number for this registration
      const registrations = await this.getRegistrations();
      const registrationIndex = registrations.findIndex(reg => reg.id === registrationId);
      
      if (registrationIndex === -1) {
        throw new Error('Registration not found');
      }

      const rowNumber = registrationIndex + 2; // +2 because of header row and 0-based index

      // Update payment status and payment ID
      await sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `Registrations!N${rowNumber}:O${rowNumber}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[paymentId, status]]
        }
      });

      console.log('Payment status updated in Google Sheets');
    } catch (error) {
      console.error('Error updating payment status in Google Sheets:', error);
      throw new Error('Failed to update payment status');
    }
  }

  /**
   * Create a new spreadsheet with proper structure
   */
  async createSpreadsheet(title: string): Promise<string> {
    try {
      const sheets = google.sheets({ version: 'v4', auth: this.auth });
      
      // Create new spreadsheet
      const response = await sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: title
          },
          sheets: [
            {
              properties: {
                title: 'Registrations'
              }
            },
            {
              properties: {
                title: 'TeamMembers'
              }
            },
            {
              properties: {
                title: 'Summary'
              }
            }
          ]
        }
      });

      const newSpreadsheetId = response.data.spreadsheetId || '';

      // Add headers to Registrations sheet
      await sheets.spreadsheets.values.update({
        spreadsheetId: newSpreadsheetId,
        range: 'Registrations!A1:O1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            'Name', 'Email', 'Phone', 'College', 'Branch', 'Year', 
            'Event ID', 'Event Name', 'Registration Type', 'Team Name', 
            'Team Size', 'Entry Fee', 'Payment ID', 'Payment Status', 'Registration Date'
          ]]
        }
      });

      // Add headers to TeamMembers sheet
      await sheets.spreadsheets.values.update({
        spreadsheetId: newSpreadsheetId,
        range: 'TeamMembers!A1:G1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            'Registration ID', 'Name', 'Email', 'Phone', 'Branch', 'Year', 'Role'
          ]]
        }
      });

      console.log('New spreadsheet created:', newSpreadsheetId);
      return newSpreadsheetId;
    } catch (error) {
      console.error('Error creating spreadsheet:', error);
      throw new Error('Failed to create spreadsheet');
    }
  }
}

export { GoogleSheetsService, GoogleSheetsConfig };
