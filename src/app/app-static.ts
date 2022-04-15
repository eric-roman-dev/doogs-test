
// liste des endpoints statiques
export enum API_ROUTES{
    GET_CATEGORIES = 'all-categories',
    GET_CATEGORIES_VISIBLE = 'visible-categories'
}


// interface de la liste des paramètres possibles de l'url
export interface IApiParams {
    id?: number;
}

// regex des paramètres de l'url
export const QUERY_PARAM_REGEX = /:[a-zA-Z0-9_]*/g;