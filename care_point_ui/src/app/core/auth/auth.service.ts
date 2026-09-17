import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private apiCallService : ApiService) { }

    login(data: any) {
    return this.apiCallService.postObservable(`/login`, data);
  }
  logout() {
    return this.apiCallService.postObservable(`/logout`, null);
  }
}
