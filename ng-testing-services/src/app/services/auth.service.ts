import { TokenService } from './token.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Auth } from './../models/auth.model';
import { User } from './../models/user.model';
import { BehaviorSubject, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.API_URL}/api/v1/auth`;
  private userLog = new BehaviorSubject<User | null>(null);
  userLog$ = this.userLog.asObservable();

  constructor(
    private tokenService: TokenService,
    private http: HttpClient,
  ) {}



  login(email: string, password: string){
    return this.http.post<Auth>(`${this.apiUrl}/login`, { email, password})
    .pipe(
      // guarda el token en el LocalStorage utilizando el servicio de tokenService
      tap(token => this.tokenService.saveToken(token.access_token))
    )
    ;
  }

  // Al usar un interceptor para agregar el token a cualquier petición que se haga al backen,
  //  ya no necesitamos enviarselo como parametro ni enviarlo aca por el header
  // tambien emitimos el perfil del usuario a los subscrito del Observable userLog
  profile(){
    return this.http.get<User>(`${this.apiUrl}/profile`)
    .pipe(
        tap(user => this.userLog.next(user))
    )
  }

  // ejecuta dos acciones:
  // 1. Ejecuta el login con el email y password recibidos, y recibe el token
  // 2. Obtiene el perfil de usuario, gracias a ese token que es agregado por el interceptor
  loginAndGet(email:string, password:string){
    return this.login(email, password)
    .pipe(
      switchMap(() => this.profile()),
    )
  }

  logout() {
    this.tokenService.removeToken();
  }

}
