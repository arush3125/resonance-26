// Add sample registration data for testing admin dashboard
const sampleRegistrations = [
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    college: "Computer Science - Year 3",
    event_id: "1",
    event_name: "Singing Competition",
    entry_fee: 100,
    razorpay_payment_id: "pay_test123",
    payment_status: "success",
    registration_type: "solo",
    team_name: undefined,
    team_size: 1,
    created_at: new Date().toISOString()
  },
  {
    name: "Tech Team",
    email: "leader@example.com",
    phone: "+91 9876543211",
    college: "Team: Tech Team (3 members)",
    event_id: "2",
    event_name: "Coding Competition",
    entry_fee: 300,
    razorpay_payment_id: "pay_test456",
    payment_status: "success",
    registration_type: "team",
    team_name: "Tech Team",
    team_size: 3,
    created_at: new Date().toISOString()
  }
];

const sampleTeamMembers = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+91 9876543212",
    branch: "Computer Science",
    year: "3",
    role: "leader"
  },
  {
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "+91 9876543213",
    branch: "Computer Science",
    year: "2",
    role: "member"
  },
  {
    name: "Charlie Brown",
    email: "charlie@example.com",
    phone: "+91 9876543214",
    branch: "Information Technology",
    year: "3",
    role: "member"
  }
];

// Save to localStorage
localStorage.setItem('registrationData', JSON.stringify(sampleRegistrations));
localStorage.setItem('teamMemberData', JSON.stringify(sampleTeamMembers));

console.log('Sample data added to localStorage');
console.log('Registrations:', sampleRegistrations.length);
console.log('Team Members:', sampleTeamMembers.length);
