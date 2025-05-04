const express = require("express");
const { uploadNote, getAllNotes, bookmarked } = require("../../controllers/noteController");
const upload = require("../../utils/multer");

const router = express.Router();

router.post("/upload", upload.array("files", 10), uploadNote);
router.get("/:id", getAllNotes);
router.put("/bookmarked/:id", bookmarked);


module.exports = router;
