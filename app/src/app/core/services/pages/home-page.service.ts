import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from '../http/crud.service';
import { StorageService } from '../storage/storage.service';
import { StorageKey } from '../storage/storage.model';

const {AUTH_TOKEN} = StorageKey;

@Injectable({
  providedIn: 'root'
})
export class HomePageService extends CrudService {
  endpoint = 'teacherevaluation';
  token: string;

  constructor(http: HttpClient, private storage: StorageService) {
    super(http);
    this.token = storage.read(AUTH_TOKEN) || '';
  }

  public async getTeacherToEvaluate(body: Object) {
    let res = null;
    try {
      this.endpoint = 'teacherevaluation/teachertoevaluate';
      res = await this.post(body);
    } catch (err) {
      res = this.errorHandler('getTeacherToEvaluate', err);
    }
    return res;
  }

  public async getTeacherToEvaluateTemporarys(body: Object) {
    let res = null;
    try {
      this.endpoint = 'teacherevaluation/teachertoevaluatetemporary';
      res = await this.post(body);
    } catch (err) {
      res = this.errorHandler('getTeacherToEvaluateTemporarys', err);
    }
    return res;
  }

  

}
