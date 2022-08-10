const nodeMailer = require('nodemailer')

const sendEmail = async(options)=> {
    let transporter = nodeMailer.createTransport({
        service: process.env.MAIL_SERVICE,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        }
    });
    let info = await transporter.sendMail({
        from: process.env.MAIL_USERNAME,
        to: options.email, // email of receivers
        subject: options.subject, // Subject line
        text: options.subject, // plain text body
    });
    // await transporter.sendMail(info)
}

module.exports = sendEmail;