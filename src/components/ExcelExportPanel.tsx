import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileSpreadsheet, Upload, Users, User, BarChart3, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useExcelExport } from '@/hooks/useExcelExport';
import { RegistrationData, TeamMemberData } from '@/types/registration';
import { toast } from 'sonner';

interface ExcelExportPanelProps {
  registrations: RegistrationData[];
  teamMembers: TeamMemberData[];
}

export const ExcelExportPanel = ({ registrations, teamMembers }: ExcelExportPanelProps) => {
  const [customFilename, setCustomFilename] = useState('');
  const [importFile, setImportFile] = useState<File | null>(null);
  const { isExporting, exportProgress, exportRegistrations, exportTeamMembers, exportComprehensiveReport, parseExcelFile } = useExcelExport();

  const handleExportRegistrations = () => {
    const filename = customFilename || `registrations_${new Date().toISOString().split('T')[0]}`;
    exportRegistrations(registrations, filename);
  };

  const handleExportTeamMembers = () => {
    const filename = customFilename || `team_members_${new Date().toISOString().split('T')[0]}`;
    exportTeamMembers(teamMembers, filename);
  };

  const handleExportComprehensive = () => {
    const filename = customFilename || `comprehensive_report_${new Date().toISOString().split('T')[0]}`;
    exportComprehensiveReport(registrations, teamMembers, filename);
  };

  const handleImportExcel = async () => {
    if (!importFile) {
      toast.error('Please select a file to import');
      return;
    }

    try {
      const importedData = await parseExcelFile(importFile);
      // Here you would typically merge the imported data with existing data
      // or update your state management system
      console.log('Imported data:', importedData);
      toast.success(`Imported ${importedData.length} registrations successfully`);
    } catch (error) {
      console.error('Import failed:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setImportFile(file);
      } else {
        toast.error('Please select a valid Excel file (.xlsx or .xls)');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Statistics Overview */}
      <Card className="p-6 glass-card">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Data Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <div className="text-2xl font-bold text-primary">{registrations.length}</div>
            <div className="text-sm text-muted-foreground">Total Registrations</div>
          </div>
          <div className="text-center p-4 bg-secondary/10 rounded-lg">
            <div className="text-2xl font-bold text-secondary">{teamMembers.length}</div>
            <div className="text-sm text-muted-foreground">Team Members</div>
          </div>
          <div className="text-center p-4 bg-green-500/10 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              ₹{registrations.reduce((sum, reg) => sum + (reg.entry_fee || 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Revenue</div>
          </div>
        </div>
      </Card>

      {/* Export Options */}
      <Card className="p-6 glass-card">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-primary" />
          Export to Excel
        </h3>
        
        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="filename">Custom Filename (optional)</Label>
            <Input
              id="filename"
              value={customFilename}
              onChange={(e) => setCustomFilename(e.target.value)}
              placeholder="Enter custom filename without extension"
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={handleExportRegistrations}
            disabled={isExporting || registrations.length === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            {isExporting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Exporting...</>
            ) : (
              <>Registrations ({registrations.length})</>
            )}
          </Button>

          <Button
            onClick={handleExportTeamMembers}
            disabled={isExporting || teamMembers.length === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            {isExporting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Exporting...</>
            ) : (
              <>Team Members ({teamMembers.length})</>
            )}
          </Button>

          <Button
            onClick={handleExportComprehensive}
            disabled={isExporting || (registrations.length === 0 && teamMembers.length === 0)}
            variant="festival"
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            {isExporting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Exporting...</>
            ) : (
              <>Comprehensive Report</>
            )}
          </Button>
        </div>

        {/* Export Progress */}
        {isExporting && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Export Progress</span>
              <span className="text-sm font-medium">{exportProgress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${exportProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Import Options */}
      <Card className="p-6 glass-card">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-primary" />
          Import from Excel
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="import-file">Select Excel File</Label>
            <Input
              id="import-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="mt-1"
            />
          </div>
          
          {importFile && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm"><strong>Selected file:</strong> {importFile.name}</p>
              <p className="text-xs text-muted-foreground">
                Size: {(importFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
          
          <Button
            onClick={handleImportExcel}
            disabled={!importFile || isExporting}
            variant="outline"
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Excel Data
          </Button>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 glass-card">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => {
              const today = new Date().toISOString().split('T')[0];
              setCustomFilename(`resonance_festival_${today}`);
            }}
            variant="outline"
            size="sm"
          >
            Set Today's Filename
          </Button>
          <Button
            onClick={() => setCustomFilename('')}
            variant="outline"
            size="sm"
          >
            Clear Filename
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
