import { Citable } from "./citables";

interface Citation<DocumentRange> {
  citable: Citable;
  documentRange: DocumentRange;
  isPinCite: boolean;
  pinCitePage?: string;
  pinCitePageEnd?: string;
}

class CitationManager<DocumentRange> {

  citables: Citable[];
  citations: Citation<DocumentRange>[];
  replaceRange: (documentRange: DocumentRange, markup: string) => DocumentRange;

  addCitable (citable: Citable) {
    this.citables.push(citable); 
  }

  addCitation (citation: Citation<DocumentRange>) {
    // check to see if the citable is tracked
    console.log(this.citations);
    this.citations.push(citation);
    console.log(this.citations);
    // keep the citations list sorted
    const newRange = this.replaceRange(citation.documentRange, citation.citable.cite(true));
    console.log("got here");
    citation.documentRange = newRange;
  }

  insertCitations() {
  }

  constructor(replaceRange: (documentRange: DocumentRange, markup: string) => DocumentRange) {
    this.replaceRange = replaceRange;
    this.citables = []
    this.citations = []
  }
}

export { CitationManager, Citation };
