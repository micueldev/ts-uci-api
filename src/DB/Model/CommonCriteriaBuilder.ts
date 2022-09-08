import { Op } from 'sequelize';

import Criteria from '@/Domain/Model/Criteria';
import CriteriaWithId from '@/Domain/Model/CriteriaWithId';

class CommonCriteriaBuilder {
  public static buildCommonCriteria(
    criteria: Criteria,
    onlyFilter = false,
  ): any {
    const query: any = {};

    const where: any = { [Op.and]: [] };
    if (criteria instanceof CriteriaWithId) {
      const id = criteria.getId();
      if (id) {
        where[Op.and].push({ id });
      }

      const ids = criteria.getIds();
      if (ids && ids.length) {
        where[Op.and].push({ id: ids });
      }

      query.where = where;
    }

    if (!onlyFilter) {
      const pagination = criteria.getPagination();
      if (pagination) {
        const { limit, offset } = pagination;
        query.limit = limit;
        query.offset = offset;
      }

      const sorting = criteria.getSorting();
      if (sorting) {
        const { field, direction } = sorting;
        query.order = [[field, direction]];
      }
    }

    return query;
  }
}

export default CommonCriteriaBuilder;
