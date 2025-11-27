import mongoose, { Document, Schema } from "mongoose";

export interface IAttendance extends Document {
  userId: string;
  subject: string;
  totalClasses: number;
  attendedClasses: number;
}

const AttendanceSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  subject: { type: String, required: true },
  totalClasses: { type: Number, required: true, default: 0 },
  attendedClasses: { type: Number, required: true, default: 0 },
});

const Attendance = mongoose.model<IAttendance>("Attendance", AttendanceSchema);

export default Attendance;

