import { RegistrationData, TeamMemberData } from './excelService';

interface ExcelOnlineConfig {
  workbookId: string;  // From your Excel Online URL
  worksheetId: string; // Specific worksheet ID
  accessToken: string;  // Microsoft Graph API access token
}

class ExcelOnlineService {
  private workbookId: string;
  private worksheetId: string;
  private accessToken: string;
  private baseUrl = 'https://graph.microsoft.com/v1.0/me/drive/items';

  constructor(config: ExcelOnlineConfig) {
    this.workbookId = config.workbookId;
    this.worksheetId = config.worksheetId;
    this.accessToken = config.accessToken;
  }

  /**
   * Add registration data to Excel Online
   */
  async addRegistration(registration: RegistrationData): Promise<void> {
    try {
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
        `${this.baseUrl}/${this.workbookId}/workbook/worksheets/${this.worksheetId}/tables/add`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            address: 'A1',
            hasHeaders: true
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add table to Excel Online');
      }

      // Add the data row
      const tableResponse = await response.json();
      const tableId = tableResponse.id;

      await fetch(
        `${this.baseUrl}/${this.workbookId}/workbook/tables/${tableId}/rows/add`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            index: null,
            values: [rowData]
          })
        }
      );

      console.log('Registration added to Excel Online successfully');
    } catch (error) {
      console.error('Error adding registration to Excel Online:', error);
      throw new Error('Failed to add registration to Excel Online');
    }
  }

  /**
   * Get all registrations from Excel Online
   */
  async getRegistrations(): Promise<RegistrationData[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.workbookId}/workbook/worksheets/${this.worksheetId}/usedRange`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get data from Excel Online');
      }

      const data = await response.json();
      const rows = data.values || [];

      if (rows.length <= 1) return []; // Skip if only headers exist

      return rows.slice(1).map((row: any[], index: number) => ({
        id: `row_${index + 2}`,
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
      console.error('Error getting registrations from Excel Online:', error);
      throw new Error('Failed to get registrations from Excel Online');
    }
  }
}

export { ExcelOnlineService, ExcelOnlineConfig };
