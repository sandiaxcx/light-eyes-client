import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, effect, inject, Input, OnInit, signal,} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { BasicCheckList } from 'app/shared/models/checklist';
import { ChecklistService } from 'app/checklist/services/checklist.service';

@Component({
  selector: 'app-report-basic-data',
  standalone: true,
  imports: [ MatButtonModule, MatStepperModule, FormsModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatRadioModule, MatSelectModule, JsonPipe, AsyncPipe, MatSlideToggleModule, MatAutocompleteModule,
  ],
  templateUrl: './report-basic-data.component.html',
  styleUrls: ['./report-basic-data.component.scss'],
})
export class ReportBasicDataComponent implements OnInit {
  private checkListService = inject(ChecklistService);
  filteredChecklists = signal<BasicCheckList[]>([]);
  fb = inject(FormBuilder);
  @Input() reportForm!: FormGroup;
  basicDataFormGroup!: FormGroup;

  // Form from report-stepper

  constructor() {
    effect(() => {
      console.log('Signal changed');
      console.log(this.filteredChecklists());
    });
  }

  ngOnInit(): void {
    this.checkListService.getAllChecklist().subscribe((data) => {
      this.filteredChecklists.set(data);
    });
    // Init reportForm with new basicData
    this.basicDataFormGroup = this.fb.group({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      language: new FormControl('', Validators.required),
      checkList: new FormControl('', Validators.required),
    });

    this.reportForm?.addControl('basicData', this.basicDataFormGroup);
    console.log(this.reportForm);
    
  }

  get checkListControl(): FormGroup {
    return this.basicDataFormGroup.get('checkList') as FormGroup;
  }

  checklistSearch() {
    let inputChecklistValue: string =
      this.basicDataFormGroup.get('checkList')?.value;

    console.log(inputChecklistValue);

    this.checkListService
      .getAllCheckListFiltered(inputChecklistValue)
      .subscribe((data) => {
        this.filteredChecklists.set(data);
      });
  }

  

  languages = [
    { value: 'catala-0', viewValue: 'Català' },
    { value: 'castellano-1', viewValue: 'Castellano' },
  ];

  consoleData() {
    console.log(this.reportForm);
    console.log(this.filteredChecklists());
  }
}
