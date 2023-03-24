var merge = require('merge');
var nodemailer = require('nodemailer');

module.exports = new CatchMail();

function CatchMail() {
  var _defaults = {
    ip: '127.0.0.1',
    port: 2525
  };

  var _opt = {};

  this.init = function(options) {
    merge.recursive(_opt, _defaults, options);
  };

  this.option = function(key) {
    return _opt[key];
  };

  this.options = function() {
    return merge.clone(_opt);
  };

  this.defaults = function() {
    return merge.clone(_defaults);
  };

  /**
   *
   * @param {Object} message passed straight to nodemailer transport.send
   */
  this.send = function(message, callback) {

    // Find domain's SMTP credentials
    const fs = require('fs');
    let mailcatcher_domain = process.env.MAILCATCHER_DOMAIN; // TODO: guess domain for nodejs processes?
    let mailcatcher_pw = '';
    const smtp_file = '/home/' + process.env.USER + '/web/' + mailcatcher_domain + '/private/smtp.json';
    if ( fs.existsSync(smtp_file) ) {
        let smtp_cred = JSON.parse(fs.readFileSync(smtp_file, 'utf8'));
        mailcatcher_domain = smtp_cred.username;
        mailcatcher_pw = smtp_cred.password;
    }
    var smtpOptions = {
        port: this.option('port'),
        host: this.option('ip'),
        ignoreTLS: true, // to avoid CERT_HAS_EXPIRED
        auth: { 
            user: mailcatcher_domain,
            pass: mailcatcher_pw
        }
    };
    var transporter = nodemailer.createTransport(smtpOptions);
    transporter.sendMail(message, function(error, info) {
      if (error) {
        console.log(error);
      }
      callback(error, info);
    });
  };
}
