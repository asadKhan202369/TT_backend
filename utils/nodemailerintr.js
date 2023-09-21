const nodemailer = require('nodemailer');
const ErorrHandler = require('./ErrorHandling');

exports.sendmailintr = (email, title, interv) => {
    console.log(email, "its emailuest");
    console.log(title, "its titleponse");
    console.log(interv, "its interv");

    const transport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465, // Corrected property name to "port"
        secure: true, // Use secure connection
        auth: {
            user: process.env.MAIL_EMAIL_ADDRESS,
            pass: process.env.MAIL_EMAIL_PASSWORD
        },
    });

    const mailOptions = {
        from: "Asad Khan <ak1933929@gmail.com>",
        to: email,
        subject: "Interivew Shceduled   ",
        html: `<h1>Click Link</h1>
              <a>HEllo</a>
         `
    };

    transport.sendMail(mailOptions, (err, info) => {
        if (err) return next(
            new ErorrHandler(err, 500)
        );
        // console.log(info);
        return res.status(200).json({
            message: "Mail sent successfully",
            otp,
        });
    });
}
