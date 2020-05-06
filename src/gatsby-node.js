const parse = require("./parser");

const isChangelogNode = (node) => {
  return (
    node.internal.type === "File" &&
    node.internal.mediaType === "text/markdown" &&
    node.name &&
    "CHANGELOG" === node.name.toUpperCase()
  );
};

exports.onCreateNode = async ({
  node,
  actions,
  loadNodeContent,
  createNodeId,
  createContentDigest,
}) => {
  if (!isChangelogNode(node)) {
    return;
  }
  const { createNode, createParentChildLink } = actions;
  const content = await loadNodeContent(node);
  const changelog = parse(content);
  const id = createNodeId(`${node.id} >>> Changelog`);
  const changelogNode = {
    ...changelog,
    id,
    children: [],
    parent: node.id,
    internal: {
      contentDigest: createContentDigest(content),
      type: "Changelog",
    },
  };
  createNode(changelogNode);
  createParentChildLink({
    parent: node,
    child: changelogNode,
  });
};

exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    Changelog: {
      versions: {
        args: {
          tag: "String",
        },
        resolve(source, args) {
          if (!args.tag) {
            return source.versions;
          }
          return source.versions.filter(
            (version) => version.tag === args.tag
          );
        },
      },
    },
  };
  createResolvers(resolvers);
};
