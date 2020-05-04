const config = require('../../config'),
      mailer = require('nodemailer'),
      { welcome } = require('./welcome_template'),
      { purchase } = require('./purchase_template'),
      { resetPass } = require('./resetpass_template');

require('dotenv').config();
      
const getEmailData = (to, name, token, template, actionData) => {
  let data = null;

  switch(template) {
    case 'welcome':
    data = {  
      from: "Guitars <billvalentine73@gmail.com>",
      to,
      subject: `Welcome to the guitar site ${name}`,
      html:welcome()
    } 
    break;

    case 'purchase':
      data = {  
        from: "Guitars <billvalentine73@gmail.com>",
        to,
        subject: `Thank you for your recent purchase ${name}`,
        html:purchase(actionData)
      } 
    break;
    
    case "reset_password":
      data = {
          from: "Guitars <billvalentine73@gmail.com>",
          to,
          subject: `Hey ${name}, reset your pass`,
          html: resetPass(actionData)
      }
      break;

    break;

    default:
      data;
  }
  return data;
}

const sendEmail = (to, name, token, type, actionData = null) => {

  const smptTransport = mailer.createTransport({
    service: "Gmail",
    auth: {
      user: "billvalentine73@gmail.com",
      pass: config.GMAIL_PASS
    }
  });

  const mail = getEmailData(to, name, token, type, actionData);

  smptTransport.sendMail(mail, function(err, res) {
    if(err) {
      console.log(err)
    } else {
      console.log(res)
    }
    smptTransport.close();
  });

}

module.exports = { sendEmail };