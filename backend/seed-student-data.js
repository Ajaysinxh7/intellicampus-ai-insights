const mongoose = require('mongoose');
require('dotenv').config();

const AttendanceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  subject: { type: String, required: true },
  totalClasses: { type: Number, required: true, default: 0 },
  attendedClasses: { type: Number, required: true, default: 0 },
});

const MarksSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  subject: { type: String, required: true },
  marksObtained: { type: Number, required: true, default: 0 },
  totalMarks: { type: Number, required: true, default: 100 },
});

const Attendance = mongoose.model('Attendance', AttendanceSchema);
const Marks = mongoose.model('Marks', MarksSchema);

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Get user ID from command line argument or use a default
    const userId = process.argv[2];
    
    if (!userId) {
      console.log('Usage: node seed-student-data.js <userId>');
      console.log('Example: node seed-student-data.js 507f1f77bcf86cd799439011');
      process.exit(1);
    }

    console.log(`Seeding data for user: ${userId}`);

    // Sample attendance data (some below 75%, some above)
    const attendanceData = [
      { userId, subject: 'DBMS', totalClasses: 30, attendedClasses: 20 }, // 66.67%
      { userId, subject: 'Data Structures', totalClasses: 25, attendedClasses: 20 }, // 80%
      { userId, subject: 'Operating Systems', totalClasses: 28, attendedClasses: 18 }, // 64.29%
      { userId, subject: 'Computer Networks', totalClasses: 30, attendedClasses: 25 }, // 83.33%
    ];

    // Sample marks data
    const marksData = [
      { userId, subject: 'DBMS', marksObtained: 68, totalMarks: 100 }, // 68%
      { userId, subject: 'Data Structures', marksObtained: 85, totalMarks: 100 }, // 85%
      { userId, subject: 'Operating Systems', marksObtained: 72, totalMarks: 100 }, // 72%
      { userId, subject: 'Computer Networks', marksObtained: 90, totalMarks: 100 }, // 90%
    ];

    // Clear existing data for this user
    await Attendance.deleteMany({ userId });
    await Marks.deleteMany({ userId });

    // Insert new data
    await Attendance.insertMany(attendanceData);
    await Marks.insertMany(marksData);

    console.log('✅ Sample data seeded successfully!');
    console.log('\nAttendance Data:');
    attendanceData.forEach(item => {
      const percentage = (item.attendedClasses / item.totalClasses * 100).toFixed(2);
      console.log(`  ${item.subject}: ${item.attendedClasses}/${item.totalClasses} (${percentage}%)`);
    });
    console.log('\nMarks Data:');
    marksData.forEach(item => {
      const percentage = (item.marksObtained / item.totalMarks * 100).toFixed(2);
      console.log(`  ${item.subject}: ${item.marksObtained}/${item.totalMarks} (${percentage}%)`);
    });

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedData();


