import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { HistoricalPerformance } from './src/models/HistoricalPerformance';

dotenv.config();

const MONGO_URI = process.env.MONGO_URL || 'mongodb://localhost:27017/intellicampus';

const subjects = ['Mathematics', 'Physics', 'Computer Science', 'English', 'History', 'DBMS'];

const generateRandomData = () => {
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    // Attendance between 60% and 100%
    const attendancePercentage = Math.floor(Math.random() * 41) + 60;
    // Midterm marks between 50 and 100
    const midTermMarks = Math.floor(Math.random() * 51) + 50;

    // Logic to make final grade STRONGLY correlated to attendance
    // Formula: Grade = 0.8 * Attendance + Random Variance
    // This ensues a positive slope.
    let finalGrade = Math.round((0.8 * attendancePercentage) + (Math.random() * 20 - 10));

    // Clamp grade between 0 and 100
    finalGrade = Math.max(0, Math.min(100, finalGrade));

    return {
        subject,
        attendancePercentage,
        midTermMarks,
        finalGrade
    };
};

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data to fix regression model
        await HistoricalPerformance.deleteMany({});
        console.log('Cleared existing data');

        const data: any[] = [];
        for (let i = 0; i < 50; i++) {
            data.push(generateRandomData());
        }

        await HistoricalPerformance.insertMany(data);
        console.log(`Successfully seeded ${data.length} records.`);

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
