import Head from 'next/head';
import { Button } from '@chakra-ui/react';

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <Button onClick={() => methodDoesNotExist()}>Break the world</Button>;
}
