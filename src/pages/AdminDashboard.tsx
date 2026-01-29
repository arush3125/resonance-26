import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, FileSpreadsheet, Users, BarChart3, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExcelExportPanel } from '@/components/ExcelExportPanel';
import { RegistrationData, TeamMemberData } from '@/types/registration';

export const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on component mount and every 5 seconds
  useEffect(() => {
    loadDataFromStorage();
    
    // Set up interval to refresh data every 5 seconds
    const interval = setInterval(() => {
      loadDataFromStorage();
    }, 5000);
    
    // Listen for storage events
    const handleStorageChange = () => {
      console.log('🔄 Storage changed, reloading data...');
      loadDataFromStorage();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadDataFromStorage = () => {
    try {
      const storedRegistrations = JSON.parse(localStorage.getItem('registrationData') || '[]');
      const storedTeamMembers = JSON.parse(localStorage.getItem('teamMemberData') || '[]');
      
      console.log('Loaded registrations:', storedRegistrations.length);
      console.log('Loaded team members:', storedTeamMembers.length);
      
      setRegistrations(storedRegistrations);
      setTeamMembers(storedTeamMembers);
    } catch (error) {
      console.error('Error loading data from storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all stored data? This action cannot be undone.')) {
      localStorage.removeItem('registrationData');
      localStorage.removeItem('teamMemberData');
      setRegistrations([]);
      setTeamMembers([]);
      alert('All data has been cleared');
    }
  };

  const refreshData = () => {
    setIsLoading(true);
    loadDataFromStorage();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold gradient-text">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Manage registrations and export data to Excel
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="p-6 glass-card text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{registrations.length}</div>
            <div className="text-sm text-muted-foreground">Total Registrations</div>
          </Card>
          
          <Card className="p-6 glass-card text-center">
            <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 text-secondary" />
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <div className="text-sm text-muted-foreground">Team Members</div>
          </Card>
          
          <Card className="p-6 glass-card text-center">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">
              ₹{registrations.reduce((sum, reg) => sum + (reg.entry_fee || 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Revenue</div>
          </Card>
          
          <Card className="p-6 glass-card text-center">
            <Download className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-600">
              {registrations.filter(reg => reg.payment_status === 'success').length}
            </div>
            <div className="text-sm text-muted-foreground">Successful Payments</div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 justify-center mb-8"
        >
          <Button onClick={refreshData} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </Button>
          <Button onClick={clearAllData} variant="destructive" className="flex items-center gap-2">
            Clear All Data
          </Button>
        </motion.div>

        {/* Excel Export Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ExcelExportPanel registrations={registrations} teamMembers={teamMembers} />
        </motion.div>

        {/* Recent Registrations Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Recent Registrations
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Event</th>
                    <th className="text-left p-2">Type</th>
                    <th className="text-left p-2">Fee</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.slice(-5).reverse().map((reg, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{reg.name}</td>
                      <td className="p-2">{reg.email}</td>
                      <td className="p-2">{reg.event_name}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          reg.registration_type === 'team' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {reg.registration_type}
                        </span>
                      </td>
                      <td className="p-2">₹{reg.entry_fee}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          reg.payment_status === 'success' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {reg.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {registrations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No registrations yet
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
