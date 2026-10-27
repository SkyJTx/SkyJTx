import * as v from "valibot";
import { defineRoute } from "@skyjt/typed-routes";
import {
  WorksDataSchema,
  PersonalInfoSchema,
  MusicWorksDataSchema,
  ContactDataSchema,
} from "~/types";
import { getObjectText } from "~/server/modules/storage";

export const StorageDataTypeSchema = v.picklist(["works", "personal", "music", "contact"]);
export type StorageDataType = v.InferOutput<typeof StorageDataTypeSchema>;

export const route = defineRoute({
  params: v.object({
    type: StorageDataTypeSchema,
  }),
});

const DATA_REGISTRY: Record<
  StorageDataType,
  { readonly file: string; readonly schema: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>> }
> = {
  works: { file: "worksData.json", schema: WorksDataSchema },
  personal: { file: "personalInfo.json", schema: PersonalInfoSchema },
  music: { file: "musicWorksData.json", schema: MusicWorksDataSchema },
  contact: { file: "contactData.json", schema: ContactDataSchema },
};

export const GET = route.handler(async (event) => {
  const target = DATA_REGISTRY[event.params.type];
  const [text, error] = await getObjectText(target.file, undefined, event);
  if (error) {
    return Response.json(
      {
        type: error.code,
        code: error.code,
        status: error.status,
        detail: error.message,
      },
      {
        status: error.status,
        headers: { "content-type": "application/problem+json" },
      }
    );
  }

  const parsed = v.safeParse(target.schema, JSON.parse(text));
  if (!parsed.success) {
    return Response.json(
      {
        type: "STORAGE_VALIDATION_ERROR",
        code: "STORAGE_VALIDATION_ERROR",
        status: 500,
        detail: "Storage payload does not match schema contract.",
        issues: parsed.issues,
      },
      {
        status: 500,
        headers: { "content-type": "application/problem+json" },
      }
    );
  }

  return Response.json(parsed.output, {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=60, s-maxage=60, stale-while-revalidate=60",
    },
  });
});