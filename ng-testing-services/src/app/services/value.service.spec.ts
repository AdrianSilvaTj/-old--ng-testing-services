import { TestBed } from '@angular/core/testing';
import { ValueService } from './value.service';

describe('ValueService', () => {
  let service: ValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // elementos que evaluaremos en ese modulo de pruebas
      providers: [ValueService]
    });
    // En vez de: service = new ValueService(), obtenemos la inyeccion de dependecia de TestBed
    service = TestBed.inject(ValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Test for getValue', () => {
    it('should return "my value"', () => {
      expect(service.getValue()).toBe('my value');
    });
  });

  describe('Test for setValue', () => {
    it('should change the value', () => {
      expect(service.getValue()).toBe('my value');
      service.setValue('change');
      expect(service.getValue()).toBe('change');
    });
  });

  describe('Test for getObservableValue', () => {
    it('should return "observable value"', () => {
      service.getObservableValue()
      .subscribe((value: string) => {
        expect(value).toBe('observable value');
      })
    });
  });

  describe('Test for getPromiseValue', () => {
    it('should return "promise value" from promise (then)', (doneFn) => {
      service.getPromiseValue().then((value) => {
        //assert
        expect(value).toBe('promise value');
        doneFn();
      });
    });

    it('should return "promise value" from promise (async - await)', async () => {
      const rta = await service.getPromiseValue();
      expect(rta).toBe('promise value');
    });
  });
});
