import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status';
import { Container } from 'typedi';

import BedService from '@/Domain/Service/Bed/BedService';
import BedCriteria from '@/Domain/Model/Bed/BedCriteria';
import BedTransformer, { BedProps } from '@/Http/Model/Bed/BedTransformer';
import BedCriteriaTransformer from '@/Http/Model/Bed/BedCriteriaTransformer';
import PaginatedBedsOutput from '@/Http/Model/Bed/PaginatedBedsOutput';

const getBeds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bedCriteria = BedCriteriaTransformer.createCriteriaFromQuery(
      req.query,
    );

    const bedService = Container.get(BedService);

    const beds = await bedService.getBeds(bedCriteria);

    res.json(new PaginatedBedsOutput(beds, bedCriteria));
  } catch (err) {
    next(err);
  }
};

const getBed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const bedService = Container.get(BedService);

    const bed = await bedService.getBed(BedCriteria.createById(+id));

    res.json(BedTransformer.bedToDefaultOutput(bed));
  } catch (err) {
    next(err);
  }
};

const postBed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body }: { body: BedProps } = req;

    let bed = BedTransformer.bodyToBed(body);

    const bedService = Container.get(BedService);

    bed = await bedService.createBed(bed);

    res.status(HttpStatus.CREATED).json({ id: bed.id });
  } catch (err) {
    next(err);
  }
};

const putBed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { body }: { body: BedProps } = req;

    let bed = BedTransformer.bodyToBed(body);
    bed.id = +id;

    const bedService = Container.get(BedService);

    bed = await bedService.updateBed(bed);

    res.status(HttpStatus.NO_CONTENT).json();
  } catch (err) {
    next(err);
  }
};

const deleteBed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const bedService = Container.get(BedService);

    await bedService.deleteBed(+id);

    res.status(HttpStatus.NO_CONTENT).json();
  } catch (err) {
    next(err);
  }
};

export { getBeds, getBed, postBed, putBed, deleteBed };
