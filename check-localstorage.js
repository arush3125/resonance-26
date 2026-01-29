// Simple script to check localStorage data
console.log('=== Checking LocalStorage Data ===');

const registrations = JSON.parse(localStorage.getItem('registrationData') || '[]');
const teamMembers = JSON.parse(localStorage.getItem('teamMemberData') || '[]');

console.log('📊 Registrations:', registrations.length);
console.log('👥 Team Members:', teamMembers.length);

if (registrations.length > 0) {
  console.log('\n📋 Latest Registration:');
  console.log(registrations[registrations.length - 1]);
}

if (teamMembers.length > 0) {
  console.log('\n👥 Latest Team Members:');
  console.log(teamMembers.slice(-3)); // Show last 3 team members
}

console.log('\n=== End Check ===');
