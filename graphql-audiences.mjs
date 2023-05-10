import { gql, GraphQLClient } from 'graphql-request';
import dotenv from 'dotenv';
dotenv.config();

function traverseAst(node, indent = 0) {
  const indentLevel = ' '.repeat(indent);
  console.log(`${indentLevel}Type: ${node.type}`);
  console.log(`${indentLevel}Value: ${node.value}`);
  console.log(`${indentLevel}Children:`);

  if (Array.isArray(node.children)) {
    for (let child of node.children) {
      traverseAst(child, indent + 2);
    }
  }
}

const graphQLClient = new GraphQLClient('https://gateway-api.segment.com/graphql', {
  headers: {
      authorization: 'Bearer ' + process.env.AUTH_KEY,
  },
});

const query = gql`
  query spacesQuery {
    workspace(slug: "xp-investimentos") {
      spaces {
        id
        name
        audiences {
          data {
            id
            key
            name
            size
            createdAt
            createdBy {
              email
            }
            definition {
              options
            }
          }
        }
      }
    }
  }
`;

const results = await graphQLClient.request(query);
for (let space of results.workspace.spaces) {
  for (let audience of space.audiences.data) {
    console.log(`Audience: ${audience.name}`);
    console.log(`Size: ${audience.size}`);
    console.log(`Created by: ${audience.createdBy.email}`);
    console.log(`Created at: ${audience.createdAt}`);
    console.log('---');
    console.log(`Definition:`);
    traverseAst(audience.definition.options.ast);
    console.log('---');
  }
}
