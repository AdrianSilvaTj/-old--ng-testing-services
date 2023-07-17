import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  saveToken(token: string){
    // guarda el token en el LocalStorage, donde permanece guardada de manera indefinida hasta se limpie la información del navegador
    localStorage.setItem('token', token);
  }

  getToken(){
    // obtiene el token guardado en el Local Storage
    const token = localStorage.getItem('token');
    return token;
  }

  removeToken(){
    localStorage.removeItem('token');
  }

}
