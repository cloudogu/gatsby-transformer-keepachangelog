const { parser } = require("keep-a-changelog");
const fs = require("fs");


const path =
  "/Users/sdorra/Projects/github.com/gatsby-transformer-keepachangelog-test/src/content/CHANGELOG.md";
//Parse a changelog file
const changelog = parser(fs.readFileSync(path, "UTF-8"));

//Generate the new changelog string
console.log(JSON.stringify(changelogToJson(changelog), null, 2));
