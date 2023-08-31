import * as React from "react";
import { Checkbox } from "@fluentui/react";

export type Settings = {
  searchOnSelection: boolean;
}

export interface SettingProps {
  onSettingsChange: (newSettings: Settings) => void;
  settings: Settings;
}

export const SettingsTab = (props: SettingProps) => {
  return (
    <>
      <h3>Settings</h3>
      <Checkbox label="Search for relevant snippets when I select text"
        onChange={(_ev, checked) => {
        let settings = props.settings;
        settings.searchOnSelection = checked;
        props.onSettingsChange(settings);
      }} checked={props.settings.searchOnSelection} />
    </>
  )
}
