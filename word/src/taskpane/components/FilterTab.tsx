import * as React from "react";
import {Checkbox, Dropdown} from "@fluentui/react";
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";


export const JURISDICTIONS = [
  { text: "Supreme Ct.", key: "us" },
  { text: "1st Circuit", key: "1st-cir" },
  { text: "2nd Circuit", key: "2nd-cir" },
  { text: "3rd Circuit", key: "3rd-cir" },
  { text: "4th Circuit", key: "4th-cir" },
  { text: "5th Circuit", key: "5th-cir" },
  { text: "6th Circuit", key: "6th-cir" },
  { text: "7th Circuit", key: "7th-cir" },
  { text: "8th Circuit", key: "8th-cir" },
  { text: "9th Circuit", key: "9th-cir" },
  { text: "10th Circuit", key: "10th-cir" },
  { text: "11th Circuit", key: "11th-cir" },
  { text: "Federal Circuit", key: "fed-cir" },
  { text: "DC Circuit", key: "dc-cir" },
] as const;

type JurisdictionSlug = typeof JURISDICTIONS[number]["key"];

export type Filter = {
  jurisdictions: JurisdictionSlug[];
}

export interface FilterProps {
  onFilterChange: (newFilter: Filter) => void;
  filter: Filter;
}

export const FilterTab = (props: FilterProps) => {
  // all jurisdictions to begin with
  props.filter.jurisdictions = props.filter.jurisdictions || JURISDICTIONS.map((j) => j.key);
  return (
    <>
      <h3>Filter Texts</h3>
      <p>
        Here you can control the texts that Wordsmith will consider when responding to comments, searching, etc.
      </p>
      <p>
        By default, Wordsmith will consider all court cases at the appellate level and above.
      </p>
      <Dropdown
          label="Jurisdiction"
          defaultSelectedKey={props.filter.jurisdictions}
          options={JURISDICTIONS as any}
          disabled={false}
          multiSelect
          onChange={(_ev, option) => {
            let filters = props.filter;
            if (option) {
                filters.jurisdictions.push(option.key as JurisdictionSlug);
            }
            else {
                filters.jurisdictions = filters.jurisdictions.filter((j) => j !== option.key);
            }
            props.onFilterChange(filters);
          }}
      />
    </>
  )
}
