import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // ensures no duplicate usernames
        lowercase: true, // normalizes input → avoids "Ayush" vs "ayush"
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // important for login consistency
        trim: true
    },

    password: {
        type: String,
        required: true
        // will be hashed using bcrypt → never store plain text
    },

    name: {
        type: String,
        required: true,
        trim: true // full name (display purpose, not unique)
    },

    bio: {
        type: String,
        default: "",
        trim: true // cleans user input
    },

    age: {
        type: Number,
        required: true,
        min: 1 // prevents invalid values like negative age
    },

    profilePhoto: {
        type: String,
        default: "" // stores image URL (cloud storage in real apps)
    },

    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
            // self-referencing relationship → User follows User
        }
    ],

    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
            // helps track whom the user follows
        }
    ],

    isVerified: {
        type: Boolean,
        default: false // used for badges / trust system
    },

    country: {
        type: String,
        required: true,
        trim: true
    },

    website: {
        type: String,
        default: "" // optional external link (portfolio, etc.)
    }

}, { timestamps: true });  // adds createdAt & updatedAt automatically

export const User = mongoose.model("User", userSchema);