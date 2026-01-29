import { RegistrationData, TeamMemberData } from '@/types/registration';

interface GoogleSheetsConfig {
  spreadsheetId: string;
  webhookUrl: string;
}

class GoogleSheetsDirectService {
  private spreadsheetId: string;
  private webhookUrl: string;

  constructor(config: GoogleSheetsConfig) {
    this.spreadsheetId = config.spreadsheetId;
    this.webhookUrl = config.webhookUrl;
  }

  /**
   * Add registration to Google Sheets using webhook
   */
  async addRegistration(registration: RegistrationData): Promise<void> {
    try {
      console.log('📊 Starting Google Sheets registration save...');
      
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
        registration.created_at || new Date().toISOString(),
        new Date().toLocaleString() // Additional timestamp for sheet
      ];

      console.log('📋 Registration data prepared:', rowData);

      await this.sendToWebhook({
        type: 'registration',
        sheet: 'Registrations',
        data: rowData
      });

      console.log('✅ Registration data sent to Google Sheets successfully');
    } catch (error) {
      console.error('❌ Error adding registration to Google Sheets:', error);
      throw error;
    }
  }

  /**
   * Add team members to Google Sheets
   */
  async addTeamMembers(teamMembers: TeamMemberData[], registrationId: string): Promise<void> {
    try {
      console.log('👥 Starting team members save to Google Sheets...');
      
      const rowsData = teamMembers.map(member => [
        registrationId,
        member.name || '',
        member.email || '',
        member.phone || '',
        member.branch || '',
        member.year || '',
        member.role || 'member'
      ]);

      console.log('📋 Team members data prepared:', rowsData);

      await this.sendToWebhook({
        type: 'team_members',
        sheet: 'TeamMembers',
        data: rowsData
      });

      console.log('✅ Team members data sent to Google Sheets successfully');
    } catch (error) {
      console.error('❌ Error adding team members to Google Sheets:', error);
      throw error;
    }
  }

  /**
   * Add audition registration to Google Sheets
   */
  async addAuditionRegistration(auditionData: any): Promise<void> {
    try {
      console.log('🎭 Starting audition registration save to Google Sheets...');
      
      const rowData = [
        auditionData.name || '',
        auditionData.email || '',
        auditionData.phone || '',
        auditionData.college || '',
        auditionData.branch || '',
        auditionData.year || '',
        auditionData.audition_type || '',
        new Date().toLocaleString()
      ];

      console.log('📋 Audition data prepared:', rowData);

      await this.sendToWebhook({
        type: 'audition',
        sheet: 'Auditions',
        data: rowData
      });

      console.log('✅ Audition data sent to Google Sheets successfully');
    } catch (error) {
      console.error('❌ Error adding audition to Google Sheets:', error);
      throw error;
    }
  }

  /**
   * Test connection to Google Sheets
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log('🧪 Testing Google Sheets connection...');
      
      const response = await this.sendToWebhook({
        type: 'test',
        message: 'Connection test from frontend',
        timestamp: new Date().toISOString()
      });

      console.log('✅ Google Sheets connection test successful');
      return true;
    } catch (error) {
      console.error('❌ Google Sheets connection test failed:', error);
      return false;
    }
  }

  /**
   * Send data to webhook (Google Apps Script endpoint)
   */
  private async sendToWebhook(payload: any): Promise<any> {
    // Use proxy to avoid CORS issues
    const proxyUrl = `/api/google-sheets/macros/s/${this.extractScriptId(this.webhookUrl)}/exec`;
    
    console.log('📡 Sending webhook request to:', proxyUrl);
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('📊 Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Webhook response error:', errorText);
      throw new Error(`Webhook failed: ${response.status} - ${errorText}`);
    }

    const responseText = await response.text();
    console.log('📄 Response body:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.log('📝 Response is not JSON, treating as success');
      responseData = { status: 'success', message: responseText };
    }

    if (responseData.status === 'error') {
      throw new Error(responseData.message || 'Unknown error from webhook');
    }

    return responseData;
  }

  /**
   * Extract script ID from webhook URL
   */
  private extractScriptId(webhookUrl: string): string {
    const match = webhookUrl.match(/\/macros\/s\/([^\/]+)/);
    return match ? match[1] : '';
  }
}

// Create instance with environment variables
const googleSheetsDirectService = new GoogleSheetsDirectService({
  spreadsheetId: import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID || '1giL91m3QZVPDpzxNG1zlCcyi0Nvulc-cl7FwiGOQsqo',
  webhookUrl: import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbxd3WA32_vHncrKks9l3hQs_yIUeqkOlp7NvGTIlygwagO5EpI-WwROsW9hHCna8epBQQ/exec'
});

export { googleSheetsDirectService, GoogleSheetsDirectService };
