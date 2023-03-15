import {
  Heading,
  Stack,
  Text,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  OrderedList,
  ListItem,
  UnorderedList,
  Link,
} from '@chakra-ui/react';
import { CALC_TELEGRAM_URL } from 'src/constants';
import { getSidebarLayout } from '@components/Layout';

function HowItWorks() {
  return (
    <Stack spacing={8}>
      <Stack>
        <Heading size="lg">CALC Finance</Heading>
        <Text textStyle="body">
          CALC is a powerful, decentralized suite of financial tools that give you access to set-and-forget investment
          strategies, so you can spend more time on the things you love.
        </Text>
      </Stack>
      <Stack spacing={4}>
        <Heading fontSize="xl">How CALC works</Heading>
        <Accordion allowToggle>
          <AccordionItem>
            <Heading>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Setting up a Dollar-cost Average (DCA) strategy
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </Heading>
            <AccordionPanel pb={4}>
              <Text textStyle="body" pb={2}>
                Each CALC strategy is broken down into 4 separate, easy-to-follow steps:
              </Text>
              <OrderedList spacing={1} pb={2}>
                <ListItem>
                  Choose your assets
                  <Text textStyle="body">
                    This is where you select your assets going into the vault and coming out of the vault.
                  </Text>
                </ListItem>
                <ListItem>
                  Customize your strategy
                  <Text textStyle="body">
                    This is where you can get fine-grained control over the execution of your strategy.
                  </Text>
                </ListItem>
                <ListItem>
                  Decide what happens next after your chosen asset is purchased or sold
                  <Text textStyle="body">
                    This is where CALC shines, being on-chain CALC can leverage DeFi composability meaning you can
                    automatically move your assets to the desired location without having to be involved in the
                    day-to-day activities.
                  </Text>
                </ListItem>
                <ListItem>
                  Confirm your selections
                  <Text textStyle="body">
                    CALC plays back your selection to you in a simple-to-understand way. DeFi doesn&apos;t need to be
                    complex, so why should setting up a strategy be?
                  </Text>
                </ListItem>
              </OrderedList>
              <Text textStyle="body" pb={2}>
                Then you sign and approve the execution of the strategy.
              </Text>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <Heading>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Topping up a vault
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </Heading>
            <AccordionPanel pb={4}>
              <Text textStyle="body" pb={2}>
                Is your strategy running out of capital? No worries, the key to a good DCA strategy is regular investing
                cycles and CALC makes topping up your vaults easy.
              </Text>
              <OrderedList spacing={1} pb={2}>
                <ListItem>Visit the “My Strategies” page</ListItem>
                <ListItem>Select the active strategy that you want to top up and click “top up”</ListItem>
                <ListItem>Enter the amount you wish to deposit</ListItem>
                <ListItem>Confirm the transaction</ListItem>
                <ListItem>All done! 🎉</ListItem>
              </OrderedList>
              <Text textStyle="body" pb={2}>
                It&apos;s as simple as that. Telegram notifications are coming soon so you don&apos;t have to remember
                when a strategy is running low.
              </Text>
              <Text as="em" textStyle="body" pb={2}>
                *Note: You can not top-up strategies that are already completed.
              </Text>
              <Text textStyle="body" pb={2}>
                When using the fiat on-ramp, you can choose to regularly send money from your bank account to the CALC
                vaults without needing to manually top it up. How good, right?
              </Text>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <Heading>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Wait, what is a vault?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </Heading>
            <AccordionPanel pb={4}>
              <Text textStyle="body" pb={2}>
                It&apos;s just a term that we use to refer to where your capital is stored before your strategy is
                executed. You can think about it like a savings account where money is directly debited from that
                account to perform your strategy.
              </Text>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <Heading>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Is KYC required to use CALC?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </Heading>
            <AccordionPanel pb={4}>
              <Text textStyle="body" pb={2}>
                We know that not everyone is a fan of Know Your Customer (KYC) so we do not enforce KYC to use CALC. It
                is only when you choose to use our on/off-ramp partner, Kado Money, that is KYC required.
              </Text>
              <Text textStyle="body" pb={2}>
                CALC does not store, nor manage any of this data.
              </Text>
              <Text textStyle="body" pb={2}>
                If you prefer not to undergo a KYC check but require an on/off ramp then we suggest using Local Money,
                the peer-to-peer swap protocol also built on Kujira.
              </Text>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <Heading>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Canceling a vault
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </Heading>
            <AccordionPanel pb={4}>
              <Text textStyle="body" pb={2}>
                Don&apos;t like a strategy that you set up? That&apos;s not a problem, we encourage refining your
                strategies to find what works for you.
              </Text>
              <OrderedList spacing={1} pb={2}>
                <ListItem>Visit the “My Strategies” page</ListItem>
                <ListItem>Select the active strategy that you want to cancel and click “cancel”</ListItem>
                <ListItem>You will see the amount you will be returned</ListItem>
                <ListItem>
                  Confirm the cancellation and your funds will be automatically returned to your wallet
                </ListItem>
              </OrderedList>
              <Text textStyle="body" pb={2}>
                Please note, that once you cancel a strategy it can&apos;t be restarted again.
              </Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Stack>
      <Stack spacing={4}>
        <Heading fontSize="xl">What is on the roadmap?</Heading>
        <Accordion allowToggle>
          <AccordionItem>
            <Heading>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  What is being built next?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </Heading>
            <AccordionPanel pb={4}>
              <Text textStyle="body" pb={2}>
                All contributors have been working hard to ensure CALC is the kind of product you want to tell your
                friends about. There is currently a long list of items on the list which include:
              </Text>
              <UnorderedList spacing={1} pb={2}>
                <ListItem>
                  Full integration with Kado Money so you can enter or exit positions from regular dollars (USD, Euro,
                  etc) in your bank account
                </ListItem>
                <ListItem>
                  The release of the DCA+ which enables you to leverage CALC&apos;s sentiment analysis machine learning
                  algorithm to buy or sell at the ideal time!
                </ListItem>
                <ListItem>
                  Different language support so that everyone can use CALC, not just English speakers!
                </ListItem>
                <ListItem>Telegram integrations so you can always be notified of what&apos;s happening</ListItem>
                <ListItem>Access to autostaking on different IBC-enabled chains</ListItem>
                <ListItem>
                  Access to different yield generation strategies (especially for those taking profit)
                </ListItem>
                <ListItem>And more!</ListItem>
              </UnorderedList>
              <Text textStyle="body" pb={2}>
                Want to suggest a feature? The community would love to hear from you. Please send a message to the
                community Telegram group:{' '}
                <Link isExternal href={CALC_TELEGRAM_URL}>
                  {CALC_TELEGRAM_URL}
                </Link>
              </Text>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <Heading>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Will CALC have a token?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </Heading>
            <AccordionPanel pb={4}>
              <Text textStyle="body" pb={2}>
                At CALC, the community contributors are all about sustainability. Instead of launching a token and then
                trying to find a product that people value and use, the core contributors decided to take a more
                sustainable approach.
              </Text>
              <Text textStyle="body" pb={2}>
                This approach is:
              </Text>
              <OrderedList spacing={1} pb={2}>
                <ListItem>Test the idea with users (from all around the world)</ListItem>
                <ListItem>Refine and iterate on the product</ListItem>
                <ListItem>Build and launch an MVP</ListItem>
                <ListItem>Test and validate the protocol use to determine if it could be sustainable</ListItem>
              </OrderedList>
              <Text textStyle="body" pb={2}>
                If all of the above conditions are met then a token model can be introduced. This prevents early
                investors from getting dumped on or a project from falling over as soon as token emissions run out. CALC
                wants to see a responsible approach to building and actively contributing to Grown-up Defi.
              </Text>
              <Text textStyle="body" pb={2}>
                We hope you feel the same way! If you love CALC, please share it with your peers!
              </Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Stack>
      <Stack spacing={4}>
        <Heading fontSize="xl">Why CALC exists?</Heading>
        <Accordion allowToggle>
          <AccordionItem>
            <Heading>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  How CALC was born
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </Heading>
            <AccordionPanel pb={4}>
              <Text textStyle="body" pb={2}>
                CALC, short for calculated, was born from the UST collapse. The initial contributors to CALC learned
                some hard lessons about letting emotions come into play when making investment decisions as well as
                mismanaging risk.
              </Text>
              <Text textStyle="body" pb={2}>
                These lessons were so harsh that the initial contributors decided to build a tool that let others learn
                from their mistakes without having to go through losing enormous amounts of capital.
              </Text>
              <Text textStyle="body" pb={2}>
                The outcome of that build is what you are using now, CALC.
              </Text>
              <Text textStyle="body" pb={2}>
                It&apos;s a suite of mid-to-long-term, on-chain investment tools that enable people to remove the
                emotions from their investment decisions as well as save time and brain space through a set-and-forget
                approach.
              </Text>
              <Text textStyle="body" pb={2}>
                CALC has a few products but the first one is customisable dollar-cost averaging in and out of positions.
              </Text>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <Heading>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Want to get involved?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </Heading>
            <AccordionPanel pb={4}>
              <Text textStyle="body" pb={2}>
                CALC is run by a DAO of users that have a passion for contributing to the project. Do you love what CALC
                is doing and want to get involved? Then ask in the CALC Telegram group:{' '}
                <Link isExternal href={CALC_TELEGRAM_URL}>
                  {CALC_TELEGRAM_URL}
                </Link>
              </Text>
              <Text textStyle="body" pb={2}>
                CALC is run and governed by the holders of Kujira and the DAO is always happy to accept new members that
                are keen to actively contribute.
              </Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Stack>
    </Stack>
  );
}

// function HowItWorks() {
//   return (
//     <Stack spacing={6}>
//       <Stack>
//         <Heading fontSize="4xl">CALC Finance</Heading>
//         <Text textStyle="body" pb={2}>
//           CALC is a powerful decentralized suite of financial tools that give you access to set-and-forget investment
//           strategies so you can spend more time on the things you love.
//         </Text>
//       </Stack>
//       <Accordion allowMultiple>
//         <AccordionItem>
//           <AccordionButton>
//             <Box flex="1" textAlign="left">
//               <Heading fontSize="xl">How CALC Works</Heading>
//             </Box>
//             <AccordionIcon />
//           </AccordionButton>
//           <AccordionPanel pb={4}>
//             <Text textStyle="body" pb={2}>
//               CALC is a powerful decentralized suite of financial tools that give you access to set-and-forget
//               investment strategies so you can spend more time on the things you love.
//             </Text>
//           </AccordionPanel>
//         </AccordionItem>

//         <AccordionItem>
//           <h2>
//             <AccordionButton>
//               <Box flex="1" textAlign="left">
//                 Section 2 title
//               </Box>
//               <AccordionIcon />
//             </AccordionButton>
//           </Heading>
//           <AccordionPanel pb={4} />
//         </AccordionItem>
//       </Accordion>

//       <Stack>
//         <Heading fontSize="xl">How CALC works</Heading>
//         <Text textStyle="body" pb={2}>CALC is a tool build for DeFi users, by DeFi users.</Text>
//       </Stack>
//       <Stack>
//         <Heading fontSize="xl">Why CALC was built</Heading>
//         <Text textStyle="body" pb={2}>CALC is a tool build for DeFi users, by DeFi users.</Text>
//       </Stack>
//       <Stack>
//         <Heading fontSize="xl">Dollar Cost averaging from your bank account with CALC</Heading>
//       </Stack>
//       <Image src="/images/dca.svg" alt="Dollar Cost Averaging" />
//       <Stack>
//         <Heading fontSize="xl">CALC&apos;s mission</Heading>

//         <Text textStyle="body" pb={2}>CALC is a tool build for DeFi users, by DeFi users.</Text>
//       </Stack>
//       <Stack>
//         <Heading as="i" fontSize="xl">
//           CALC is all about saving you time and removing the emotion from the hardest part of Crypto, trading.
//         </Heading>
//       </Stack>
//     </Stack>
//   );
// }

HowItWorks.getLayout = getSidebarLayout;

export default HowItWorks;
