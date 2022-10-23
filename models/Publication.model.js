const mongoose = require("mongoose");

const publicationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    file: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approved: {
      type: Boolean,
      enum: [true, false],
      default: false
    },
    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Comment"
    }
  },
  {
    timestamps: true,
  }
);

const Publication = mongoose.model("Publication", publicationSchema);

module.exports = Publication;
