
module.exports = parseObservations;

if (require.main === module) {
    var fs = require("fs");
    var xml = fs.readFileSync("./test.xml").toString();
    console.log(JSON.stringify(parseObservations(xml), null, "  "));
}
