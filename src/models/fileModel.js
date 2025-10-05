import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  data: { type: Array, required: true }
});

const File = mongoose.model("File", fileSchema);
export default File;
