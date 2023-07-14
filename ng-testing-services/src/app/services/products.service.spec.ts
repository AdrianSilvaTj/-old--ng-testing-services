import { generateOneProduct } from './../models/product.mock';
import { environment } from './../../environments/environment.development';
import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CreateProductDTO, Product, UpdateProductDTO } from '../models/product.model';
import { generateManyProducts } from '../models/product.mock';
import { of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

describe('ProductsService', () => {
  let productService: ProductService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    productService = TestBed.inject(ProductService);
    httpController = TestBed.inject(HttpTestingController);
  });

  // Esto se ejecuata al final de cada prueba
  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(productService).toBeTruthy();
  });

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
  });

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
      productService.getAll(limit,offset)
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
  })

  describe('test for create', () => {

    it('should return a new Product', (doneFn) => {
      // ARRANGE
      const mockData = generateOneProduct();
      const dto: CreateProductDTO = {
        title: 'new Product',
        price: 100,
        images: ['img'],
        description: 'bla bla bla',
        categoryId: '12'
      }
      // ACT:  * Para prevenir algunos errorres que pueden pasar por alguna mutación en los datos,
      // tratamos de no enviar el objeto, generamos una copia que no tenga problemas de mutación {...dto},
      // esto sobretodo para objetos y arrays
      productService.create({...dto}).subscribe(data => {
        // ASSERT:
        expect(data).toEqual(mockData);
        doneFn()
      });

      // htttp config, hacemos que emule hacer un request, pero que devuelva el mockData
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      // TEST: Verificamos que el body del request sea igual a lo que enviamos
      expect(req.request.body).toEqual(dto)
      expect(req.request.method).toEqual('POST');

    })
  })

  fdescribe('test for update', () => {

    it('should return a update Product', (doneFn) => {
      // ARRANGE
      const mockData:Product= generateOneProduct();
      const dto: UpdateProductDTO = {
        title: 'new Product'
      }
      // ACT:  * Para prevenir algunos errorres que pueden pasar por alguna mutación en los datos,
      // tratamos de no enviar el objeto, generamos una copia que no tenga problemas de mutación {...dto},
      // esto sobretodo para objetos y arrays
      productService.update(mockData.id,{...dto}).subscribe(data => {
        // ASSERT:
        expect(data).toEqual(mockData);
        doneFn()
      });

      // htttp config, hacemos que emule hacer un request, pero que devuelva el mockData
      const url = `${environment.API_URL}/api/v1/products/${mockData.id}`;
      const req = httpController.expectOne(url);
      // TEST: Verificamos que el body del request sea igual a lo que enviamos
      expect(req.request.body).toEqual(dto)
      expect(req.request.method).toEqual('PUT');
      expect(req.request.url).toEqual(url)
      req.flush(mockData);

    })
  })
  fdescribe('test for delete', () => {

    it('should delete a Product', (doneFn) => {
      // ARRANGE
      const mockData = true;
      const id = "1";
      // ACT:  * Para prevenir algunos errorres que pueden pasar por alguna mutación en los datos,
      // tratamos de no enviar el objeto, generamos una copia que no tenga problemas de mutación {...dto},
      // esto sobretodo para objetos y arrays
      productService.delete(id).subscribe(data => {
        // ASSERT:
        expect(data).toEqual(mockData);
        doneFn()
      });

      // htttp config, hacemos que emule hacer un request, pero que devuelva el mockData
      const url = `${environment.API_URL}/api/v1/products/${id}`;
      const req = httpController.expectOne(url);
      // TEST: Verificamos que el body del request sea igual a lo que enviamos
      expect(req.request.body).toBeNull();
      expect(req.request.method).toEqual('DELETE');
      req.flush(mockData);

    })

    it('should ....', () => {
    // Arrange

    // Act
    // Assert
    });



  })
})
