import express from "express";
import { createMeetingController, deleteMeetingController, getAllMeetingsController, updateMeetingController } from "../controllers/meeting.controller";


const router = express.Router();

router.post("/", createMeetingController);
router.get("/", getAllMeetingsController);
router.put("/:id", updateMeetingController);
router.delete("/:id", deleteMeetingController);

export default router;
