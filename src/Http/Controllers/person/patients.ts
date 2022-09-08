import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status';
import { Container } from 'typedi';

import PatientService from '@/Domain/Service/Person/PatientService';
import PatientCriteria from '@/Domain/Model/Person/PersonCriteria';
import PatientTransformer, {
  PatientProps,
} from '@/Http/Model/Person/Patient/PatientTransformer';
import PatientCriteriaTransformer from '@/Http/Model/Person/Patient/PatientCriteriaTransformer';
import PaginatedPatientsOutput from '@/Http/Model/Person/Patient/PaginatedPatientsOutput';

const getPatients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patientCriteria = PatientCriteriaTransformer.createCriteriaFromQuery(
      req.query,
    );

    const patientService = Container.get(PatientService);

    const patients = await patientService.getPatients(patientCriteria);

    res.json(new PaginatedPatientsOutput(patients, patientCriteria));
  } catch (err) {
    next(err);
  }
};

const getPatient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const patientService = Container.get(PatientService);

    const patient = await patientService.getPatient(
      PatientCriteria.createById(+id),
    );

    res.json(PatientTransformer.patientToDefaultOutput(patient));
  } catch (err) {
    next(err);
  }
};

const postPatient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body }: { body: PatientProps } = req;

    let patient = PatientTransformer.bodyToPatient(body);

    const patientService = Container.get(PatientService);

    patient = await patientService.createPatient(patient);

    res.status(HttpStatus.CREATED).json({ id: patient.id });
  } catch (err) {
    next(err);
  }
};

const putPatient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { body }: { body: PatientProps } = req;

    let patient = PatientTransformer.bodyToPatient(body);
    patient.id = +id;

    const patientService = Container.get(PatientService);

    patient = await patientService.updatePatient(patient);

    res.status(HttpStatus.NO_CONTENT).json();
  } catch (err) {
    next(err);
  }
};

const deletePatient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const patientService = Container.get(PatientService);

    await patientService.deletePatient(+id);

    res.status(HttpStatus.NO_CONTENT).json();
  } catch (err) {
    next(err);
  }
};

export { getPatients, getPatient, postPatient, putPatient, deletePatient };
