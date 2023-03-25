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
    let mailcatcher_domain = process.env.MAILCATCHER_DOMAIN;
    let mailcatcher_pw = '';
    let smtp_file = '/home/' + process.env.USER + '/web/' + mailcatcher_domain + '/private/smtp.json';
    if ( fs.existsSync(smtp_file) ) {
        let smtp_cred = JSON.parse(fs.readFileSync(smtp_file, 'utf8'));
        mailcatcher_domain = smtp_cred.username;
        mailcatcher_pw = smtp_cred.password;
    }else{

        // Attempt to guess domain based on PWD + OLDPWD
        mailcatcher_domain = process.env.PWD + process.env.OLDPWD;
        if ( mailcatcher_domain.indexOf( '/home/' + process.env.USER + '/web/' ) != -1 ) {
          String.prototype.delLeftMost = function (sFind) {
            for (var i = 0; i < this.length; i = i + 1) {
                var f = this.indexOf(sFind, i);
                if (f != -1) {
                    return this.substring(f + sFind.length, f + sFind.length + this.length);
                    break;
                }
            }
            return this;
          };
          String.prototype.getLeftMost = function (sFind) {
            for (var i = 0; i < this.length; i = i + 1) {
                var f = this.indexOf(sFind, i);
                if (f != -1) {
                    return this.substring(0, f);
                    break;
                }
            }
            return this;
          };
          mailcatcher_domain = mailcatcher_domain.delLeftMost( '/home/' + process.env.USER + '/web/' ).getLeftMost( '/' );
          smtp_file = '/home/' + process.env.USER + '/web/' + mailcatcher_domain + '/private/smtp.json';
          if ( fs.existsSync(smtp_file) ) {
              let smtp_cred = JSON.parse(fs.readFileSync(smtp_file, 'utf8'));
              mailcatcher_domain = smtp_cred.username;
              mailcatcher_pw = smtp_cred.password;
          }else{
            console.log('SMTP credentials file not found: ' + smtp_file + ' is MAILCATCHER_DOMAIN env. variable set?');
          }
        }else{
          console.log('SMTP credentials file not found: ' + smtp_file + ' is MAILCATCHER_DOMAIN env. variable set?');
        }
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
