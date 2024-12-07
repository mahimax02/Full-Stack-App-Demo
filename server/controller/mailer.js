import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

import ENV from '../config.js';


// https://ethereal.email/create
let nodeConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: "ENV.EMAIL",
        pass: "ENV.PASSWORD",
    },
}

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: 'https://mailgen.js'
    }
})


/** POST:http://localhost:8080/api/registerMail
 * @param: {
 * "username": "example",
 * "userEmail": "admin@123",
 * "text": "admin@123",
 * "subject": "admin@123"
 * }
 */
export const registerMail = async (req, res) => {
    try {
        const { username, userEmail, text, subject } = req.body;

        if (!username || !userEmail) {
            return res.status(400).send({ error: 'Username and userEmail are required.' });
        }

        // body of the email

        var email = {
            body: {
                name: username,
                intro: text || 'Welcome to Daily Tuition! We\'re very excited to have you on BeforeUnloadEvent.',
                outro: 'Need help, or have question? just reply to this email, we\'d love to help'
            }
        }

        var emailBody;
        try {
            emailBody = MailGenerator.generate(email);
        } catch (err) {
            return res.status(500).send({ error: 'Failed to generate email body.' });
        }

        let message = {
            from: ENV.EMAIL,
            to: userEmail,
            subject: subject || "Signup Successful",
            html: emailBody
        }

        // send mail

        // transporter.sendMail(message)
        //     .then(() => {
        //         return res.status(200).send({ msg: "You should receive an email from us." })
        //     })
        //     .catch(error => res.status(500).send({ error }))

        await transporter.sendMail(message);
        return res.status(200).send({ msg: "You should receive an email from us." })
    } catch (error) {
        console.log("Error sending email:", error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
}