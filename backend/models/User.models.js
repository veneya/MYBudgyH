const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        userMailId: {                          
            type: String,
            required: true,
            lowercase: true
        },

        password: {
            type: String,
            required: [true, "password is required"]
        },

        isActive: {
            type: Boolean,
            default: false
        },

        profileImage: {
            type: String,
            default: ''
        },

        resetPasswordToken: {
            type: String,
            default: undefined   // or null
        },
        
        resetPasswordExpires: {
            type: Date,
            default: undefined
        }

    }, { timestamps: true }
);

userSchema.pre("save", async function() {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePasswords = async function (userpassword) {
    return await bcrypt.compare(userpassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;