import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
 constructor(private httpClient: HttpClient) { }

  public getPromise(url: string, params?: HttpParams) {
    return firstValueFrom(this.httpClient.get(environment.apiUrl + url, { withCredentials:true, ...params }));
  }
  public getObservable(url: string, params?: HttpParams) {
    return this.httpClient.get(environment.apiUrl + url, { withCredentials:true, ...params });
  }

  public getObservableURI<T>(url: string, options?: { params?: HttpParams; responseType?: any; withCredentials?: boolean }) {
    return this.httpClient.get<T>(environment.apiUrl + url, { withCredentials: true, ...options });
  }

  public getObservableURIS<T>(url: string, options?: any) {
  return this.httpClient.get<T>(environment.apiUrl + url, { ...options, withCredentials: true } as any);
}

  public postPromise(url: string, body: any, params?: HttpParams) {
    return firstValueFrom(this.httpClient.post(environment.apiUrl + url, body, { withCredentials:true, ...params }))
  }
  public postObservable(url: string, body: any, params?: any) {
    return this.httpClient.post(environment.apiUrl + url, body, { withCredentials:true, ...params });
  }
  public patchPromise(url: string, body: any, params?: HttpParams) {
    return firstValueFrom(this.httpClient.patch(environment.apiUrl + url, body, { withCredentials:true, ...params }))
  }
  public patchObservable(url: string, body: any, params?: HttpParams) {
    return this.httpClient.patch(environment.apiUrl + url, body, { withCredentials:true, ...params });
  }
  public deletePromise(url: string, body?: any, params?: HttpParams) {
    return firstValueFrom(this.httpClient.patch(environment.apiUrl + url, body, { withCredentials:true, ...params }))
  }
  public deleteObservable(url: string, body?: any, params?: HttpParams) {
    return this.httpClient.patch(environment.apiUrl + url, body, { withCredentials:true, ...params });
  }
}