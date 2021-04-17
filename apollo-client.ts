import { ApolloClient, HttpLink, ApolloLink, InMemoryCache, concat } from '@apollo/client';

const httpLink = new HttpLink({ uri: 'http://localhost:3001/graphql' });

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
        authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwN2FjNTk5NjA1MTMyMjEwNDY3Yjg1NSIsInVzZXJuYW1lIjoibWFya3kiLCJpYXQiOjE2MTg2NjQ4MzgsImV4cCI6MTYxODY2ODQzOH0.UidG_3fxZTyfwpwR2-qQEAzl4hNj2TM-7sOjzyEZoUU"  || null,
    }
  });

  return forward(operation);
})

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            merge(existing, incoming){
                return incoming
              }
          }
        }
      }
    }
  }),
  link: concat(authMiddleware, httpLink),
});
export default client;
