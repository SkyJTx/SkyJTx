import { query } from "@solidjs/router";
import type { PersonalInfo, ProjectData, MusicWorkData, ContactData } from "~/types";
import {
  PORTFOLIO_QUERY_KEYS,
  NOT_FOUND_PERSONAL_INFO,
  NOT_FOUND_PROJECTS,
  NOT_FOUND_MUSIC_WORKS,
  NOT_FOUND_CONTACT_DATA,
} from "~/constants";
import {
  fetchWorksData,
  fetchPersonalInfo,
  fetchMusicWorksData,
  fetchContactData,
} from "./fetchers";

const rawWorksQuery = query(async () => {
  const [data, error] = await fetchWorksData();
  if (error) {
    return NOT_FOUND_PROJECTS;
  }
  return data;
}, PORTFOLIO_QUERY_KEYS.WORKS);

const rawPersonalQuery = query(async () => {
  const [data, error] = await fetchPersonalInfo();
  if (error) {
    return NOT_FOUND_PERSONAL_INFO;
  }
  return data;
}, PORTFOLIO_QUERY_KEYS.PERSONAL);

const rawMusicQuery = query(async () => {
  const [data, error] = await fetchMusicWorksData();
  if (error) {
    return NOT_FOUND_MUSIC_WORKS;
  }
  return data;
}, PORTFOLIO_QUERY_KEYS.MUSIC);

const rawContactQuery = query(async () => {
  const [data, error] = await fetchContactData();
  if (error) {
    return NOT_FOUND_CONTACT_DATA;
  }
  return data;
}, PORTFOLIO_QUERY_KEYS.CONTACT);

export function getWorksDataQuery(): Promise<readonly ProjectData[]> {
  return rawWorksQuery();
}
getWorksDataQuery.key = rawWorksQuery.key;

export function getPersonalInfoQuery(): Promise<Readonly<PersonalInfo>> {
  return rawPersonalQuery();
}
getPersonalInfoQuery.key = rawPersonalQuery.key;

export function getMusicWorksDataQuery(): Promise<readonly MusicWorkData[]> {
  return rawMusicQuery();
}
getMusicWorksDataQuery.key = rawMusicQuery.key;

export function getContactDataQuery(): Promise<Readonly<ContactData>> {
  return rawContactQuery();
}
getContactDataQuery.key = rawContactQuery.key;
