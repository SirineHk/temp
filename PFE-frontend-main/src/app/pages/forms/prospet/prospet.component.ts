import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import {  FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
  
} from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-prospet',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, TablerIconsModule],
  templateUrl: './prospet.component.html',
})
export class AppProspetComponent {
  form: FormGroup;
  secondFormGroup:FormGroup;
  finalForm:FormGroup;

  constructor(private http: HttpClient, private router: Router) {
    this.form = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      DN: new FormControl('', [Validators.required]),
      regime: new FormControl('', [Validators.required]),
    });
    this.secondFormGroup=new FormGroup({
      adresse: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      codeP: new FormControl('', [Validators.required]),
      tel: new FormControl('', [Validators.required]),
    });
    this.finalForm = new FormGroup({
      DE: new FormControl('', [Validators.required]), // Ajoutez ici les autres contrôles de formulaire
    });
  }

  EnregFich() {
    if (this.form.valid) {
      const formData = this.form.getRawValue();
      console.log(formData.DN);
      formData.DN = this.formatDate(formData.DN);
      console.log(formData);
      if (this.secondFormGroup.valid) {
        const secondFormData = this.secondFormGroup.getRawValue();
        console.log(secondFormData);
        if (this.finalForm.valid) {
          const finalFormData = this.finalForm.getRawValue();
          console.log(finalFormData.DE);
          finalFormData.DE = this.formatDate(finalFormData.DE);
          console.log(finalFormData)
        const concatenatedFormData = {
          ...formData,
          ...secondFormData,
          ...finalFormData
        };
        console.log(concatenatedFormData)
      this.http.post('http://localhost:5555/api/v1/fiches/create', concatenatedFormData, { responseType: 'text' })
        .subscribe(
          (resultData: any) => {
            alert('Fiche ajoutée avec succès.');
            this.navigateTo();

          },
          (error) => {
            console.error('Erreur lors de l\'ajout de la fiche:', error);
            alert('Une erreur est survenue. Veuillez réessayer plus tard.');
          }
        );
      }else{
        alert('Formulaire  3 invalide. Veuillez remplir tous les champs.');
      }
      }else{
        alert('Formulaire  2 invalide. Veuillez remplir tous les champs.');
      }
    } else {
      alert('Formulaire invalide. Veuillez remplir tous les champs.');
    }
  }

  formatDate(date: Date): string {
    // Récupérer les parties de la date (jour, mois, année)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Formater la date au format ISO (YYYY-MM-DD)
    return `${year}-${month}-${day}`;
  }
 
  
  
  
  
  

  // 3 accordian
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  panelOpenState = false;
  navigateTo(){
    this.router.navigate(['/apps/invoice/']);
  }
}
