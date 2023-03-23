// Our shim to start mailcatcher services under PM2
const MailDev = require('/opt/mailcatcher/index.js');
const maildev = new MailDev()
maildev.listen()
