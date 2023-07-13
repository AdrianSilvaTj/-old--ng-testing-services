import { ValueService } from './value.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(
    private valueService : ValueService
  ) { }

  getValue(){
    return this.valueService.getValue();
  }

}
