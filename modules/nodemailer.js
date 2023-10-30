const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_ACCOUNT,
    pass: process.env.GMAIL_APP_PASS,
  },
});

exports.sendValidationEmail = (recieverData) => {
  const mailOptions = {
    from: {
      name: "URL Shortener",
      adress: process.env.GMAIL_ACCOUNT,
    },
    to: recieverData.email,
    subject: "URL Shortener - Account verification",
    html: `<span style="color: black">Hi <b>${recieverData.username}</b>,<br><br>To verify your <b>URL Shortener
      </b> account click on this: <a href="${process.env.WEB_APP_LINK}/account-verification/${recieverData._id}">
      link</a><br><br>URL Shortener Application</span>`,
  };
  sendMail(mailOptions);
};

exports.sendAfterValidationEmail = (recieverData) => {
  const mailOptions = {
    from: {
      name: "URL Shortener",
      adress: process.env.GMAIL_ACCOUNT,
    },
    to: recieverData.email,
    subject: "URL Shortener - Account status update",
    html: `<span style="color: black">Hi <b>${recieverData.username}</b>,<br><br>Your <b>URL Shortener
      </b> account has been succesfully verifed.<br><br>URL Shortener Application</span>`,
  };
  sendMail(mailOptions);
};

exports.sendBeforePasswordReset = (recieverData, hash) => {
  const mailOptions = {
    from: {
      name: "URL Shortener",
      adress: process.env.GMAIL_ACCOUNT,
    },
    to: recieverData.email,
    subject: "URL Shortener - Password reset request",
    html: `<span style="color: black">Hi <b>${recieverData.username}</b>,<br><br>To reset your <b>URL 
    Shortener</b> password click on this: <a href="${process.env.WEB_APP_LINK}/reset-password/${hash}">
    link</a><br><br>URL Shortener Application</span>`,
  };
  sendMail(mailOptions);
};

exports.sendAfterPasswordReset = (recieverData) => {
  const mailOptions = {
    from: {
      name: "URL Shortener",
      adress: process.env.GMAIL_ACCOUNT,
    },
    to: recieverData.email,
    subject: "URL Shortener - Password changed",
    html: `<span style="color: black">Hi <b>${recieverData.username}</b>,<br><br>Your <b>URL Shortener</b> 
    password has been changed.<br><br>URL Shortener Application</span>`,
  };
  sendMail(mailOptions);
};

function sendMail(mailOptions) {
  transporter.sendMail(mailOptions).catch((error) => console.error(error));
}
