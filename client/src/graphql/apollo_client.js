import { ApolloClient, from, HttpLink, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from '@apollo/client/link/context';
//handle errors
const errorsLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, path, locations }) =>
      console.log(
        `[GraphQL Error: Message: ${message} Path:${path} , Locations : ${locations}]`
      )
    );
  }
  if (networkError) console.log(`[Network Error] :${networkError}`);
});
const httpLink = new HttpLink({
  uri: "http://localhost:3001/",
});

//context
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  ssrMode: true,
  link: authLink.concat(from([errorsLink, httpLink])),
  cache: new InMemoryCache(),
});

export default client;
