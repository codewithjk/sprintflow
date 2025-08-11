import { Router } from 'express';
import { FileUploadController } from '../controllers/upload-file.controller';
import multer from 'multer';


const router = Router();

// const upload = multer({
//   storage: multer.memoryStorage(),
// });
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max per file
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("application/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images or documents are allowed"));
    }
  },
});


router.post('/',upload.array("files", 10), FileUploadController);

export default router;