import "dotenv/config"; // ✅ No need for require()
import express from "express";
import path from "path";
import cors from "cors";
import DBConnection from "./config/db.js";
// import userRoutes from "./routes/userRoutes.js"; // ✅ Add .js extension
// import authRoutes from "./routes/authRoutes.js"; // ✅ Add .js extension
const PORT = process.env.PORT;
const app = express();
import fs from "fs";
import { Parser } from "json2csv";

import csvModel from "./model/csvModel.js";
DBConnection();
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "views")); // ✅ Use path.resolve() for ES modules

app.use(cors());
app.use(express.json());

// Routes
// app.use("/api/user", userRoutes);
// app.use("/api/auth", authRoutes);

// Serve Static Files
app.use(express.static(path.join(path.resolve(), "public")));
 
import { fileURLToPath } from "url"; 

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/csv", async (req, res) => {
  try {
    const csvData = await csvModel.find().lean();
    console.log("CSV data ", csvData);

    const fields = ["name", "Title"]; // Add more fields if needed
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(csvData);

    const filePath = path.join(__dirname, "csvFile.csv");

    fs.writeFile(filePath, csv, (err) => {
      if (err) {
        console.error("File write error:", err);
        return res.status(500).json({ error: "CSV generation failed" });
      }

      console.log("CSV written successfully");

      res.download(filePath, "csvFile.csv", (err) => {
        if (err) {
          console.error("Download error:", err);
          return;
        }

        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error("File deletion error:", unlinkErr);
          else console.log("Temporary file deleted successfully");
        });
      });
    });
  } catch (err) {
    console.error("CSV generation error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
