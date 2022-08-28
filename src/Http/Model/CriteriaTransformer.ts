import Criteria from '@/Domain/Model/Criteria';

const applySorting = (query: any, criteria: Criteria) => {
  if (Object.prototype.hasOwnProperty.call(query, 'sorting')) {
    const field = query.sorting
      .replace(/_([a-z])/g, (letter: string) => letter.toUpperCase())
      .replace(/(^\W*|_|\W*:.*$)/g, '');

    const direction = query.sorting.replace(/(^.*:\W*|\W*$)/g, '');

    criteria.sortBy(
      field === '' ? 'id' : field,
      direction === '' ? Criteria.DIRECTION_ASC : direction,
    );
  }
};

const applyPagination = (
  query: any,
  criteria: Criteria,
  defaultPage = 1,
  defaultLimit = 10,
) => {
  if (Object.prototype.hasOwnProperty.call(query, 'pagination')) {
    const page = query.pagination.replace(/(^\D*|\D*:.*$)/g, '');
    const limit = query.pagination.replace(/(^.*:\D*|\D*$)/g, '');

    criteria.paginate(
      page === '' ? defaultPage : +page,
      limit === '' ? defaultLimit : +limit,
    );
  } else if (
    Object.prototype.hasOwnProperty.call(query, 'page') ||
    Object.prototype.hasOwnProperty.call(query, 'limit')
  ) {
    const page = query.page || defaultPage;
    const limit = query.limit || defaultLimit;

    criteria.paginate(+page, +limit);
  } else {
    criteria.paginate(defaultPage, defaultLimit);
  }
};

export { applySorting, applyPagination };
