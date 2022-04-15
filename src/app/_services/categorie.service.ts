import {Injectable} from '@angular/core';
import {BehaviorSubject, forkJoin, Observable} from 'rxjs';
import {API_ROUTES} from '../app-static';
import {ICategorie, IGroup} from '../_models/categorie.model';
import {HttpService} from '../_services/http.service';

@Injectable({
    providedIn: 'root',
})
export class CategorieService {
    private readonly categoriesSubjet: BehaviorSubject<ICategorie[] | null>;
    public readonly categories$!: Observable<ICategorie[] | null>;

    private readonly groupsSubjet: BehaviorSubject<IGroup[] | null>;
    public readonly groups$!: Observable<IGroup[] | null>;

    constructor(private readonly httpService: HttpService) {
        this.categoriesSubjet = new BehaviorSubject<ICategorie[] | null>(null);
        this.categories$ = this.categoriesSubjet.asObservable();
        this.groupsSubjet = new BehaviorSubject<IGroup[] | null>(null);
        this.groups$ = this.groupsSubjet.asObservable();
        this.loadCategoriesFiltrer();
    }

    private getCategories$(): Observable<ICategorie[]> {
        return this.httpService.get<ICategorie[]>(API_ROUTES.GET_CATEGORIES);
    }

    private getIdCategoriesVisible$(): Observable<Partial<ICategorie>[]> {
        return this.httpService.get<Partial<ICategorie>[]>(
            API_ROUTES.GET_CATEGORIES_VISIBLE
        );
    }

    // à l'instanciation du service on charge les données
    private loadCategoriesFiltrer(): void {
        this.categoriesSubjet.next(null);
        forkJoin([
            this.getCategories$(),
            this.getIdCategoriesVisible$(),
        ]).subscribe(([categories, categoriesVisible]) => {
            let categoriesFiltrer: ICategorie[] = categories.filter(
                (categorie) =>
                    categoriesVisible.find(
                        (categorieVisible) =>
                            categorieVisible.id === categorie.id
                    )
            );
            this.categoriesSubjet.next(categoriesFiltrer);
            this.extraireGroups(categoriesFiltrer);
            this.ordonnerCategories();
        });
    }

    public get categories(): null | ICategorie[] {
        return this.categoriesSubjet.getValue();
    }

    public get groups(): null | IGroup[] {
        return this.groupsSubjet.getValue();
    }

    // récupération des groupes
    private extraireGroups(categories: ICategorie[]): void {
        if (!categories) {
            return;
        }
        let groups = categories
            .map((categorie) => categorie.group)
            .filter(
                (group, index, groups) =>
                    groups.findIndex((groupe) => groupe.id === group.id) ===
                    index
            );
        this.groupsSubjet.next(groups);
    }

    // ordonner les catégories ASC sur le wording
    private ordonnerCategories(): void {
        if (!this.categories) {
            return;
        }
        this.categories.sort(function compare(a, b) {
            if (a.wording < b.wording) return -1;
            if (a.wording > b.wording) return 1;
            return 0;
        });
        this.categoriesSubjet.next(this.categories);
    }
}
