const mongoose = require("mongoose")

const linkSchema = mongoose.Schema({

    url: {
        type: String,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }



})