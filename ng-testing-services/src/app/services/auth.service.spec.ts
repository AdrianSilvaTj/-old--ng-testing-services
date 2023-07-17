import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TokenService } from './token.service';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { AuthService } from './auth.service';
import { environment } from './../../environments/environment';
import { Auth } from '../models/auth.model';

fdescribe('AuthSetvice', () => {
  let authService: AuthService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        TokenService,
      ],
    });
    authService = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('test for login', () => {
    it('should return a token', (doneFn) => {
      // Arrange
      const mockData: Auth = {
        access_token: 'AT112233'
      };
      // Simulamos la petición
      authService.login('email@mail.com','password')
      .subscribe((token) => {
        expect(token).toEqual(mockData);
        doneFn();
      });

      // htttp config, hacemos que emule hacer un request, pero que devuelva el mockData
      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(url);
      // cambia la info contenida al mockData
      req.flush(mockData);
    });

    it('should save a token in Local Storage', (doneFn) => {
      // Arrange
      const mockData: Auth = {
        access_token: 'AT112233'
      };
      spyOn(tokenService, 'saveToken').and.callThrough();
      // Simulamos la petición
      authService.login('email@mail.com','password')
      .subscribe((token) => {
        expect(token).toEqual(mockData);
        expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
        expect(tokenService.saveToken).toHaveBeenCalledOnceWith('AT112233');
        doneFn();
      });

      // htttp config, hacemos que emule hacer un request, pero que devuelva el mockData
      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(url);
      // cambia la info contenida al mockData
      req.flush(mockData);
    });
  });

});
