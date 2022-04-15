import {Component, OnDestroy, OnInit} from '@angular/core';
import {ICategorie, IGroup} from '../_models/categorie.model';
import {CategorieService} from '../_services/categorie.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit, OnDestroy {
    private readonly subscription = new Subscription();
    public categories: null | ICategorie[] = null;
    public groups: null | IGroup[] = null;
    public groupInputSelect: null | IGroup[] = null;
    public mode : 'groupe'|'ordonner' = 'groupe';
    public groupeSelectionner: IGroup['id'] | 'all' = 'all';
    public rechercheValeur="";
    public categoriesFiltrer: null | ICategorie[] = null;

    constructor(
        private readonly categorieService: CategorieService
    ) {}

    public ngOnInit(): void {
        this.subscription.add(
            this.categorieService.categories$.subscribe((categories) => {
                this.categories = categories;
                this.categoriesFiltrer = this.categories;
            })
        );
        this.subscription.add(
            this.categorieService.groups$.subscribe((groups) => {
                this.groups = groups;
                if (this.groups) {
                    this.groupInputSelect = Object.assign(this.groups);
                }
            })
        );
    }


// gestion des mode d'affichage
    public changeMode(mode:'groupe'|'ordonner') {
        this.mode = mode;
    }

    // gestion de la filtration par groupe
    public groupChange() {
        if (
            !this.groupeSelectionner ||
            this.categoriesFiltrer === null ||
            this.categorieService.groups === null ||
            this.categorieService.categories === null
        ) {
            return;
        }
        
        if (this.groupeSelectionner === 'all') {
            this.groups = this.categorieService.groups;
            this.categories = this.categorieService.categories;
        } else {
            this.groups = this.categorieService.groups.filter(
                (group) => group.id === this.groupeSelectionner
            );
            this.categories = this.categorieService.categories.filter(
                (categorie) => categorie.group.id === this.groupeSelectionner
            );
        }
        this.filtreRechercheCategorie(this.rechercheValeur);
    }

    // gestion de la filtration par recherche
    public filtreRechercheCategorie(event: Event|string): void {
        if (!this.categories ) {
            return;
        }
        if(event instanceof Event){
            this.categoriesFiltrer = this.categories.filter((val) =>
            val.wording.toLowerCase().includes((event.target as HTMLInputElement).value)
        );
        }else{
            this.categoriesFiltrer = this.categories.filter((val) =>
            val.wording.toLowerCase().includes(event)
        );
        }
        
    }

    // affichage des categories selon le groupe selectionner
    public filtrerParGroupe(categories: ICategorie[], group: IGroup) {
        return categories.filter(
            (categorie) => categorie.group.id === group.id
        );
    }

    // gestion des groupes sans couleur
    public classGroup(color: IGroup['color'] | null) {
        if (!color) {
            return 'm-default';
        }
        return color;
    }

    // à la fermeture du composant on désabonne
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
