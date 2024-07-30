import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from 'app/core/services/local-storage.service';
import { CheckList } from 'app/shared/models/checklist';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';



interface ChecklistItem {
  content: string;
  checkListItemOptions: { content: string, isPositive: boolean }[];
}

interface ChecklistData {
  name: string;
  description: string;
  language: string;
  createdDate: string;
  checkListItems: ChecklistItem[];
}

@Injectable({
  providedIn: 'root'
})
export class GeneratorChecklistService {

  apiUrl = environment.apiUrl; 
  http = inject(HttpClient);
 storage = inject(LocalStorageService);

saveChecklist(checklist: CheckList): Observable<any>{
  return this.http.post(this.apiUrl, checklist)
}


private answersSubject = new BehaviorSubject<any[]>([]);
answers$ = this.answersSubject.asObservable();

addAnswer(answer: any) {
  const currentAnswers = this.answersSubject.value;
  this.answersSubject.next([...currentAnswers, answer]);
}

// checklist editor 
private checklistData = new BehaviorSubject<ChecklistData | null>(null);
checklistData$ = this.checklistData.asObservable();

private selectedOptions = new BehaviorSubject<{ [key: string]: string }>({});
  selectedOptions$ = this.selectedOptions.asObservable();

setChecklistData(data: ChecklistData) {
  this.checklistData.next(data);
}

getChecklistData(): ChecklistData | null {
  return this.checklistData.value;
}

setSelectedOption(questionContent: string, selectedOption: string) {
  const currentSelectedOptions = this.selectedOptions.value;
  currentSelectedOptions[questionContent] = selectedOption;
  this.selectedOptions.next(currentSelectedOptions);
}

getSelectedOptions() {
  return this.selectedOptions.value;
}

getSavedCheckListById(id: string): Observable<CheckList>{
  const options = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + this.storage.getToken(),
      'Accept': 'application/json'
    })
  }; return this.http.get<CheckList>(`${this.apiUrl}/CheckList/${id}`, options)
};


}
/* 
sendSelectedOptions(selectedOptions: { [key: string]: string }) {
  return this.http.post(this.apiUrl, selectedOptions);
} */

/* 
getById(id: number) {
  const checklist = this.checklistData.find((item: { id: number; }) => item.id === id);
  return of(checklist); } */



