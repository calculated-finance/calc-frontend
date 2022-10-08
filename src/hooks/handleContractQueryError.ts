import { appToast } from 'src/pages/_app.page';

export default function handleContractQueryError(error: Error) {
  console.error(error);
  appToast({
    status: 'error',
    title: 'There was an error',
    position: 'top-right',
    description: error.message,
    duration: 9000,
    isClosable: true,
  });
}
