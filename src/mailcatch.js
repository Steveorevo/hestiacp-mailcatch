// Our shim to start maildev services under PM2
const MailDev = require('/opt/maildev/index.js');
const maildev = new MailDev()
maildev.listen()
