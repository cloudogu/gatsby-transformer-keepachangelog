const unified = require("unified");
const markdown = require("remark-parse");
const remark = require("remark");
const remark2rehype = require("remark-rehype");
const strip = require('strip-markdown');
const html = require('rehype-stringify')


const textProcessor = remark()
  .use(strip);

const htmlProcessor = unified()
  .use(markdown)
  .use(remark2rehype)
  .use(html);

const toPlainText = (content) => {
  return String(textProcessor.processSync( content )).trim();
}; 

const toHtml = (content) => {
  return String(htmlProcessor.processSync(content));
};

module.exports = (content) => {
  const lines = content.split(/\r\n|\r|\n/);

  let head = "";
  let versions;
  let currentVersion;

  lines.forEach(line => {
    if (line.startsWith("## ")) {
      if (!versions) {
        versions = [];
      }
      let heading = toPlainText(line);
      
      const parts = heading.split(" - ");
      const tag = parts[0];

      let date;
      if (parts.length > 0) {
        date = new Date(parts[1]);
      }

      currentVersion = {
        tag,
        date,
        raw: line
      };

      versions.push(currentVersion);
    } else if (!versions) {
      head += line + "\n";
    } else if (currentVersion) {
      currentVersion.raw += "\n" + line;
      if (!currentVersion.changes) {
        currentVersion.changes = {
          raw: line
        };
      } else {
        currentVersion.changes.raw += "\n" + line;
      }
    }
  });

  if (versions) {
    versions.forEach(v => {
      v.html = String(htmlProcessor.processSync(v.raw));
      if (v.changes) {
        v.changes.html = String(htmlProcessor.processSync(v.changes.raw));
      }
    })
  }

  head = head.trim();
  const changelog = {
    head: {
      raw: head,
      html: toHtml(head)
    },
    versions,
    raw: content,
    html: toHtml(content)
  };

  return changelog;
};
