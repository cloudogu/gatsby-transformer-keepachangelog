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

Regardless of whether you choose to structure your data in arrays of objects or
single objects, you'd be able to query your letters like:

```graphql
{
  allChangelog {
    edges {
      node {
        
      }
    }
  }
}
```

Which would return:

```javascript
{
  allChangelog: {
    edges: [
      
    ]
  }
}
