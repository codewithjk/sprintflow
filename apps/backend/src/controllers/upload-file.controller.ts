import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../../libs/shared/constants/http-status.enum";
import * as admin from "firebase-admin";
import { config } from "dotenv";
config();

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG as string);
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

export const FileUploadController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let files: Express.Multer.File[] = [];

    if (Array.isArray(req.files)) {
      files = req.files;
    } else if (typeof req.files === "object") {
      files = Object.values(req.files).flat();
    }

    if (!files || files.length === 0) {
       res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "No files uploaded" });
    } else {
        
    const uploadResults = await Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const uniqueFileName = `${Date.now()}-${file.originalname}`;
          const storageFile = bucket.file(uniqueFileName);
          const fileStream = storageFile.createWriteStream({
            metadata: {
              contentType: file.mimetype,
            },
          });

          fileStream.on("error", (error) => {
            console.error(`Error uploading file ${uniqueFileName}:`, error);
            reject({ error: `Failed to upload file: ${file.originalname}` });
          });

          fileStream.on("finish", async () => {
            try {
              // Option 1: Make public
              await storageFile.makePublic();
              const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFileName}`;

             

              resolve({
                url: publicUrl,
                downloadLink: publicUrl,
                previewLink: publicUrl,
                fileType: file.mimetype,
              });
            } catch (error) {
              console.error(
                `Error generating signed URL for: ${uniqueFileName}`,
                error
              );
              reject({
                error: `Failed to generate access link for: ${file.originalname}`,
              });
            }
          });

          fileStream.end(file.buffer);
        });
      })
    );

    res.status(HttpStatus.OK).json(uploadResults);
    }

  } catch (error) {
    console.error("Error during file uploads:", error);
    next(error);
  }
};
