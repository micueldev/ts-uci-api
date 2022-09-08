import DateFormatter from '@/Http/Model/DateFormatter';
import Bed from '@/Domain/Model/Bed/Bed';

export interface BedProps {
  name: string;
  description: string | null;
}

interface DefaultBedOutputProps {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

class BedTransformer {
  public static bodyToBed(body: BedProps): Bed {
    const bed = new Bed();
    bed.name = body.name;
    bed.description = body.description;

    return bed;
  }

  public static bedToDefaultOutput(bed: Bed): DefaultBedOutputProps {
    return {
      id: bed.id!,
      name: bed.name,
      description: bed.description,
      created_at: DateFormatter.format(bed.createdAt),
      updated_at: DateFormatter.format(bed.updatedAt),
    };
  }
}

export default BedTransformer;
