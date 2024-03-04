import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';

const extentions = ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mp3', 'pdf', 'docx'];

// Multer upload options
export const multerOptions = {
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    const lengthOfOriginalname = file.originalname.split('.').length;
    const extention = file.originalname.split('.')[lengthOfOriginalname - 1];
    if (extentions.includes(extention)) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },

  // Storage properties
  storage: diskStorage({
    destination: (req, file, cb) => {
      const directoryName = file.mimetype.split('/')[0];
      const uploadPath = `./uploads/${directoryName}s`;

      // Create folder if doesn't exist
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
};
