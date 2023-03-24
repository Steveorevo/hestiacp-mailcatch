#!/usr/bin/env node
var chalk = require('chalk');
var fs = require('fs');
var merge = require('merge');
var path = require('path');
var program = require('commander');
var MailParser = require('mailparser').MailParser;

var root = path.join(path.dirname(fs.realpathSync(__filename)), '../');
var catchmail = require(root + 'lib/catchmail.js');
var pkg = require(root + 'package.json');

var CLI = function() {
  var options = {};
  var message = '';

  this.run = function() {
    function logError(error) {
      console.log(chalk.red('ERROR:') + ' ' + error);
    }

    program
        .name('sendmail')
        .description("Multitenancy implementation of catchmail-node's sendmail compatible transport agent for HestiaCP")
        .version(pkg.version)
        .usage('[options] <email>')
        .argument('[email]', 'recipient email address')
        .option('--ip [ip or hostname]', 'Set IP/hostname of SMTP server to send to')
        .option('--port [port]', 'Set port of SMTP server to send to', parseInt)
        .option('-f, --from [from]', 'Set sending address')
        .option('-v, --verbose', 'Display sent message')
        .option('--dump', 'Display options (in JSON) and do not send anything')
        .option('-o', 'ignored')
        .option('-i', 'ignored')
        .option('-t', 'ignored')
        .option('-q', 'ignored')
        .parse(process.argv);

    // no args provided -> display usage
    //if (!process.argv.slice(2).length) {
    //  program.help();
    //}

    if (program.ip) { options.ip = program.ip; }
    if (program.port) { options.port = program.port; }
    if (program.from) { options.from = program.from; }
    if (program.verbose) { options.verbose = true; }

    //message = program.args.join(' ');
    //console.log('message ' + message);

    process.stdin.setEncoding('utf8');

    process.stdin.on('readable', function() {
      var chunk = process.stdin.read();
      if (chunk !== null) {
        message += chunk;
        //process.stdout.write('data: ' + chunk);
      }
    });

    process.stdin.on('end', function() {
      catchmail.init(options);
      if (program.dump) {
        // if --dump just display options
        var opt = catchmail.options();
        if (message) { opt.message = message; }
        console.log(JSON.stringify(opt));
        process.exit(0);
      } else {
        if (!message) {
          logError('missing message text');
          process.exit(70); // EX_SOFTWARE
        } else {

          // Parse and build the message
          var mp = new MailParser();
          mp.on('end', function(mail) {
            if (mail.hasOwnProperty('from')) {
              if (mail.from.hasOwnProperty('name')) {
                if (mail.from == '') {
                  mail.from = options.from;
                }
              }
            }
            mail.headers = null;
            catchmail.send(mail, function(error, info) {
              if (error) {
                logError(error);
                // todo analyze error and refine return code and message
                process.exit(70);
              } else {
                console.log(options.verbose ? JSON.stringify(info) : 'mail sent succesfully');
                process.exit(0);
              }
            });
          });
          
          // Accept to recipient in first argument
          if (program.args.length == 1 && message.trim().startsWith('To: ') == false) {
            message = 'To: ' + program.args[0] + "\n" + message;
          }

          // send the email source to the parser
          mp.write(message);
          mp.end();
        }
      }
    });
  };
};

var cli = new CLI();
cli.run();
