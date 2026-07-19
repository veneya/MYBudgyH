const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendResetEmail = async (email, resetLink) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset - MyBudgyH',
        html: `<p>Click the link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`
    };
    await transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail };