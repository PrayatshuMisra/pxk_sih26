import type { AppointmentRow, PatientProfileRow, ScreeningRecordRow } from "../drizzle/schema";
import { screeningStore } from "./screeningDb";

export type PatientProfileInput = { displayName: string; ageYears: number; gender: string };
export type AppointmentInput = { userId: number; appointmentRef: string; doctorId: string; scheduledAt: Date; screeningRecordId?: string; patientNote?: string; complaintLedgerJson: string; consentVersion: string; profile: PatientProfileInput };

const patientProfiles: PatientProfileRow[] = [];
const appointments: AppointmentRow[] = [];
let nextProfileId = 1;
let nextApptId = 1;

export async function createAppointment(input: AppointmentInput) {
  let profile = patientProfiles.find(p => p.userId === input.userId);
  if (profile) {
    profile.displayName = input.profile.displayName;
    profile.ageYears = input.profile.ageYears;
    profile.gender = input.profile.gender;
    profile.updatedAt = new Date();
  } else {
    profile = {
      id: nextProfileId++,
      userId: input.userId,
      displayName: input.profile.displayName,
      ageYears: input.profile.ageYears,
      gender: input.profile.gender,
      updatedAt: new Date()
    };
    patientProfiles.push(profile);
  }

  const appointment: AppointmentRow = {
    id: nextApptId++,
    appointmentRef: input.appointmentRef,
    userId: input.userId,
    doctorId: input.doctorId,
    scheduledAt: input.scheduledAt,
    status: "confirmed",
    screeningRecordId: input.screeningRecordId || null,
    patientNote: input.patientNote || null,
    complaintLedgerJson: input.complaintLedgerJson,
    consentVersion: input.consentVersion,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  appointments.push(appointment);
  return appointment;
}

export async function listOwnAppointments(userId: number) {
  return appointments
    .filter(a => a.userId === userId)
    .sort((a, b) => b.scheduledAt.getTime() - a.scheduledAt.getTime());
}

export async function listProviderAppointments() {
  return appointments
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map(appointment => {
      const profile = patientProfiles.find(p => p.userId === appointment.userId);
      const screening = screeningStore.find(s => s.userId === appointment.userId && s.publicId === appointment.screeningRecordId) || null;
      
      // Ensure we return exactly what the join returned:
      // db.select({ appointment, profile, screening })
      return {
        appointment,
        profile: profile!,
        screening
      };
    });
}
