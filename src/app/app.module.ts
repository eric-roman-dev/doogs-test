import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CategoriesComponent} from './categories/categories.component';
import {JsonPipe, registerLocaleData} from '@angular/common';
import {NZ_I18N} from 'ng-zorro-antd/i18n';
import {fr_FR} from 'ng-zorro-antd/i18n';
import fr from '@angular/common/locales/fr';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzSelectModule} from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { FiltreRecherchePipe } from './_shared/filtre-recherche.pipe';

registerLocaleData(fr);

@NgModule({
    declarations: [AppComponent, CategoriesComponent, FiltreRecherchePipe],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        BrowserAnimationsModule,
        NzGridModule,
        NzSelectModule,
        NzInputModule,
        NzIconModule,
        NzEmptyModule
    ],
    providers: [JsonPipe, {provide: NZ_I18N, useValue: fr_FR}],
    bootstrap: [AppComponent],
})
export class AppModule {}
