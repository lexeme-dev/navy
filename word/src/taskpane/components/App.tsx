import * as React from "react";
import {Spinner, SpinnerSize} from "@fluentui/react";
import {FluentProvider, teamsDarkTheme, teamsLightTheme} from "@fluentui/react-components";
import {Pane} from "./Pane";
import {Hit, LexemeSuggestor, MockSuggestor, Suggestor, SuggestorResponse, search} from "./Suggestor";
import {Filter} from "./FilterTab";
import {Settings} from "./SettingsTab";

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  isCommandRunning: boolean;
  allHits: Hit[];
  theme: "light" | "dark";
  filter: Filter;
  settings: Settings,
}

export default class App extends React.Component<AppProps, AppState> {
  selectionChangedHandler: (result: any) => void;
  suggestor: Suggestor;
  answered: Set<string>;
  commentPollerId: NodeJS.Timer;

  constructor(props, context) {
    super(props, context);
    this.suggestor = new LexemeSuggestor();
    this.state = {
      isCommandRunning: false,
      allHits: [],
      theme: "light",
      filter: {
        jurisdictions: [],
      },
      settings: {
        searchOnSelection: true,
      },
    };
    this.selectionChangedHandler = this.onSelectionChanged.bind(this);
    this.answered = new Set();
  }

  waitingComment = async (comment: Word.Comment) => {
    comment.reply("From @WS: working on it...");
  }

  respondToComment = async (context: any, comment: Word.Comment) => {
    const body = context.document.body;
    const bodyStart = body.getRange("Start");
    const bodyEnd = body.getRange("End");

    const commentRange = comment.getRange();
    const beforeRange = bodyStart.expandTo(commentRange.getRange("Start"));
    const afterRange = commentRange.getRange("End").expandTo(bodyEnd);
    const range = comment.getRange()
    range.load("text");
    beforeRange.load("text");
    afterRange.load("text");
    await context.sync();

    const contextBefore = beforeRange.text.split(" ").slice(-50).join(" ");
    const contextAfter = afterRange.text.split(" ").slice(0, 50).join(" ");

    const command = comment.content.slice(3);
    const response = await this.askWordsmith(command, contextBefore, range.text, contextAfter);
    if (response.documentText != "") {
      const range = comment.getRange()
      range.load()
      await context.sync()
      context.document.set({changeTrackingMode: "TrackAll"});
      range.insertHtml(response.documentText, "Replace");
      context.document.set({changeTrackingMode: "Off"});
    }
    for (let commentReply of response.commentReplies) {
      comment.reply(`From @WS: ${commentReply}`);
    }
    await context.sync()
  }

  commentListPoller = () => {
    Word.run(async (context) => {
        const comments: Word.CommentCollection = context.document.body.getComments()
        comments.load();
        await context.sync();
        console.log(comments);
        for (let comment of comments.items) {
          // let reply: Word.CommentReply = comment.replies.getFirstOrNullObject();
          // debugger;
          // reply.load();
          // await context.sync();
          // console.log(reply);
          if (
            !this.answered.has(comment.id) &&
            comment.resolved !== true &&
            comment.content.startsWith("@WS") // &&
            // reply.isNullObject
          ) {
            this.answered.add(comment.id);
            await this.waitingComment(comment);
            await context.sync();
            await this.respondToComment(context, comment);
            await context.sync();
          }
        }
      }
    );
  }

  componentDidMount() {
    Office.context.document.addHandlerAsync(Office.EventType.DocumentSelectionChanged, this.selectionChangedHandler);
    // check if theme string is darker than #777777
    Office.context.document.addHandlerAsync(Office.EventType.DocumentSelectionChanged, this.selectionChangedHandler);
    this.commentPollerId = setInterval(this.commentListPoller, 5000);
    this.commentListPoller();
  }

  componentWillUnmount(): void {
    Office.context.document.removeHandlerAsync(Office.EventType.DocumentSelectionChanged, this.selectionChangedHandler);
    clearInterval(this.commentPollerId);
  }

  onSelectionChanged() {
    this.contextSearch();
  }

  runSearch = async (query: string) => {
    console.log("Searching with query: ", query);
    this.setState({isCommandRunning: true});
    const hits = await search(query, this.state.filter.jurisdictions);
    this.setState({isCommandRunning: false});
    const filteredNewHits = [];
    for (let newHit of hits) {
      if (this.state.allHits.some((hit) => hit.sourceUrl === newHit.sourceUrl)) {
        continue;
      }
      filteredNewHits.push(newHit);
    }
    this.setState({allHits: ([...filteredNewHits, ...this.state.allHits]).slice(0, 20)});
  }

  contextSearch() {
    if(!this.state.settings.searchOnSelection) {
      return;
    }
    if(this.state.isCommandRunning) {
      return;
    }
    Word.run(async (context) => {
      const cursorOrSelection = context.document.getSelection()
      context.load(cursorOrSelection);
      await context.sync();

      const textToQuery = cursorOrSelection.text;
      if (!textToQuery || textToQuery.length < 20) {
        return;
      }
      const searchContext = textToQuery.split(" ").slice(-40).join(" ");
      await this.runSearch(searchContext);
    });
  }

  askWordsmith = async (command: string, textBefore: string, text: string, textAfter: string): Promise<{
    documentText: string,
    commentReplies: string[]
  }> => {
    this.setState({isCommandRunning: true});
    const response = await this.suggestor.suggest(command, textBefore, text, textAfter, this.state.filter.jurisdictions);
    this.setState({isCommandRunning: false});
    if (!response.ok) {
      return {documentText: "", commentReplies: ["Hmm, something didn't work right."]};
    }
    const filteredNewHits = [];
    for (let newHit of response.hits) {
      if (this.state.allHits.some((hit) => hit.sourceUrl === newHit.sourceUrl)) {
        continue;
      }
      filteredNewHits.push(newHit);
    }
    this.setState({allHits: [...filteredNewHits, ...this.state.allHits]});
    return {documentText: response.htmlToInsert, commentReplies: []};
  }

  render() {
    if (!this.props.isOfficeInitialized) {
      return (
        <Spinner size={SpinnerSize.large} label={"Waiting for Office to initialize..."}/>
      );
    }

    const onSettingsChange = (newSettings: Settings) => {
      this.setState({settings: newSettings});
    }

    const onFilterChange = (newFilter: Filter) => {
      this.setState({filter: newFilter});
    }

    return (
      <div className="ms-welcome">
        <FluentProvider theme={this.state.theme == "light" ? teamsLightTheme : teamsDarkTheme}>
          <main className="ms-welcome__main" style={{alignItems: "flex-start"}}>
            <Pane onSearch={this.runSearch}
                  allHits={this.state.allHits}
                  filterProps={{onFilterChange: onFilterChange, filter: this.state.filter}}
                  settingProps={{onSettingsChange: onSettingsChange, settings: this.state.settings}}
                  isCommandRunning={this.state.isCommandRunning}
            />
          </main>
        </FluentProvider>
      </div>
    );
  }
}
