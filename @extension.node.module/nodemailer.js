var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: 'g.basavaraj01@gmail.com',
        pass: '<gunjnoor>'
    }
});

const mailOptions = {
  from: 'g.basavaraj01@gmail.com', // sender address
  to: 'basu.ydg@gmail.com', // list of receivers
  subject: 'Nodemailer testing', // Subject line
  html: '<p>Your html here</p>'// plain text body
};


transporter.sendMail(mailOptions, function (err, info) {
   if(err)
     console.log(err)
   else
     console.log(info);
});
