import { RegistrationData, TeamMemberData } from './excelService';

interface WebhookConfig {
  url: string; // Your webhook endpoint URL
  headers?: Record<string, string>;
}

class WebhookService {
  private url: string;
  private headers: Record<string, string>;

  constructor(config: WebhookConfig) {
    this.url = config.url;
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers
    };
  }

  /**
   * Send registration data via webhook
   */
  async sendRegistration(registration: RegistrationData): Promise<void> {
    try {
      const payload = {
        type: 'registration',
        data: registration,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(this.url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
      }

      console.log('Registration sent via webhook successfully');
    } catch (error) {
      console.error('Error sending registration via webhook:', error);
      throw new Error('Failed to send registration via webhook');
    }
  }

  /**
   * Send team members via webhook
   */
  async sendTeamMembers(teamMembers: TeamMemberData[], registrationId: string): Promise<void> {
    try {
      const payload = {
        type: 'team_members',
        registrationId,
        data: teamMembers,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(this.url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
      }

      console.log('Team members sent via webhook successfully');
    } catch (error) {
      console.error('Error sending team members via webhook:', error);
      throw new Error('Failed to send team members via webhook');
    }
  }
}

export { WebhookService, WebhookConfig };
