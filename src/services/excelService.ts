import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export interface RegistrationData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  event_id: string;
  event_name: string;
  entry_fee: number;
  razorpay_payment_id?: string;
  payment_status?: string;
  created_at?: string;
  registration_type?: 'solo' | 'team';
  team_name?: string;
  team_size?: number;
  branch?: string;
  year?: string;
}

export interface TeamMemberData {
  name: string;
  email: string;
  phone: string;
  branch: string;
  year: string;
  role: 'leader' | 'member';
}

class ExcelService {
  /**
   * Convert registration data to Excel format and download
   */
  exportRegistrations(data: RegistrationData[], filename?: string): void {
    try {
      // Prepare worksheet data
      const worksheetData = this.prepareRegistrationWorksheet(data);
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Registrations');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      
      // Save file
      const finalFilename = filename || `registrations_${new Date().toISOString().split('T')[0]}.xlsx`;
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, finalFilename);
      
      console.log(`Excel file exported successfully: ${finalFilename}`);
    } catch (error) {
      console.error('Error exporting Excel file:', error);
      throw new Error('Failed to export Excel file');
    }
  }

  /**
   * Export team members data to separate sheet
   */
  exportTeamMembers(teamData: TeamMemberData[], filename?: string): void {
    try {
      const worksheetData = this.prepareTeamMembersWorksheet(teamData);
      
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      
      XLSX.utils.book_append_sheet(wb, ws, 'Team Members');
      
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const finalFilename = filename || `team_members_${new Date().toISOString().split('T')[0]}.xlsx`;
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, finalFilename);
      
      console.log(`Team members Excel file exported successfully: ${finalFilename}`);
    } catch (error) {
      console.error('Error exporting team members Excel file:', error);
      throw new Error('Failed to export team members Excel file');
    }
  }

  /**
   * Export comprehensive report with multiple sheets
   */
  exportComprehensiveReport(
    registrations: RegistrationData[], 
    teamMembers: TeamMemberData[],
    filename?: string
  ): void {
    try {
      const wb = XLSX.utils.book_new();
      
      // Add registrations sheet
      const registrationData = this.prepareRegistrationWorksheet(registrations);
      const registrationWs = XLSX.utils.aoa_to_sheet(registrationData);
      XLSX.utils.book_append_sheet(wb, registrationWs, 'Registrations');
      
      // Add team members sheet
      const teamMemberData = this.prepareTeamMembersWorksheet(teamMembers);
      const teamMemberWs = XLSX.utils.aoa_to_sheet(teamMemberData);
      XLSX.utils.book_append_sheet(wb, teamMemberWs, 'Team Members');
      
      // Add summary sheet
      const summaryData = this.prepareSummaryWorksheet(registrations, teamMembers);
      const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
      
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const finalFilename = filename || `comprehensive_report_${new Date().toISOString().split('T')[0]}.xlsx`;
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, finalFilename);
      
      console.log(`Comprehensive Excel report exported successfully: ${finalFilename}`);
    } catch (error) {
      console.error('Error exporting comprehensive Excel report:', error);
      throw new Error('Failed to export comprehensive Excel report');
    }
  }

  /**
   * Prepare registration worksheet data
   */
  private prepareRegistrationWorksheet(data: RegistrationData[]): any[][] {
    const headers = [
      'Registration ID',
      'Name',
      'Email',
      'Phone',
      'College/Department',
      'Branch',
      'Year',
      'Event ID',
      'Event Name',
      'Registration Type',
      'Team Name',
      'Team Size',
      'Entry Fee (₹)',
      'Payment ID',
      'Payment Status',
      'Registration Date'
    ];

    const rows = data.map(registration => [
      registration.id || '',
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
      registration.created_at ? new Date(registration.created_at).toLocaleDateString() : new Date().toLocaleDateString()
    ]);

    return [headers, ...rows];
  }

  /**
   * Prepare team members worksheet data
   */
  private prepareTeamMembersWorksheet(data: TeamMemberData[]): any[][] {
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Branch',
      'Year',
      'Role'
    ];

    const rows = data.map(member => [
      member.name || '',
      member.email || '',
      member.phone || '',
      member.branch || '',
      member.year || '',
      member.role || ''
    ]);

    return [headers, ...rows];
  }

  /**
   * Prepare summary worksheet with statistics
   */
  private prepareSummaryWorksheet(registrations: RegistrationData[], teamMembers: TeamMemberData[]): any[][] {
    const totalRegistrations = registrations.length;
    const totalRevenue = registrations.reduce((sum, reg) => sum + (reg.entry_fee || 0), 0);
    const soloRegistrations = registrations.filter(reg => reg.registration_type === 'solo').length;
    const teamRegistrations = registrations.filter(reg => reg.registration_type === 'team').length;
    const successfulPayments = registrations.filter(reg => reg.payment_status === 'success').length;
    const totalParticipants = teamMembers.length + soloRegistrations;

    const summaryData = [
      ['Registration Summary Report', '', '', '', ''],
      ['Generated on', new Date().toLocaleDateString(), '', '', ''],
      ['', '', '', '', ''],
      ['Key Metrics', 'Count', 'Percentage', '', ''],
      ['Total Registrations', totalRegistrations, '100%', '', ''],
      ['Solo Registrations', soloRegistrations, `${((soloRegistrations / totalRegistrations) * 100).toFixed(1)}%`, '', ''],
      ['Team Registrations', teamRegistrations, `${((teamRegistrations / totalRegistrations) * 100).toFixed(1)}%`, '', ''],
      ['Total Participants', totalParticipants, '', '', ''],
      ['Successful Payments', successfulPayments, `${((successfulPayments / totalRegistrations) * 100).toFixed(1)}%`, '', ''],
      ['Total Revenue (₹)', totalRevenue, '', '', ''],
      ['', '', '', '', ''],
      ['Event-wise Breakdown', '', '', '', ''],
      ['Event Name', 'Registrations', 'Revenue (₹)', '', ''],
    ];

    // Add event-wise breakdown
    const eventStats = registrations.reduce((acc, reg) => {
      const eventName = reg.event_name || 'Unknown Event';
      if (!acc[eventName]) {
        acc[eventName] = { count: 0, revenue: 0 };
      }
      acc[eventName].count++;
      acc[eventName].revenue += reg.entry_fee || 0;
      return acc;
    }, {} as Record<string, { count: number; revenue: number }>);

    Object.entries(eventStats).forEach(([eventName, stats]) => {
      summaryData.push([eventName, stats.count.toString(), stats.revenue.toString(), '', '']);
    });

    return summaryData;
  }

  /**
   * Parse Excel file and convert to registration data format
   */
  parseExcelFile(file: File): Promise<RegistrationData[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get first worksheet
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          
          // Convert to RegistrationData format
          const registrations = this.convertExcelDataToRegistrations(jsonData as any[][]);
          resolve(registrations);
        } catch (error) {
          reject(new Error('Failed to parse Excel file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Convert Excel data to RegistrationData format
   */
  private convertExcelDataToRegistrations(excelData: any[][]): RegistrationData[] {
    if (excelData.length < 2) return [];
    
    const headers = excelData[0];
    const rows = excelData.slice(1);
    
    return rows.map(row => {
      const registration: Partial<RegistrationData> = {};
      
      headers.forEach((header, index) => {
        const value = row[index];
        switch (header.toLowerCase().replace(/\s+/g, '_')) {
          case 'name':
            registration.name = value;
            break;
          case 'email':
            registration.email = value;
            break;
          case 'phone':
            registration.phone = value;
            break;
          case 'college':
          case 'college/department':
            registration.college = value;
            break;
          case 'branch':
            registration.branch = value;
            break;
          case 'year':
            registration.year = value;
            break;
          case 'event_id':
            registration.event_id = value;
            break;
          case 'event_name':
            registration.event_name = value;
            break;
          case 'entry_fee_(₹)':
          case 'entry_fee':
            registration.entry_fee = parseFloat(value) || 0;
            break;
          case 'payment_id':
          case 'razorpay_payment_id':
            registration.razorpay_payment_id = value;
            break;
          case 'payment_status':
            registration.payment_status = value;
            break;
          case 'registration_type':
            registration.registration_type = value;
            break;
          case 'team_name':
            registration.team_name = value;
            break;
          case 'team_size':
            registration.team_size = parseInt(value) || 1;
            break;
        }
      });
      
      return registration as RegistrationData;
    }).filter(reg => reg.name && reg.email); // Filter out empty rows
  }
}

export const excelService = new ExcelService();
