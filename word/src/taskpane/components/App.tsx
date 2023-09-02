import * as React from "react";
import { Spinner, SpinnerSize } from "@fluentui/react";
import { FluentProvider, teamsDarkTheme, teamsLightTheme } from "@fluentui/react-components";
import { Pane } from "./Pane";
import { Filter } from "./FilterTab";
import { Settings } from "./SettingsTab";
import { CitationManager } from "../../../../common/CitationManager";
import { Journal } from "../../../../common/Citables";
import * as ce from "../../../../common/CitationElements";

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  theme: "light" | "dark";
  settings: Settings;
}

export default class App extends React.Component<AppProps, AppState> {
  citationManager: CitationManager<Word.ContentControl>;

  replaceRange: (documentRange: Word.ContentControl, markup: string) => Word.ContentControl = (
    documentRange: Word.ContentControl,
    markup: string
  ) => {
    console.log("ASDFASDFA");
    documentRange.insertHtml(markup, "Replace");
    return documentRange;
  };

  constructor(props, context) {
    super(props, context);
    this.citationManager = new CitationManager<Word.ContentControl>(this.replaceRange);
    this.citationManager.addCitable(
      new Journal({
        author: new ce.Authors("Liz Brown"),
        shortName: new ce.ShortName("Brown"),
        title: new ce.Title("Bridging the Gap"),
        publication: new ce.Publication("YLJ"),
        year: new ce.Year("2014"),
        page: new ce.Page("43"),
        volume: new ce.Volume("4"),
      })
    );
    this.state = {
      theme: "light",
      settings: {
        searchOnSelection: true,
      },
    };
  }

  render() {
    if (!this.props.isOfficeInitialized) {
      return <Spinner size={SpinnerSize.large} label={"Waiting for Office to initialize..."} />;
    }

    const onSettingsChange = (newSettings: Settings) => {
      this.setState({ settings: newSettings });
    };

    return (
      <div className="ms-welcome">
        <FluentProvider theme={this.state.theme == "light" ? teamsLightTheme : teamsDarkTheme}>
          <main className="ms-welcome__main" style={{ alignItems: "flex-start" }}>
            <Pane
              settingProps={{ settings: this.state.settings, onSettingsChange: () => {} }}
              citationManager={this.citationManager}
            />
          </main>
        </FluentProvider>
      </div>
    );
  }
}
