import { Injectable } from '@angular/core';
import { CrudService } from '../http/crud.service';
import { StorageService } from '../storage/storage.service';
import { StorageKey } from '../storage/storage.model';
import { HttpClient } from '@angular/common/http';
import { EvaluationQuestion } from '../../models/evaluationQuestion';

const {AUTH_TOKEN} = StorageKey;

@Injectable({
  providedIn: 'root'
})
export class ConsolidatedService extends CrudService {
  endpoint = 'teacherevaluation';
  token: string;
  
  constructor(http: HttpClient, private storage: StorageService) {
    super(http);
    this.token = storage.read(AUTH_TOKEN) || '';
  }
  
  public async getQuestions(evaluationId: string) {
    let res = null;
    try {
      this.endpoint = 'teacherevaluation/questionspermanents';
      res = await this.get<EvaluationQuestion>(evaluationId);
    } catch (err) {
      res = this.errorHandler('getQuestions', err);
    }
    return res;
  }

  public async getHeteroResults(body: object) {
    let res = null;
    try {
      this.endpoint = 'teacherevaluation/heteroresults';
      res = await this.post(body);
    } catch (err) {
      res = this.errorHandler('getHeteroResults', err);
    }
    return res;
  }

}
