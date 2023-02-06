import * as mongoose from 'mongoose';

export const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: {
    type: mongoose.Types.ObjectId,
  },
  createdOn: { type: Date },
});

export interface Blog extends mongoose.Document {
  id: string;
  title: string;
  description: string;
  createdBy: mongoose.Types.ObjectId;
  createdOn: Date;
}
