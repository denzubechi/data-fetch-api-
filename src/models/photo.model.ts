import mongoose, { Document, Schema } from "mongoose";

export interface Photo extends Document {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

const photoSchema = new Schema<Photo>({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
});

const PhotoModel = mongoose.model<Photo>("Photo", photoSchema);

export default PhotoModel;
