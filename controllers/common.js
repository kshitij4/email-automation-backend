"use strict";

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_EMAIL_API);


exports.sendMail = async function ({name,email, body, subject}) {
    let templateId = '58b70fd9-ada3-4310-b049-cfc39fbbd31e'
    const msg = {
        to: email,
        from: {
            name: `Divesh`,
            email: 'tom@nyeglommenrevisjon.com'
        }, 
        substitutions: {
            name: name,
            htmlBody: body,
        },
        subject: subject,
        templateId: templateId,

    };
    console.log(msg)
    sgMail.send(msg).then(console.log("email send")).catch(err => {
        console.log(err.response.body.errors)
    });
}