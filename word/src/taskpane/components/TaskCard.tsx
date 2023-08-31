import React from 'react';
import { makeStyles, shorthands, Card, CardFooter, CardHeader, CardPreview, Button, Body1, Caption1, Text } from '@fluentui/react-components';
import { BookmarkRegular, ClipboardRegular, ShareRegular } from "@fluentui/react-icons";
import {SettingProps} from "./SettingsTab";
import {Hit} from "./Suggestor";

const useStyles = makeStyles({
  card: {
    ...shorthands.margin("auto"),
    width: "100%",
  },
});

export interface TaskCardProps {
  info: Hit;
}

export const TaskCard = (props: TaskCardProps) => {
  const styles = useStyles();
  return (
     <Card className={styles.card}>
      <CardHeader
        header={
          <Body1>
            <b>{props.info.title}</b>
          </Body1>
        }
        description={<Caption1>{props.info.caption}</Caption1>}
      />

       <Text>
        <div dangerouslySetInnerHTML={{__html: props.info.htmlContent}}></div>
       </Text>

      <CardFooter>
        <Button icon={<ClipboardRegular />} onClick={() => navigator.clipboard.writeText(props.info.htmlContent.replace(/(<([^>]+)>)/g, "") + ` (${props.info.fullCite})`)} title="Copy" />
        <Button icon={<BookmarkRegular />} title="Bookmark" />
        <Button icon={<ShareRegular />} title="Go to source" href={props.info.sourceUrl}
          onClick={() => window.open(props.info.sourceUrl,'_blank')}/>
      </CardFooter>
    </Card>
  );
};
