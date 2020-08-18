const nodemailer = require('nodemailer');

module.exports = {
  sendmail: function(to_addr, subject, body){

    const from_addr = "restaurantapp8530@gmail.com", sender_password = "lur8tlur8t";

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: from_addr,
        pass: sender_password
      },
      tls: {
        rejectUnauthoried: false
      }
    });

    let mailOptions = {
      from: `Restaurant App ${from_addr}`,
      to: to_addr,
      subject: subject,
      html: body
    }

    transporter.sendMail(mailOptions, function(err, info){
      if(err){
        return console.log(err);
      }
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });
  }
}
