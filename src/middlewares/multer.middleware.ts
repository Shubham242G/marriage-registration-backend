import multer from "multer";
import path from "path";
import crypto from "crypto";

// Allowed file types for uploads
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg", 
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
];

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + "/public/uploads/");
  },
  filename: function (req, file, cb) {
    // SECURITY FIX: Use random filename to prevent path traversal and predictable names
    const uniqueSuffix = crypto.randomBytes(16).toString("hex");
    const ext = path.extname(file.originalname).toLowerCase();
    // Sanitize extension
    const safeExt = ext.replace(/[^a-z0-9.]/gi, "");
    cb(null, `${file.fieldname}-${Date.now()}-${uniqueSuffix}${safeExt}`);
  },
});

// File filter for security
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`));
  }
};

export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE, // 10MB limit
    files: 10, // Max 10 files per request
  }
});
