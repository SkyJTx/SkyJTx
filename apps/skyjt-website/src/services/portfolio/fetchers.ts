import * as v from "valibot";
import {
  type PersonalInfo,
  type ProjectData,
  type MusicWorkData,
  WorksDataSchema,
  MusicWorksDataSchema,
  PersonalInfoSchema,
} from "~/types";
import {
  isCacheFresh,
  getWorksCache,
  setWorksCache,
  getPersonalCache,
  setPersonalCache,
  getMusicCache,
  setMusicCache,
} from "./cache";
import { getEden, formatEdenError } from "./edenResolver";

export async function fetchWorksData(): Promise<readonly ProjectData[]> {
  const cache = getWorksCache();
  if (isCacheFresh(cache)) {
    return cache.data;
  }
  const eden = await getEden();
  const res = await eden.api.storage.data.works.get();
  if (res.error) {
    throw new Error(`Failed to fetch works data: ${formatEdenError(res.error)}`);
  }
  const output = v.parse(WorksDataSchema, res.data);
  setWorksCache({ data: output, timestamp: Date.now() });
  return output;
}

export async function fetchPersonalInfo(): Promise<Readonly<PersonalInfo>> {
  const cache = getPersonalCache();
  if (isCacheFresh(cache)) {
    return cache.data;
  }
  const eden = await getEden();
  const res = await eden.api.storage.data.personal.get();
  if (res.error) {
    throw new Error(`Failed to fetch personal info: ${formatEdenError(res.error)}`);
  }
  const output = Object.freeze(v.parse(PersonalInfoSchema, res.data));
  setPersonalCache({ data: output, timestamp: Date.now() });
  return output;
}

export async function fetchMusicWorksData(): Promise<readonly MusicWorkData[]> {
  const cache = getMusicCache();
  if (isCacheFresh(cache)) {
    return cache.data;
  }
  const eden = await getEden();
  const res = await eden.api.storage.data.music.get();
  if (res.error) {
    throw new Error(`Failed to fetch music works data: ${formatEdenError(res.error)}`);
  }
  const output = v.parse(MusicWorksDataSchema, res.data);
  setMusicCache({ data: output, timestamp: Date.now() });
  return output;
}
