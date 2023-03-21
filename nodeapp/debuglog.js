const debuglog = module.exports = {}
debuglog.log = function(data) {
    console.log(data);
    const fs = require('fs');

    function stringify(obj) {
        let cache = [];
        let str = JSON.stringify(obj, function(key, value) {
          if (typeof value === "object" && value !== null) {
            if (cache.indexOf(value) !== -1) {
              // Circular reference found, discard key
              return;
            }
            // Store value in our collection
            cache.push(value);
          }
          return value;
        }, 2);
        cache = null; // reset the cache
        return str;
    }
    data = stringify(data, null, 2);
    fs.appendFileSync('/tmp/debuglog.log', data + "\n", 'utf8');
}