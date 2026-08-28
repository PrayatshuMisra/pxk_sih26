/** Community Wayfinding: user-owned screening drafts are scoped to the authenticated account and can be resumed or discarded. */
import type { ScreeningRecordRow } from "../drizzle/schema";

export type SaveScreeningInput = { userId: number; publicId: string; status: "draft" | "completed" | "discarded"; scenarioId: "respiratory" | "digestive" | "dental" | "general"; language: "en" | "kn" | "tulu" | "kok"; concernText?: string; answersJson: string; currentStep: number; consentVersion: string; nlpSummary?: string; nlpMatchedTermsJson?: string };

const store: ScreeningRecordRow[] = [];
let nextId = 1;

export async function saveScreeningRecord(input: SaveScreeningInput) { 
  let record = store.find(r => r.userId === input.userId && r.publicId === input.publicId);
  if (record) {
    record.status = input.status;
    record.scenarioId = input.scenarioId;
    record.language = input.language;
    record.concernText = input.concernText ?? null;
    record.answersJson = input.answersJson;
    record.currentStep = input.currentStep;
    record.nlpSummary = input.nlpSummary ?? null;
    record.nlpMatchedTermsJson = input.nlpMatchedTermsJson ?? null;
    record.updatedAt = new Date();
  } else {
    record = {
      id: nextId++,
      userId: input.userId,
      publicId: input.publicId,
      status: input.status,
      scenarioId: input.scenarioId,
      language: input.language,
      concernText: input.concernText ?? null,
      answersJson: input.answersJson,
      currentStep: input.currentStep,
      consentVersion: input.consentVersion,
      consentedAt: new Date(),
      nlpSummary: input.nlpSummary ?? null,
      nlpMatchedTermsJson: input.nlpMatchedTermsJson ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.push(record);
  }
  return record; 
}
export async function listScreeningRecords(userId: number) { 
  return store.filter(r => r.userId === userId && r.status === "draft").sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()); 
}
export async function discardScreeningRecord(userId: number, publicId: string) { 
  const record = store.find(r => r.userId === userId && r.publicId === publicId);
  if (record) {
    record.status = "discarded";
    record.updatedAt = new Date();
  }
  return { success: true as const }; 
}
