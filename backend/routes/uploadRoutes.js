const express = require("express");
const router = express.Router();

const upload = require("../middlewares/uploadMiddleware");

const { uploadFile } = require("../controllers/uploadController");

const auth = require("../middlewares/authMiddleware");

router.post(
    "/upload",
    auth,
    upload.single("file"),
    uploadFile
);
module.exports = router;