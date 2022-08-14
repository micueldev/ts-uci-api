import Criteria from "../../Domain/Model/Criteria"


const applySorting = (
    query: any,
    criteria: Criteria
) => {
    if(query.hasOwnProperty('sorting')){        
        const field = query.sorting.replace(/\_([a-z])/g, (letter: string)=>letter.toUpperCase())
                        .replace(/(^\W*|\_|\W*\:.*$)/g, '');

        const direction = query.sorting.replace(/(^.*\:\W*|\W*$)/g, '');
        
        criteria.sortBy(
            (field==='')? 'id' : field,
            (direction==='')? Criteria.DIRECTION_ASC : direction
        );
    }
}

const applyPagination = (
    query: any,
    criteria: Criteria,
    defaultPage: number = 1,
    defaultLimit: number = 10
) => {
    if(query.hasOwnProperty('pagination')){
        const page = query.pagination.replace(/(^\D*|\D*\:.*$)/g, '');
        const limit = query.pagination.replace(/(^.*\:\D*|\D*$)/g, '');
        
        criteria.paginate(
            (page==='') ? defaultPage : +page,
            (limit==='') ? defaultLimit : +limit
        );
    } else if (query.hasOwnProperty('page') || query.hasOwnProperty('limit')){
        const page = query.page || defaultPage;
        const limit = query.limit || defaultLimit;

        criteria.paginate(+page, +limit);
    } else {
        criteria.paginate(defaultPage, defaultLimit)
    }
}


export {
    applySorting,
    applyPagination
}
