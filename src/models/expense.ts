import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IExpense extends Document {
  user: Types.ObjectId;
  amount: number;
  category: string;
  date: Date;
  createdAt: Date;
  title: string;
}

const ExpenseSchema: Schema<IExpense> = new Schema<IExpense>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
});

export const Expense: Model<IExpense> =
  mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);

export default Expense;

