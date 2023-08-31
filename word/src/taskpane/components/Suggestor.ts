export type Hit = {
  title: string;
  caption: string;
  htmlContent: string;
  id: string;
  sourceUrl: string;
  fullCite: string;
}

export type SuggestorResponse = {
  htmlToInsert: string;
  hits: Hit[];
  ok: boolean;
}

export interface Suggestor {
  suggest(command: string, textBefore: string, text: string, textAfter: string, jurisdictions: string[]): Promise<SuggestorResponse>;
}

export class LexemeSuggestor {
  async suggest(command: string, textBefore: string, text: string, textAfter: string, jurisdictions: string[]): Promise<SuggestorResponse> {
    const url = new URL("https://lx.lexeme.dev/skill");
    const query = {
      command: command,
      textBefore: textBefore,
      text: text,
      textAfter: textAfter,
      jurisdictions: jurisdictions,
    }

    const request = fetch(url, {
      method: "POST",
      body: JSON.stringify(query),
      headers: {
        "Content-Type": "application/json",
      }
    }).catch((err) => {
      console.error("Error fetching suggestion", err);
      return {
        ok: false,
      };
    });

    const resp = await request;
    if (!resp.ok) {
      return {
        htmlToInsert: "Error getting suggestion",
        hits: [],
        ok: false,
      };
    }

    const json = await (resp as Response).json();
    console.log("Lexeme responded with", json);
    if(!json["success"]) {
      return {
        htmlToInsert: "Error getting suggestion",
        hits: [],
        ok: false,
      };
    }

    const hits: Hit[] = [];
    let answerHtml = json["document_output"];
    if(json.skill_type === "find_citation") {
      for (const hit of json["metadata"]["hits"]) {
        const _id = hit["_id"];
        const src = hit["_source"];
        const page_url = src["page_url"];
        const year = src["case"]["decision_date"].split("-")[0];
	let court: string = src["case_metadata"]["court"]["name_abbreviation"]
	if (court === "U.S.") {
		court = "Supreme Ct."
	}
        hits.push({
          title: `${src["case"]["case_name"]} (${year})`,
          caption: `${src["opinion"]["display_text"]} - ${src["case"]["case_citation"]} (${court})`,
          htmlContent: src["context_html"],
          id: _id,
          sourceUrl: page_url,
      fullCite: `${src["case"]["case_name"]}, ${src["case"]["case_citation"]} (${year}; ${court})`,
        });
      }
    }

    return {
      htmlToInsert: answerHtml,
      hits: hits,
      ok: true,
    };
  }
}

export const search = async (query: string, jurisdictions: string[]): Promise<Hit[]> => {
  const url = new URL("https://lx.lexeme.dev/semantic_search");
  url.searchParams.append("query", query);
  url.searchParams.append("include_natural_answer", "false");
  for (const jurisdiction of jurisdictions) {
    url.searchParams.append("jurisdictions", jurisdiction);
  }

  const request = fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }).catch((err) => {
      console.error("Error fetching suggestion", err);
      return {
        ok: false,
      };
    });
  const resp = await request;
  const json = await (resp as Response).json();
  const hits: Hit[] = [];
  for (const hit of json["hits"]) {
    const _id = hit["_id"];
    const src = hit["_source"];
    const page_url = src["page_url"];
    const year = src["case"]["decision_date"].split("-")[0];
    let court: string = src["case_metadata"]["court"]["name_abbreviation"]
    if (court === "U.S.") {
	court = "Supreme Ct."
    }
    hits.push({
      title: `${src["case"]["case_name"]} (${year})`,
      caption: `${src["opinion"]["display_text"]} - ${src["case"]["case_citation"]} (${court})`,
      htmlContent: src["context_html"],
      id: _id,
      sourceUrl: page_url,
      fullCite: `${src["case"]["case_name"]}, ${src["case"]["case_citation"]} (${year}; ${court})`,
    });
  }
  return hits;
}

export class MockSuggestor {
  delayMs: number;

  constructor(delayMs: number=2000) {
    this.delayMs = delayMs;
  }

  async suggest(command: string, context: string): Promise<SuggestorResponse> {
    void context;
    void command;
    return new Promise((resolver) => {
      const words = ["red", "blue", "green", "orange", "purple", "pink", "yellow"];
      let suggestion = words[Math.floor(Math.random() * words.length)];
      let value = {
        htmlToInsert: `Yes, I think '${command}' is very ${suggestion}`,
        hits: [
          {
            title: `The color ${suggestion} v. United States (2023)`,
            caption: `439 U.S. 1105 - holding that ${suggestion} is in fact a color.`,
            htmlContent: `What the heck? <strong>Obviously ${suggestion} is a color.</strong> This is stupid.`,
            id: suggestion,
            sourceUrl: `https://en.wikipedia.org/wiki/${suggestion}`,
	    fullCite: `The color ${suggestion} v. United States, 439 U.S. 1105 (2023)`,
          },
        ],
        ok: true,
      }
      setTimeout(() => {resolver(value)}, this.delayMs);
    });
  }
}
