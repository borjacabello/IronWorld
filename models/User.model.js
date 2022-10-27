const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    age: {
      type: Number,
    },
    profileImage: {
      type: String,
      default: "https://pixlok.com/wp-content/uploads/2021/03/default-user-profile-picture.jpg"
    },
    role: {
      type: String,
      enum: ["admin", "moderator", "user"],
      default: "user"
    },
    links: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Link"
    }],
    friends: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        state: {
          type: String,
          enum: ["add friend", "requested", "pending", "friends"],
        }
      }
    ],
    publications: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Publication"
    }],
    favourites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Publication"
    }]
  },
  {   
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
