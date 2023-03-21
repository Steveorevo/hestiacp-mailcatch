'use strict'

const smtpHelpers = module.exports = {}

/**
 * Authorize callback for smtp server
 */
smtpHelpers.createOnAuthCallback = function (username, password) {
  return function onAuth (auth, session, callback) {

    // Check username as domain and match password from private/smtp.json
    const fs = require('fs');
    const path = require('path');
    const glob = require('glob');

    function findSMTPConfig(domain) {
      domain = domain.replace(/\.\.\/|\.\/|\\/g, ''); // Sanitize
      const homeDir = '/home';
      const domainDir = path.join(homeDir, '*/web', domain, 'private');
      const smtpFilePath = path.join(domainDir, 'smtp.json');

      try {
        const smtpFiles = glob.sync(smtpFilePath);
        for (const smtpFile of smtpFiles) {
          if (fs.existsSync(smtpFile)) {
            const content = fs.readFileSync(smtpFile, 'utf8');
            const smtpConfig = JSON.parse(content);
            return smtpConfig;
          }
        }
        console.error(`Error ${smtpFilePath} file not found.`);
        return false;
      } catch (err) {
        console.error(`Error locating SMTP configuration file: ${err.message}`);
        return false;
      }
    }
    let smtp = findSMTPConfig(auth.username);
    if (smtp == false) return callback(new Error('Invalid username or password'));
    try {
      if (smtp.password !== auth.password) {
        return callback(new Error('Invalid username or password'))
      }
      username = auth.username;
    }catch(err) {
      console.error(`Error verifying SMTP configuration file password: ${err.message}`);
      return callback(new Error('Invalid username or password'));
    }
    callback(new Error('Invalid username or password'));
    //callback(null, { user: username })
  }
}
