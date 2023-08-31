import React from 'react'
import { TabValue, SelectTabEvent, SelectTabData, makeStyles, shorthands, TabList, Tab, Button } from '@fluentui/react-components';
import { Stack, IStackStyles, IStackTokens } from '@fluentui/react/lib/Stack';
import {SearchBox, Pivot, Spinner, SpinnerSize} from '@fluentui/react';
import { OptionsRegular, SettingsRegular } from '@fluentui/react-icons';
import { CitableCard } from './CitableCard'
import { CitationManager } from './common/CitationManager';
import { SettingProps, SettingsTab } from './SettingsTab'

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
  citationManager: CitationManager<Word.ContentControl>;
}

export const Pane = (props: PaneProps) => {
  const styles = useStyles();
  const [selectedValue, setSelectedValue] = React.useState<TabValue>("tabNew");
  const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };

  return (
    <>
      <SearchBox className={styles.searchbox} />
      <TabList selectedValue={selectedValue || "tabNew"} onTabSelect={onTabSelect} className={styles.tabList} size="small">
        <Tab value="tabSources">Sources</Tab>
        <Tab value="tabBookmarked" className={styles.lastTab}>Bookmarked</Tab>
        <Tab value="settings" icon={<SettingsRegular />} />
      </TabList>
      <div>
        {(!selectedValue || selectedValue === 'tabSources') &&
          <>
            <Stack className={styles.stack} tokens={numericalSpacingStackTokens} >
              { (props.citationManager.citables).map((citable, index) => <CitableCard citable={citable} citationManager={props.citationManager} key={index}/> ) }
            </Stack>
          </>
        }
        {(!selectedValue || selectedValue === 'settings') &&
            <SettingsTab {...props.settingProps} />
        }
      </div>
    </>
  );
}
