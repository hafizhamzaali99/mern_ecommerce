const nodeMailer = require('nodemailer')
const handleAsyncError = require('../middleware/handleAsyncError')

const sendEmail = handleAsyncError(async (req, res, next) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        }
    });
    let info = await transporter.sendMail({
        from: "",
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });
})