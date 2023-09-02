import React from 'react';
import { makeStyles, shorthands, Card, CardFooter, CardHeader, CardPreview, Button, Body1, Caption1, Text } from '@fluentui/react-components';
import { BookmarkRegular, ClipboardRegular, ShareRegular } from "@fluentui/react-icons";
import { Citable } from "../../../../common/Citables"
import { Citation, CitationManager } from "../../../../common/CitationManager"
import {SettingProps} from "./SettingsTab";

const useStyles = makeStyles({
  card: {
    ...shorthands.margin("auto"),
    width: "100%",
  },
});

export interface CitableCardProps {
  citable: Citable;
  citationManager: CitationManager<Word.ContentControl>;
}

const insertContentControl = async () => {
  let contentControl: Word.ContentControl;
  await Word.run(async (context) => {
    const range = context.document.getSelection();
    contentControl = range.insertContentControl();
    await context.sync();
  });
  return contentControl;
}

export const CitableCard = (props: CitableCardProps) => {
  const styles = useStyles();
  return (
     <Card className={styles.card}>
      <CardHeader
        header={
          <Body1>
            <b>{props.citable.shortCite(false)}</b>
          </Body1>
        }
	description={
          <div dangerouslySetInnerHTML={{__html: props.citable.cite(true)}}></div>
        }

      />
      <CardFooter>
        <Button icon={<ClipboardRegular />} onClick={() => navigator.clipboard.writeText(props.citable.cite(false))} title="Copy" />
        <Button icon={<BookmarkRegular />} title="Bookmark"
	onClick={async () => {
	  console.log("onclyick");
	  const cc = await insertContentControl();
	  console.log("asdf");
	  const citation: Citation<Word.ContentControl> = {
	    citable: props.citable,
	    documentRange: cc,
	    isPinCite: false,
	  };
	  console.log("aslkjdh");
	  props.citationManager.addCitation(citation);
	  console.log("asdflkjhslkjdh");
	}}
	/>
        <Button icon={<ShareRegular />} title="Go to source" href={props.citable.sourceUrl}
          onClick={() => window.open(props.citable.sourceUrl,'_blank')}/>
      </CardFooter>
    </Card>
  );
};
