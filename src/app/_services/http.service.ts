import { Injectable } from '@angular/core';
import {
	HttpClient,
	HttpErrorResponse,
	HttpParams,
	HttpHeaders,
} from '@angular/common/http';
import { API_ROUTES, IApiParams, QUERY_PARAM_REGEX } from '../app-static';
import { JsonPipe } from '@angular/common';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';

interface HttpOptions {
	headers?:
		| HttpHeaders
		| {
				// tslint:disable-next-line: array-type
				[header: string]: string | string[];
			};
	observe?: 'body';
	params?:
		| HttpParams
		| {
				// tslint:disable-next-line: array-type
				[param: string]: string | string[];
			};
	reportProgress?: boolean;
	responseType?: any;
	withCredentials?: boolean;
}

@Injectable({
	providedIn: 'root',
})

export class HttpService {
	constructor(
		private readonly http: HttpClient,
		private readonly jsonPipe: JsonPipe
	) {}

	public get<T>(
		route: API_ROUTES,
		routeParams?: IApiParams,
		httpParams?: HttpOptions
	) {
		return this.sendRequest(this.http.get<T>(
			`${environment.url}${this.buildRoute(route, routeParams as IApiParams)}`,
			httpParams)
		);
	}

	private buildRoute(route: API_ROUTES, routeParams: any) {
		const matchs = route.match(QUERY_PARAM_REGEX);
		if (!matchs) {
			return route;
		}
		const builtRoute = matchs.reduce((_route, match) => {
			if (!routeParams[match.replace(':', '')]) {
				return _route.replace(match, '');
			}
			return _route.replace(match, routeParams[match.replace(':', '')]);
		}, route);

		return builtRoute;
	}

	private sendRequest<T>(request: Observable<T>): Observable<T> {
        const replay = request.pipe(shareReplay());
        void (async () => {
			return replay.subscribe({error: this.errorHandler.bind(this)});
		})();

        return replay;
    }

	private async errorHandler<T>({ error }: HttpErrorResponse) {
		if (!error) {
			return;
		}

		// TODO traitement des erreurs
		// console.log(error);
		if (environment.production) {
			console.error('error', `Une erreur est survenue `);
		} else {
			console.warn(
				'error',
				`Une erreur est survenue : <div class="mt-04 error-message"><p>${this.jsonPipe.transform(
					error
				)}</p> </div>`
			);
		}
	}
}
