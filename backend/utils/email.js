const nodemailer = require('nodemailer');
const emailPassword = (process.env.EMAIL_PASS || '').replace(/\s/g, '');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: emailPassword
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
});

const sendResetEmail = async (email, resetLink) => {
    const mailOptions = {
        from: `MyBudgyH <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset - MyBudgyH',
        html: `<p>Click the link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`
    };
    await transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail };
