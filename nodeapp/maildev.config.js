module.exports = {
    apps: (function() {

        // Obtain maildev details
        const fs = require('fs');
        const {execSync} = require('child_process');
        let hostname = execSync('/bin/bash -c "hostname -f"').toString().trim();
        hostname = hostname.split('.').slice(-2).join('.');
        let details = {};
        details.cwd = '/opt/maildev';
        details._app = 'maildev';
        details.name = details._app + '-maildev' + hostname;
        details.script = details.cwd + '/' + details._app + '.js';
        details.watch = ['.restart'];
        details.ignore_watch = [];
        details.watch_delay = 5000;
        details.restart_delay = 5000;

        // Support optional .nvmrc file or default to current version
        let nvmrc = details.cwd + '/.nvmrc';
        let ver = 'current';
        if (fs.existsSync(nvmrc)) {
            ver = fs.readFileSync(nvmrc, {encoding: 'utf8', flat: 'r'}).trim();
        }
        ver = execSync('/bin/bash -c "source /opt/nvm/nvm.sh && nvm which ' + ver + '"').toString().trim();
        if (!fs.existsSync(ver)) {
            console.error(ver);
            process.exit(1);
        }
        details.interpreter = ver;

        // Pass the allocated port number as a -w argument
        let port = 0;
        let pfile = '/usr/local/hestia/data/hcpp/ports/system.ports';
        let ports = fs.readFileSync(pfile, {encoding:'utf8', flag:'r'});
        ports = ports.split(/\r?\n/);
        for( let i = 0; i < ports.length; i++) {
            if (ports[i].indexOf(details._app + '_port') > -1) {
                port = ports[i];
                break;
            }
        }
        port = parseInt(port.trim().split(' ').pop());
        details._port = port;
        details.args = "-w " + details._port + " -s 2525";
        console.log(details);
        return [details];
    })()
}