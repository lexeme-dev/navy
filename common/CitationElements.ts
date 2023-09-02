abstract class CitationElement {
  static displayName: string;
  static helpText: string;
  static example: string;
  static default: string | null;

  value: any;

  constructor(value: any) {
    this.value = value;
  }
  errors() {
    return [];
  }
  isValid() {
    return !!this.errors();
  }
}

class Year extends CitationElement {
  static displayName = "Year";
  static helpText = "the year the work was published";
  static example = "2020";
  static default = null;
  value: string;

  errors() {
    return (
      /[0-9]{4}/.test(this.value)
        ? ["year must be exactly four digits"]
        : []
    );
  }
};

class Authors extends CitationElement {
  static displayName = "Author(s)";
  static helpText = "formatted list of authors";
  static example = "Faiz Surani & Varun Magesh";
  static default = null;
  value: string;

  errors() {
    return this.value ? [] : ["author cannot be blank"];
  }
}

class ShortName extends CitationElement {
  static displayName = "Short name to refer to the citation";
  static helpText = "Short name for the citation";
  static example = "Surani & Magesh";
  static default = null;
  value: string;

  errors() {
    return this.value ? [] : ["short name cannot be blank"];
  }
}

class Title extends CitationElement {
  static displayName = "Title";
  static helpText = "Most specific title of the work";
  static example = "Bridging the Gap: Improving Intellectual Property Rights";
  static default = null;
  value: string;

  errors() {
    return this.value ? [] : ["title cannot be blank"];
  }
}

class Volume extends CitationElement {
  static displayName = "Volume";
  static helpText = "Volume of the periodical that the work appears in";
  static example = "12"
  static default = null;
  value: string;

  errors() {
    return this.value ? [] : ["volume cannot be blank"];
  }
}

class Page extends CitationElement {
  static displayName = "Page";
  static helpText = "Page of the periodical that the work appears in";
  static example = "534"
  static default = null;
  value: string;

  errors() {
    return this.value ? [] : ["page cannnot be blank"];
  }
}

class Publication extends CitationElement {
  static displayName = "Publication";
  static helpText = "Name of the journal or periodical that the work was published in, unabbreviated";
  static example = "Harvard Law Review"
  static default = null;
  value: string;

  errors() {
    return this.value ? [] : ["publication cannot be blank"];
  }
}

class Parenthetical extends CitationElement {
  static displayName = "Parenthetical";
  static helpText = "Explanatory parenthetical to use in the first citation";
  static example = "holding that foo is bar"
  static default = null;
  value: string;

  errors() {
    return this.value ? [] : ["parenthetical cannot be blank"];
  }
}

export { Year, Authors, ShortName, Title, Volume, Page, Publication, Parenthetical };
