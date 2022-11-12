import { createContext } from 'react';
import { NetworkContextProps } from './NetworkContext';


export const Context = createContext<NetworkContextProps>({
  tmClient: null,
  query: null,
});
