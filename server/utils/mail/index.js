const config = require('../../config'),
      mailer = require('nodemailer'),
      { welcome } = require("./welcome_template");
      
const getEmailData = (to, name, token, template) => {
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
    default:
      data;
  }
  return data;
}

const sendEmail = (to, name, token, type) => {

  const smptTransport = mailer.createTransport({
    service: "Gmail",
    auth: {
      user: "billvalentine73@gmail.com",
      pass: config.GMAIL_PASS
    }
  });

  const mail = getEmailData(to, name, token, type);

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