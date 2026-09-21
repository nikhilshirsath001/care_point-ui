import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private apiService: ApiService) { }
}
