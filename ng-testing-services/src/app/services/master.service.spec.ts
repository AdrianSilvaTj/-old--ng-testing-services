import { MasterService } from './master.service';
import { FakeValueService } from './value-fake.service';
import { ValueService } from './value.service';
import { TestBed } from '@angular/core/testing';

describe('MasterService', () => {
  let masterService: MasterService;
  let valueServiceSpy: jasmine.SpyObj<ValueService>; // Tipamos un SpyObj con los elementos de ValueService

  beforeEach(() => {
    // creamos un SpyObj
    const spy = jasmine.createSpyObj('ValueService', ['getValue']);

    TestBed.configureTestingModule({
      // elementos que evaluaremos en ese modulo de pruebas
      providers: [
        MasterService,
        // le indicamos que dentro del masterSErvice en vez de utilizar la instancia de ValueService,
        // utilice el spy de ValueService
        { provide: ValueService, useValue: spy }
      ],
    });
    // En vez de: service = new ValueService(), obtenemos la inyeccion de dependecia de TestBed
    masterService = TestBed.inject(MasterService);
    valueServiceSpy = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;
  });

  it('should be created', () => {
    expect(masterService).toBeTruthy();
  });

  /* Hacemos la prueba con espia que nos permitirá saber si se esta haciendo el llamado */
  it('should call to getValue from ValueServices', () => {

    // le indicamos que deseamos que retorne
    valueServiceSpy.getValue.and.returnValue('fake value');

    expect(masterService.getValue()).toBe('fake value');
    // testeamos si fue llamado
    expect(valueServiceSpy.getValue).toHaveBeenCalled();
    // testeamos si fue llamado solo una vez
    expect(valueServiceSpy.getValue).toHaveBeenCalledTimes(1);
  });
  // it('should return "my value" from the real service', () => {
  //   const valueService = new ValueService();
  //   const masterService = new MasterService(valueService);
  //   expect(masterService.getValue()).toBe('my value');
  // });

  // /* Solo prueba que se ejecute el metodo del servicio */
  // it('should return "other value" from the fake service', () => {
  //   const fakeValueService = new FakeValueService();
  //   const masterService = new MasterService(
  //     fakeValueService as unknown as ValueService
  //   );
  //   expect(masterService.getValue()).toBe('fake value');
  // });

  // /* Solo prueba que se ejecute el metodo del servicio, utilizando un objeto como clase */
  // it('should return "other value" from the fake object', () => {
  //   const fake = { getValue: () => 'fake from object' };
  //   const masterService = new MasterService(fake as ValueService);
  //   expect(masterService.getValue()).toBe('fake from object');
  // });

});
