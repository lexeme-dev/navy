import axios, { AxiosInstance } from 'axios';
import { SuggestorResponse } from "../components/Suggestor";

const API_SEARCH_URL = 'https://lx.battleword.io/semantic_search';
const API_SKILL_URL = 'https://lx.battleword.io/skills';

export interface Opinion {
  author: string;
  display_text: string;
  opinion_type: string;
}

export interface Case {
  case_citation: string;
  case_id: number;
  case_name: string;
  decision_date: string;
  frontend_url: string;
}

export interface Source {
  case: Case;
  case_id: number;
  context_html: string;
  opinion: Opinion;
  page_url: string;
  text: string;
}

export interface Hit {
  _adjusted_score: number;
  _id: string;
  _index: string;
  _score: number;
  _source: Source;
}

export interface Query {
  filter: Object;
  include_natural_answer: boolean;
  index: string;
  original_query: string;
  query: string;
  uuid: string;
}

export interface SearchResponse {
  created_at: string;
  hits: Hit[];
  query: Query;
}

export const search = async (query: string): Promise<SearchResponse> => {
  return axios.get(API_SEARCH_URL, {
    params: {
      query: query
    }
  })
  .then((r) => r.data)
  .catch(error => console.log(error))
}
