"use strict";

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_EMAIL_API);


exports.sendMail = async function ({name,email, body, subject}) {
    let templateId = 'd-dc51f9383d3d48058198548a91c83ddf'
    const msg = {
        to: email,
        from: {
            name: `Petter Promowicz`,
            email: 'trafikk@ekspress-frakt.no'
        }, 
        // substitutions: {
        //     name: name,
        //     htmlBody: body,
        // },
        subject: subject,
        // templateId: templateId,
        html:body

    };
    console.log(msg)
    sgMail.send(msg).then(console.log("email send")).catch(err => {
        console.log(err.response.body.errors)
    });
}