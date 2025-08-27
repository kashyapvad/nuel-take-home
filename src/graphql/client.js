import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const apolloClient = new ApolloClient({
  link: new SchemaLink({ schema }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export const filtersVar = makeVar({
  search: '',
  warehouse: '',
  status: 'all',
  dateRange: '7d'
});

export const drawerVar = makeVar({
  isOpen: false,
  productId: null
});