export interface ICategorie {
    id: number;
    wording: string;
    description: string;
    group: IGroup;
}

export interface IGroup {
    id: number;
    name: string;
    color: string;
}