import express from "express";
import userAuth from "../middleware/userAuth.js"; // Login check
import uploadDoc from "../config/docMulterConfig.js"; // File upload logic
import { generateDocument } from "../controllers/docController.js"; // Main Logic

const docRouter = express.Router();

// POST Request handle karega
// Flow: Check Login -> Upload File -> Run Logic
docRouter.post("/generate", userAuth, uploadDoc.single("file"), generateDocument);

export default docRouter;