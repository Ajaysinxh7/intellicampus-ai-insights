import mongoose, { Document, Schema } from "mongoose";

export interface IMarks extends Document {
  userId: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
}

const MarksSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  subject: { type: String, required: true },
  marksObtained: { type: Number, required: true, default: 0 },
  totalMarks: { type: Number, required: true, default: 100 },
});

const Marks = mongoose.model<IMarks>("Marks", MarksSchema);

export default Marks;


