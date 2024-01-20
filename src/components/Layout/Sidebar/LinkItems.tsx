import { Badge, ComponentWithAs, IconProps } from '@chakra-ui/react';
import {
  Add1Icon,
  Add2Icon,
  BoxedImportIcon,
  CrownIcon,
  HomeIcon,
  KnowledgeIcon,
  PieChartIcon,
  ToolkitIcon,
} from '@fusion-icons/react/interface';
import { ChainId } from '@models/ChainId';
import { SVGProps } from 'react';
import { Pages } from './Pages';
import { ControlDeskPages } from './ControlDeskPages';

export interface LinkItem {
  name: string;
  child?: JSX.Element;
  icon: ((props: SVGProps<SVGSVGElement>) => JSX.Element) | ComponentWithAs<'svg', IconProps>;
  active?: boolean;
  href: Pages | ControlDeskPages;
  exclude?: ChainId[];
}

export const LinkItems: Array<LinkItem> = [
  { name: 'Home', icon: HomeIcon, href: Pages.Home },
  { name: 'Create strategy', icon: Add1Icon, href: Pages.CreateStrategy },
  {
    name: 'Pro strategies',
    icon: CrownIcon,
    href: Pages.ProStrategies,
    child: (
      <Badge colorScheme="brand" marginLeft={2}>
        New
      </Badge>
    ),
  },
  { name: 'My strategies', icon: ToolkitIcon, href: Pages.Strategies },
  { name: 'Bridge assets', icon: BoxedImportIcon, href: Pages.GetAssets },
  // { name: 'Settings', icon: SettingsIcon, href: Pages.Settings }
  { name: 'Learning hub', icon: KnowledgeIcon, href: Pages.LearnAboutCalc },
];

export const ControlDeskLinkItems: Array<LinkItem> = [
  { name: 'Create strategy', icon: Add2Icon, href: ControlDeskPages.ControlDeskCreateStrategy },
  { name: 'Dashboard', icon: PieChartIcon, href: ControlDeskPages.ControlDeskDashboard },
  { name: 'My strategies', icon: ToolkitIcon, href: ControlDeskPages.ControlDeskStrategies },
];
