import { createContext } from 'react';
import { NetworkContextProps } from "./NetworkContextProps";


export const Context = createContext<NetworkContextProps>({
  tmClient: null,
  query: null,
});
