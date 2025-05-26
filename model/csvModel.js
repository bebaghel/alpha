import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String,  },
}, { timestamps: true });

  
const csvModel = mongoose.model("Csv", userSchema);
export default csvModel;
