import { Product } from './../../models/product.model';
import { ProductService } from './../../services/product.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {

  products: Product[] = [];

  constructor(
    private productService: ProductService
  ){}

  ngOnInit(){
    this.getAllProducts();
  }

  getAllProducts(){
    this.productService.getAllSimple()
    .subscribe(products =>{
      this.products = products
    })
  }

}
