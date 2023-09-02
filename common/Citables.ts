import * as ce from "./CitationElements";

abstract class Citable {
  abstract cite(markup: boolean): string;

  abstract shortCite(markup: boolean): string;

  abstract pinCite(page: string, pageEnd: string | null, markup: boolean): string;

  abstract shortPinCite(page: string, pageEnd: string | null, markup: boolean): string;

  abstract sourceUrl?: string;
  static displayName: string;
  static description: string;
}

interface IPeriodical {
  author: ce.Authors;
  shortName: ce.ShortName;
  title: ce.Title;
  page: ce.Page;
  publication: ce.Publication;
  year: ce.Year;
  pageRangeStart?: ce.Page;
  pageRangeEnd?: ce.Page;
  parenthetical?: ce.Parenthetical;
}

interface IJournal extends IPeriodical {
  volume: ce.Volume;
}

class Journal extends Citable implements IPeriodical {
  author: ce.Authors;
  shortName: ce.ShortName;
  title: ce.Title;
  page: ce.Page;
  publication: ce.Publication;
  volume: ce.Volume;
  year: ce.Year;
  parenthetical?: ce.Parenthetical;

  sourceUrl?: string;

  constructor(props: IJournal, sourceUrl: string = "") {
    super();
    Object.assign(this, props);
    this.sourceUrl = sourceUrl;
  }

  cite(markup: boolean = true) {
    let citation: string = "";
    citation += `${this.author.value}, `;
    if (markup) {
      citation += `<i>${this.title.value}</i>, `;
    } else {
      citation += `${this.title.value}, `;
    }
    citation += `${this.volume.value} ${this.publication.value} ${this.page.value} (${this.year.value})`;
    if (this.parenthetical) {
      citation += ` (${this.parenthetical.value})`;
    }
    //citation += "."

    return citation;
  }

  shortCite(markup: boolean = true) {
    return `${this.shortName.value}`;
  }

  pinCite(page: string, pageEnd: string | null = null, markup: boolean = true) {
    return "";
  }

  shortPinCite(page: string, pageEnd: string | null = null, markup: boolean = true) {
    return "";
  }
}

export { Citable, Journal };

/* 
const sp = new Journal(
  {
    author: new ce.Authors("Liz Brown"),
    shortName: new ce.ShortName("Brown"),
    title: new ce.Title("Bridging the Gap"),
    publication: new ce.Publication("Yale Law Journal"),
    year: new ce.Year("2014"),
    page: new ce.Page("43"),
    volume: new ce.Volume("4"),
  }
);
console.log(sp);
console.log(sp.cite());
*/
