# gatsby-transformer-keepachangelog

Parses files which are written in the [keepachangelog](http://keepachangelog.com/en/1.0.0/) format.

Every file with the name CHANGELOG.md is picked up by the transformer.

## Install

`npm install --save gatsby-transformer-keepachangelog`

**Note:** You also need to have `gatsby-source-filesystem` installed and configured so it points to your files.

## How to use

In your `gatsby-config.js`

```javascript
module.exports = {
  plugins: [
    `gatsby-transformer-keepachangelog`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `./src/data/`,
      },
    },
  ],
}
```

Where the _source folder_ `./src/data/` contains the `CHANGELOG.md` files.

## How to query

You can query the nodes using GraphQL, like from the GraphiQL browser: `http://localhost:8000/___graphql`.

```graphql
{
  allChangelog {
    nodes {
      versions {
        tag
        date
        changes {
          html
        }
      }
    }
  }
}
```

Which would return:

```json
{
  "data": {
    "allChangelog": {
      "nodes": [
        {
          "versions": [
            {
              "tag": "1.0.0",
              "date": "2020-04-09T00:00:00.000Z",
              "changes": {
                "html": "<h3>Fixed</h3>..."
              }
            },
            {
              "tag": "1.0.0-RC1",
              "date": "2020-03-26T00:00:00.000Z",
              "changes": {
                "html": "<h3>Added</h3>..."
              }
            }
          ]
        }
      ]
    }
  }
}
```
