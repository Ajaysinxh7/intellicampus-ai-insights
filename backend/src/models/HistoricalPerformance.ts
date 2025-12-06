import mongoose, { Schema, Document } from 'mongoose';

export interface IHistoricalPerformance extends Document {
    subject: string;
    attendancePercentage: number;
    midTermMarks: number;
    finalGrade: number;
}

const HistoricalPerformanceSchema: Schema = new Schema({
    subject: { type: String, required: true },
    attendancePercentage: { type: Number, required: true },
    midTermMarks: { type: Number, required: true },
    finalGrade: { type: Number, required: true },
});

export const HistoricalPerformance = mongoose.model<IHistoricalPerformance>('HistoricalPerformance', HistoricalPerformanceSchema);
