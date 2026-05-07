const asyncHandler = require("../Middleware/asyncHandler");
const sendEmail = require("../utils/sendEmail");

// @desc    Send contact email
// @route   POST /api/contact
// @access  Public
exports.submitContactForm = asyncHandler(async (req, res) => {
    const { user_name, user_email, message } = req.body;

    if (!user_name || !user_email || !message) {
        res.status(400);
        throw new Error("Please fill in all fields");
    }

    const messageContent = `
        Name: ${user_name}
        Email: ${user_email}
        
        Message:
        ${message}
    `;

    const htmlContent = `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${user_name}</p>
        <p><strong>Email:</strong> ${user_email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    await sendEmail({
        email: process.env.EMAIL_USER, // Send TO yourself
        subject: `Contact Form: New Message from ${user_name}`,
        message: messageContent,
        html: htmlContent,
    });

    res.status(200).json({ success: true, message: "Email sent successfully" });
});
