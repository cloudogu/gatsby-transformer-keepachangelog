const Promise = require("bluebird");
const { onCreateNode } = require("../gatsby-node");

const createNodeId = jest.fn().mockReturnValue("uuid-from-gatsby");
const createContentDigest = jest.fn().mockReturnValue("contentDigest");
const loadNodeContent = (node) => Promise.resolve(node.content);

describe("Processing plaintext nodes", () => {
  let createNode;
  let createParentChildLink;
  let actions;

  beforeEach(() => {
    createNode = jest.fn();
    createParentChildLink = jest.fn();
    actions = { createNode, createParentChildLink };
  });

  const expectNodeCreated = (parent) => {
    expect(createNode).toBeCalledWith(
      expect.objectContaining({
        parent,
        internal: expect.objectContaining({
          type: "Changelog",
        }),
      })
    );

    expect(createParentChildLink).toHaveBeenCalled();
  };

  it("should process changelog files files", async () => {
    const node = {
      id: "42",
      name: "CHANGELOG",
      content: "# Changelog",
      internal: {
        type: "File",
        mediaType: "text/markdown",
        extension: "txt",
      },
    };

    await onCreateNode({
      node,
      actions,
      loadNodeContent,
      createNodeId,
      createContentDigest,
    });

    expectNodeCreated("42");
  });

  it("should ignore other markdown files", async () => {
    const node = {
      id: "21",
      name: "index",
      internal: {
        type: "File",
        mediaType: "text/markdown",
      },
    };

    await onCreateNode({
      node,
      actions,
      loadNodeContent,
      createNodeId,
      createContentDigest,
    });

    expect(createNode).toHaveBeenCalledTimes(0);
  });

  it("should ignore non markdown files", async () => {
    const node = {
      id: "21",
      internal: {
        type: "File",
        mediaType: "image/png",
      },
    };

    await onCreateNode({
      node,
      actions,
      loadNodeContent,
      createNodeId,
      createContentDigest,
    });

    expect(createNode).toHaveBeenCalledTimes(0);
  });
});
