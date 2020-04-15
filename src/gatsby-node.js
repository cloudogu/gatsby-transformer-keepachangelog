const { parser } = require("keep-a-changelog");

function isChangelogFile(node) {
  return (
    node.internal.mediaType === "text/markdown" &&
    node.internal.type === "File" &&
    node.name === "CHANGELOG"
  );
}

function changelogToJson(changelog) {
  return {
    title: changelog.title,
    description: changelog.description,
    head: changelog.head,
    footer: changelog.footer,
    url: changelog.url,
    releases: releasesToJson(changelog.releases),
  };
}

function releasesToJson(releases) {
  return releases.map((release) => {
    return {
      version: release.version.toString(),
      date: release.date,
      description: release.description,
      changes: changesToJson(release.changes),
    };
  });
}

function changesToJson(changesMap) {
  return {
    added: changeArrayToJson(changesMap.get("added")),
    changed: changeArrayToJson(changesMap.get("changed")),
    deprecated: changeArrayToJson(changesMap.get("deprecated")),
    removed: changeArrayToJson(changesMap["removed"]),
    fixed: changeArrayToJson(changesMap.get("fixed")),
    security: changeArrayToJson(changesMap.get("security")),
  };
}

function changeArrayToJson(changeArray) {
  const change = (changeArray || []).map((change) => {
    return {
      title: change.title,
      description: change.description,
      issues: change.issues,
    };
  });
  return change;
}

exports.onCreateNode = async (
  { node, actions, loadNodeContent, createNodeId, createContentDigest },
  pluginOptions
) => {
  if (!isChangelogFile(node)) {
    return;
  }

  const { createNode, createParentChildLink } = actions;

  const content = await loadNodeContent(node);
  const changelog = changelogToJson(parser(content));

  const id = createNodeId(`${node.id} >>> Changelog`);

  const changelogNode = {
    ...changelog,
    id,
    children: [],
    parent: node.id,
    internal: {
      contentDigest: createContentDigest(changelog),
      type: "Changelog",
    },
  };

  createNode(changelogNode);
  createParentChildLink({ parent: node, child: changelogNode });
}

exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    Changelog: {
      releases: {
        args: {
          version: "String",
        },
        resolve(source, args) {
          if (!args.version) {
            return source.releases;
          }
          return source.releases.filter(
            (release) => release.version === args.version
          );
        },
      },
    },
  };
  createResolvers(resolvers);
};
