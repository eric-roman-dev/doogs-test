import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtreRecherche'
})
export class FiltreRecherchePipe implements PipeTransform {
  transform(list: any[], filterText: string): any {
    return list ? list.filter(item => item.wording.search(new RegExp(filterText, 'i')) > -1) : [];
  }

}
