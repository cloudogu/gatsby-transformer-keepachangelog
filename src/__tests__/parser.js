const fs = require("fs");
const path = require("path");
const parse = require("../parser");

describe("should parse markdown", () => {

  const content = file => {
    const filepath = path.join(__dirname, `${file}.md`);
    return fs.readFileSync(filepath, { encoding: "utf8" });
  }

  const read = file => {
    return parse(content(file));
  };

  it("should return whole file as head", () => {
    const markdown = content("001");
    const changelog = parse(markdown);
    expect(changelog.head.raw).toBe(markdown.trim());
  });

  it("should return head as html", () => {
    const markdown = content("001");
    const changelog = parse(markdown);
    expect(changelog.head.html).toContain("<h1>Changelog</h1>");
  });

  it("should parse tag of version", () => {
    const changelog = read("002");
    expect(changelog.versions[0].tag).toBe("1.0.0-RC1");
    expect(changelog.versions[0].date).toEqual(new Date("2020-03-17"));
  });

  it("should parse date of version", () => {
    const changelog = read("002");
    expect(changelog.versions[0].date).toEqual(new Date("2020-03-17"));
  });

  it("should add raw body of version", () => {
    const changelog = read("002");
    const version = changelog.versions[0];
    expect(version.raw).toContain("## 1.0.0-RC1");
    expect(version.raw).toContain("- two");
  });

  it("should add html body of version", () => {
    const changelog = read("002");
    const version = changelog.versions[0];
    expect(version.html).toContain("<h2>1.0.0-RC1");
    expect(version.html).toContain("<li>two</li>");
  });

  it("should parse multiple versions", () => {
    const changelog = read("003");

    expect(changelog.versions.length).toBe(2);
    const version = changelog.versions[1];
    expect(version.raw).toContain("### Fixed");
    expect(version.html).toContain("<h2>1.0.0-RC1");
    expect(version.html).toContain("<li>two</li>");
  });

  it("should parse versions with markdown", () => {
    const changelog = read("004");
    expect(changelog.versions[0].tag).toBe("1.0.0");
    expect(changelog.versions[1].tag).toBe("1.0.0-RC1");
  });

  it("should add whole changelog as raw", () => {
    const changelog = read("004");
    expect(changelog.raw).toContain("# Changelog");
    expect(changelog.raw).toContain("- fixed two");
  });

  it("should add whole changelog as html", () => {
    const changelog = read("004");
    expect(changelog.html).toContain("<h1>Changelog</h1>");
    expect(changelog.html).toContain("<li>fixed two</li>");
  });

  it("should return changes as raw", () => {
    const changelog = read("004");
    const changes = changelog.versions[0].changes;
    expect(changes.raw).toContain("### Added");
  });

  it("should return changes as html", () => {
    const changelog = read("004");
    const changes = changelog.versions[0].changes;
    expect(changes.html).toContain("<h3>Added</h3>");
  });

});
