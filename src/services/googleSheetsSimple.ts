import { RegistrationData, TeamMemberData } from '@/types/registration';
import { SignJWT } from 'jose';

interface GoogleSheetsConfig {
  spreadsheetId: string;
  clientEmail: string;
  privateKey: string;
}

class GoogleSheetsSimpleService {
  private spreadsheetId: string;
  private clientEmail: string;
  private privateKey: string;

  constructor(config: GoogleSheetsConfig) {
    this.spreadsheetId = config.spreadsheetId;
    this.clientEmail = config.clientEmail;
    this.privateKey = config.privateKey;
  }

  /**
   * Create JWT token for Google Sheets API
   */
  private async createJWT(): Promise<string> {
    const privateKey = this.privateKey.replace(/\\n/g, '\n');
    
    const jwt = await new SignJWT({
      iss: this.clientEmail,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000)
    })
      .setProtectedHeader({ alg: 'RS256' })
      .sign(privateKey);

    return jwt;
  }

  /**
   * Get access token
   */
  private async getAccessToken(): Promise<string> {
    try {
      const jwt = await this.createJWT();
      
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: jwt
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get access token');
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  /**
   * Add registration to Google Sheets
   */
  async addRegistration(registration: RegistrationData): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();
      
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

      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Registrations!A:O:append`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: [rowData],
            valueInputOption: 'USER_ENTERED'
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Google Sheets API Error: ${JSON.stringify(errorData)}`);
      }

      console.log('Registration added to Google Sheets successfully');
    } catch (error) {
      console.error('Error adding registration to Google Sheets:', error);
      throw error;
    }
  }

  /**
   * Add team members to Google Sheets
   */
  async addTeamMembers(teamMembers: TeamMemberData[], registrationId: string): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();
      
      const rowsData = teamMembers.map(member => [
        registrationId,
        member.name || '',
        member.email || '',
        member.phone || '',
        member.branch || '',
        member.year || '',
        member.role || 'member'
      ]);

      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/TeamMembers!A:G:append`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: rowsData,
            valueInputOption: 'USER_ENTERED'
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Google Sheets API Error: ${JSON.stringify(errorData)}`);
      }

      console.log('Team members added to Google Sheets successfully');
    } catch (error) {
      console.error('Error adding team members to Google Sheets:', error);
      throw error;
    }
  }
}

// Create and export instance
const googleSheetsService = new GoogleSheetsSimpleService({
  spreadsheetId: import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID || '',
  clientEmail: import.meta.env.VITE_GOOGLE_SHEETS_CLIENT_EMAIL || '',
  privateKey: import.meta.env.VITE_GOOGLE_SHEETS_PRIVATE_KEY || ''
});

export { googleSheetsService, GoogleSheetsSimpleService };
