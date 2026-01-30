interface RegistrationData {
  name: string;
  branch?: string;
  year?: string;
  email: string;
  phone: string;
  eventName: string;
  teamName?: string;
  registrationType: 'solo' | 'team';
  numberOfParticipants?: number;
  amountPaid: number;
  razorpayPaymentId: string;
  paymentStatus?: string;
}

interface RegistrationResponse {
  success: boolean;
  message: string;
  data?: {
    spreadsheetId: string;
    updatedRange: string;
    processingTime: string;
  };
  processingTime?: string;
}

class RegistrationAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
  }

  async saveRegistration(data: RegistrationData): Promise<RegistrationResponse> {
    try {
      console.log('📤 Sending registration to backend:', {
        name: data.name,
        email: data.email,
        event: data.eventName,
        type: data.registrationType,
        amount: data.amountPaid
      });

      const response = await fetch(`${this.baseURL}/api/registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      console.log('✅ Registration saved successfully:', {
        success: result.success,
        message: result.message,
        processingTime: result.data?.processingTime
      });

      return result;
    } catch (error) {
      console.error('❌ Registration API error:', {
        error: error.message,
        data: {
          name: data.name,
          email: data.email,
          event: data.eventName
        }
      });
      throw error;
    }
  }

  async checkHealth(): Promise<{ status: string; sheetsInitialized: boolean }> {
    try {
      const response = await fetch(`${this.baseURL}/api/health`);
      const result = await response.json();
      return {
        status: result.status,
        sheetsInitialized: result.sheetsInitialized
      };
    } catch (error) {
      console.error('❌ Health check failed:', error.message);
      return {
        status: 'unhealthy',
        sheetsInitialized: false
      };
    }
  }

  // Retry mechanism for failed requests
  async saveRegistrationWithRetry(data: RegistrationData, maxRetries = 3): Promise<RegistrationResponse> {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.saveRegistration(data);
      } catch (error) {
        lastError = error;
        console.warn(`⚠️ Attempt ${attempt} failed:`, error.message);

        if (attempt < maxRetries) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, attempt - 1) * 1000;
          console.log(`🔄 Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    console.error(`❌ All ${maxRetries} attempts failed`);
    throw lastError;
  }
}

export const registrationAPI = new RegistrationAPI();
export type { RegistrationData, RegistrationResponse };
