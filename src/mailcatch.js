// Our shim to start mailcatch services under PM2
const MailDev = require('/opt/mailcatch/index.js');
const maildev = new MailDev()
maildev.listen()
