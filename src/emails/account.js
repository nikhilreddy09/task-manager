const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email , name) => {

    sgMail.send({
        to : email,
        from : 'gudibandisainikhilreddy@gmail.com',
        subject : 'Welcome to the application',
        text : `welcome to the application , ${name} . Enjoy your time!`
    })

}

const sendCancellationEmail = (email, name) => {
    sgMail.send ({
        to : email,
        from : 'gudibandisainikhilreddy@gmail.com',
        subject : 'We will Miss you',
        text : `Thanks for trying the application, ${name} .`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}