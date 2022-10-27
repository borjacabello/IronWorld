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
      default: "https://www.esade.edu/sites/default/files/styles/contenido_generico_v4/public/pr_assets/contenido_generico_v04_items/image/46887/782041/img_code_46887_782041.jpg"
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
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }],
    likes: {
      type: Number,
      default: 0
    },
    whoLikes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
  },
  {
    timestamps: true,
  }
);

const Publication = mongoose.model("Publication", publicationSchema);

module.exports = Publication;
