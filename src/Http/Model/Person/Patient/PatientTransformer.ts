import DateFormatter from '@/Http/Model/DateFormatter';
import Patient from '@/Domain/Model/Person/Patient';

export interface PatientProps {
  first_name: string;
  last_name: string;
  birth_date: string;
  document_number: string;
  account_number: string;
  weight: number;
  start_institute: string;
  start_uci: string;
}

interface DefaultPatientOutputProps {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  document_number: string;
  account_number: string;
  weight: number;
  start_institute: string;
  start_uci: string;
  created_at: string;
  updated_at: string;
}

class PatientTransformer {
  public static bodyToPatient(body: PatientProps): Patient {
    const patient = new Patient();
    patient.firstName = body.first_name;
    patient.lastName = body.last_name;
    patient.birthDate = new Date(body.birth_date);
    patient.documentNumber = body.document_number;
    patient.accountNumber = body.account_number;
    patient.weight = body.weight;
    patient.startInstitute = new Date(body.start_institute);
    patient.startUci = new Date(body.start_uci);

    return patient;
  }

  public static patientToDefaultOutput(
    patient: Patient,
  ): DefaultPatientOutputProps {
    return {
      id: patient.id!,
      first_name: patient.firstName,
      last_name: patient.lastName,
      birth_date: DateFormatter.format(
        patient.birthDate!,
        DateFormatter.HTTP_FORMAT_DATE,
      ),
      document_number: patient.documentNumber!,
      account_number: patient.accountNumber,
      weight: patient.weight,
      start_institute: DateFormatter.format(
        patient.startInstitute!,
        DateFormatter.HTTP_FORMAT_DATE,
      ),
      start_uci: DateFormatter.format(
        patient.startUci!,
        DateFormatter.HTTP_FORMAT_DATE,
      ),
      created_at: DateFormatter.format(patient.createdAt),
      updated_at: DateFormatter.format(patient.updatedAt),
    };
  }
}

export default PatientTransformer;
