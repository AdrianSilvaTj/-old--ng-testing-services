import { generateOneProduct } from './../models/product.mock';
import { environment } from './../../environments/environment.development';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  CreateProductDTO,
  Product,
  UpdateProductDTO,
} from '../models/product.model';
import { generateManyProducts } from '../models/product.mock';
import { of, throwError } from 'rxjs';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpStatusCode,
} from '@angular/common/http';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { TokenService } from './token.service';
import { ProductService } from './product.service';

fdescribe('ProductsService', () => {
  let productService: ProductService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductService,
        TokenService,
        HttpClient,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
      ],
    });
    productService = TestBed.inject(ProductService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  // Esto se ejecuata al final de cada prueba
  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(productService).toBeTruthy();
  });

  /* getAllSimple ###################################################################### */

  describe('test for getAllSimple', () => {
    it('should return a product list', (doneFn) => {
      // creamos un mock de la data que deberíamos recibir del API

      const mockData: Product[] = generateManyProducts();
      // Simulamos la petición
      productService.getAllSimple().subscribe((data) => {
        expect(data).toEqual(mockData);
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });

      // htttp config, hacemos que emule hacer un request, pero que devuelva el mockData
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      // cambia la info contenida al mockData
      req.flush(mockData);
    });

    it('should return a product list, send token', (doneFn) => {
      // creamos un mock de la data que deberíamos recibir del API
      const mockData: Product[] = generateManyProducts(2);
      // indicamos que solo queremos espiar el getToken de tokenService
      // y simulamos retornar un token
      spyOn(tokenService, 'getToken').and.returnValue('123');
      // Simulamos la petición
      productService.getAllSimple().subscribe((data) => {
        expect(data).toEqual(mockData);
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });

      // htttp config, hacemos que emule hacer un request, pero que devuelva el mockData
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      // verificamos que contenga el token simulados en los headers
      const headers = req.request.headers;
      expect(headers.get('Authorization')).toEqual('Bearer 123');
      // cambia la info contenida al mockData
      req.flush(mockData);
    });

  //   it('should retry the request 3 times, if catch error', (doneFn) => {
  //     // Arrange

  //     const msgError = 'Server error';
  //     const mockError = {
  //       status: HttpStatusCode.NotFound,
  //       statusText: msgError
  //     };
  //     spyOn('retry');
  //     productService.getAllSimple().subscribe({
  //       error: (error) => {
  //         // ASSERT:
  //         expect(mockHttpClient.get).toHaveBeenCalledTimes(3);
  //         doneFn()
  //       }
  //     });

  //     // htttp config, hacemos que emule hacer un request, pero que devuelva el mockError
  //     const url = `${environment.API_URL}/api/v1/products/`;
  //     const req = httpController.expectOne(url);
  //     // ASSERT
  //     expect(req.request.method).toEqual('GET');
  //     req.flush(msgError, mockError);
  //   });
  });

  /* getAll ###################################################################### */

  describe('test for getAll', () => {
    it('should return a product list', (doneFn) => {
      // creamos un mock de la data que deberíamos recibir del API

      let mockData: Product[] = generateManyProducts(5);
      // realizamos el mismo calculo que se hace en el metodo original
      mockData.map((product) => (product.taxes = product.price * 0.19));
      // Simulamos la petición
      productService.getAll().subscribe((data) => {
        expect(data).toEqual(mockData);
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });

      // htttp config, hacemos que emule hacer un request, pero que devuelva el mockData
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      // cambia la info contenida al mockData
      req.flush(mockData);
    });

    it('should return correct taxes for products price', (doneFn) => {
      const mockData: Product[] = [
        {
          // al producto generarse de forma aleatoria y su precio tambien, cambiamos el precio por uno fijo
          ...generateOneProduct(),
          price: 100, // 100 * .19 = 19
        },
        {
          ...generateOneProduct(),
          price: 200, // 200 * .19 = 38
        },
        {
          ...generateOneProduct(),
          price: 0, // 0 * .19 = 0
        },
        {
          ...generateOneProduct(),
          price: -100, // = 0
        },
      ];

      productService.getAll().subscribe((data) => {
        expect(data[0].taxes).toEqual(19); // 100 * .19 = 19
        expect(data[1].taxes).toEqual(38); // 200 * .19 = 38
        expect(data[2].taxes).toEqual(0); // 0 * .19 = 0
        expect(data[3].taxes).toEqual(0); // -100 = 0
        //expect(data).toEqual(mockData.length);
        doneFn();
      });

      // htttp config, hacemos que emule hacer un request, pero que devuelva el mockData
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      // cambia la info contenida al mockData
      req.flush(mockData);
    });

    it('should send query params with limit 10 and offset 3 for example', (doneFn) => {
      // creamos un mock de la data que deberíamos recibir del API
      const limit = 10;
      const offset = 3;
      let mockData: Product[] = generateManyProducts(20);
      // Simulamos la petición
      productService
        .getAll(limit, offset)
        .pipe()
        .subscribe((data) => {
          doneFn();
        });

      // htttp config, hacemos que emule hacer un request, pero que devuelva el mockData
      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
      const req = httpController.expectOne(url);
      // cambia la info contenida al mockData
      req.flush(mockData);
      const params = req.request.params;
      // TEST: Verificar los params
      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
    });
  });

  /* GET ONE ###################################################################### */

  describe('test for getOne', () => {
    it('should return a Product', (doneFn) => {
      // ARRANGE
      const mockData: Product = generateOneProduct();
      const productId = '1';
      // ACT
      productService.getOne(productId).subscribe((data) => {
        // ASSERT:
        expect(data).toEqual(mockData);
        doneFn();
      });

      // htttp config, hacemos que emule hacer un request, pero que devuelva el mockData
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      // ASSERT
      expect(req.request.method).toEqual('GET');
      expect(req.request.url).toEqual(url);
      req.flush(mockData);
    });

    it('should return the rigth msj when the status code is 404', (doneFn) => {
      // ARRANGE
      const msgError = '404 message';
      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: msgError,
      };
      const productId = '1';
      // ACT
      productService.getOne(productId).subscribe({
        error: (error) => {
          // ASSERT:
          expect(error).toEqual('El producto no existe');
          doneFn();
        },
      });

      // htttp config, hacemos que emule hacer un request, pero que devuelva el mockError
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      // ASSERT
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });

    it('should return the rigth msj when the status code is 409', (doneFn) => {
      // ARRANGE
      const msgError = '409 message';
      const mockError = {
        status: HttpStatusCode.Conflict,
        statusText: msgError,
      };
      const productId = '1';
      // ACT
      productService.getOne(productId).subscribe({
        error: (error) => {
          // ASSERT:
          expect(error).toEqual('Algo esta fallando en el server');
          doneFn();
        },
      });

      // htttp config, hacemos que emule hacer un request, pero que devuelva el mockError
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      // ASSERT
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });

    it('should return the rigth msj when the status code is 401', (doneFn) => {
      // ARRANGE
      const msgError = '401 message';
      const mockError = {
        status: HttpStatusCode.Unauthorized,
        statusText: msgError,
      };
      const productId = '1';
      // ACT
      productService.getOne(productId).subscribe({
        error: (error) => {
          // ASSERT:
          expect(error).toEqual('No estas permitido');
          doneFn();
        },
      });

      // htttp config, hacemos que emule hacer un request, pero que devuelva el mockError
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      // ASSERT
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });
  });

  /* CREATE ###################################################################### */
  describe('test for create', () => {
    it('should return a new Product', (doneFn) => {
      // ARRANGE
      const mockData = generateOneProduct();
      const dto: CreateProductDTO = {
        title: 'new Product',
        price: 100,
        images: ['img'],
        description: 'bla bla bla',
        categoryId: '12',
      };
      // ACT:  * Para prevenir algunos errorres que pueden pasar por alguna mutación en los datos,
      // tratamos de no enviar el objeto, generamos una copia que no tenga problemas de mutación {...dto},
      // esto sobretodo para objetos y arrays
      productService.create({ ...dto }).subscribe((data) => {
        // ASSERT:
        expect(data).toEqual(mockData);
        doneFn();
      });

      // htttp config, hacemos que emule hacer un request, pero que devuelva el mockData
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      // TEST: Verificamos que el body del request sea igual a lo que enviamos
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('POST');
    });
  });

  /* UPDATE ###################################################################### */
  describe('test for update', () => {
    it('should return a update Product', (doneFn) => {
      // ARRANGE
      const mockData: Product = generateOneProduct();
      const dto: UpdateProductDTO = {
        title: 'new Product',
      };
      // ACT:  * Para prevenir algunos errorres que pueden pasar por alguna mutación en los datos,
      // tratamos de no enviar el objeto, generamos una copia que no tenga problemas de mutación {...dto},
      // esto sobretodo para objetos y arrays
      productService.update(mockData.id, { ...dto }).subscribe((data) => {
        // ASSERT:
        expect(data).toEqual(mockData);
        doneFn();
      });

      // htttp config, hacemos que emule hacer un request, pero que devuelva el mockData
      const url = `${environment.API_URL}/api/v1/products/${mockData.id}`;
      const req = httpController.expectOne(url);
      // TEST: Verificamos que el body del request sea igual a lo que enviamos
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.url).toEqual(url);
      req.flush(mockData);
    });
  });

  /* DELETE ###################################################################### */
  describe('test for delete', () => {
    it('should delete a Product', (doneFn) => {
      // ARRANGE
      const mockData = true;
      const id = '1';
      // ACT:  * Para prevenir algunos errorres que pueden pasar por alguna mutación en los datos,
      // tratamos de no enviar el objeto, generamos una copia que no tenga problemas de mutación {...dto},
      // esto sobretodo para objetos y arrays
      productService.delete(id).subscribe((data) => {
        // ASSERT:
        expect(data).toEqual(mockData);
        doneFn();
      });

      // htttp config, hacemos que emule hacer un request, pero que devuelva el mockData
      const url = `${environment.API_URL}/api/v1/products/${id}`;
      const req = httpController.expectOne(url);
      // TEST: Verificamos que el body del request sea igual a lo que enviamos
      expect(req.request.body).toBeNull();
      expect(req.request.method).toEqual('DELETE');
      req.flush(mockData);
    });
  });
});
