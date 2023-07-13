import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { HttpClientTestingModule} from '@angular/common/http/testing'

describe('ProductsService', () => {
  let productService: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductService
      ],
    });
    productService = TestBed.inject(ProductService);

  });

  it('should be created', () => {
    expect(productService).toBeTruthy();
  });
});
