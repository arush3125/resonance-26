import { useState } from 'react';
import { RegistrationData, TeamMemberData } from '@/types/registration';
import { toast } from 'sonner';

export const useExcelExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const exportRegistrations = async (data: RegistrationData[], filename?: string) => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      // For now, just save to localStorage since we're using Google Sheets
      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `registrations-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Registration data exported successfully!");
    } catch (error) {
      toast.error("Failed to export registration data");
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const exportTeamMembers = async (data: TeamMemberData[], filename?: string) => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      // For now, just save to localStorage since we're using Google Sheets
      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `team-members-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Team members data exported successfully!");
    } catch (error) {
      toast.error("Failed to export team members data");
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportComprehensiveReport = async (
    registrations: RegistrationData[], 
    teamMembers: TeamMemberData[],
    filename?: string
  ) => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      setExportProgress(20);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const report = {
        generatedAt: new Date().toISOString(),
        totalRegistrations: registrations.length,
        registrations,
        teamMembers
      };
      
      const jsonData = JSON.stringify(report, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `comprehensive-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setExportProgress(100);
      toast.success('Comprehensive report exported successfully');
      
      setTimeout(() => setExportProgress(0), 2000);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export comprehensive report');
      setExportProgress(0);
    } finally {
      setIsExporting(false);
    }
  };

  const parseExcelFile = async (file: File): Promise<RegistrationData[]> => {
    setIsExporting(true);
    
    try {
      // For now, just return empty array since we're using Google Sheets
      toast.warning('Excel parsing is disabled. Using Google Sheets integration instead.');
      return [];
    } catch (error) {
      console.error('Parse failed:', error);
      toast.error('Failed to parse Excel file');
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    exportProgress,
    exportRegistrations,
    exportTeamMembers,
    exportComprehensiveReport,
    parseExcelFile,
  };
};
