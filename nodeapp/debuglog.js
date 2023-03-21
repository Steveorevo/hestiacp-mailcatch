const debuglog = module.exports = {}
debuglog.log = function(data) {
    console.log(data);
    const fs = require('fs');
    data = JSON.stringify(data, null, 2);
    fs.appendFileSync('/tmp/debuglog.log', data + "\n", 'utf8');
}