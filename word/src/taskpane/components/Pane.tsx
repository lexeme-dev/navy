import React from 'react'
import { TabValue, SelectTabEvent, SelectTabData, makeStyles, shorthands, TabList, Tab, Button } from '@fluentui/react-components';
import { Stack, IStackStyles, IStackTokens } from '@fluentui/react/lib/Stack';
import {SearchBox, Pivot, Spinner, SpinnerSize} from '@fluentui/react';
import { OptionsRegular, SettingsRegular } from '@fluentui/react-icons';
import { TaskCard } from './TaskCard'
import { SettingProps, SettingsTab } from './SettingsTab'
import {Hit, search} from "./Suggestor";
import {FilterProps, FilterTab} from "./FilterTab";

const useStyles = makeStyles({
  searchbox: {
    width: "100%",
  },
  stack: {
    width: "100%",
  },
  lastTab: {
    marginRight: "auto",
  },
  tabList: {
    display: "flex",
    //justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
  },
})
const numericalSpacingStackTokens: IStackTokens = {
  childrenGap: 8,
};

export interface PaneProps {
  settingProps: SettingProps;
  filterProps: FilterProps;
  isCommandRunning: boolean;
  allHits: Hit[];
  onSearch: (query: string) => Promise<void>;
}

export const Pane = (props: PaneProps) => {
  const styles = useStyles();
  const [selectedValue, setSelectedValue] = React.useState<TabValue>("tabNew");
  const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };

  return (
    <>
      <SearchBox className={styles.searchbox} onSearch={props.onSearch} />
      <TabList selectedValue={selectedValue || "tabNew"} onTabSelect={onTabSelect} className={styles.tabList} size="small">
        <Tab value="tabNew">New</Tab>
        <Tab value="tabBookmarked" className={styles.lastTab}>Bookmarked</Tab>
        <Tab value="filters" icon={<OptionsRegular />} />
        <Tab value="settings" icon={<SettingsRegular />} />
      </TabList>
      <div>
        {(!selectedValue || selectedValue === 'tabNew') &&
          <>
            { props.isCommandRunning && <Spinner size={SpinnerSize.large} label={"Wordsmith is thinking..."} style={{alignSelf: "center"}}/> }
            <Stack className={styles.stack} tokens={numericalSpacingStackTokens} >
              { (props.allHits).map((hit) => <TaskCard info={hit} key={hit.id}/> ) }
            </Stack>
          </>
        }
        {(!selectedValue || selectedValue === 'settings') &&
            <SettingsTab {...props.settingProps} />
        }
        {(!selectedValue || selectedValue === 'filters') &&
            <FilterTab {...props.filterProps} />
        }
      </div>
    </>
  );
}
