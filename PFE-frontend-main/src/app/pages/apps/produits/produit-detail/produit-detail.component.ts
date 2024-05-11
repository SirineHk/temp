import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { produit } from '../produit';
import { produitService } from '../produit.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-produit-detail',
  templateUrl: './produit-detail.component.html',
  styleUrls: ['./produit-detail.component.scss'],
})
export class AppproduitDetailComponent {
  id: any;
  produitDetail: produit;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  constructor(private _formBuilder: FormBuilder,activatedRouter: ActivatedRoute, produitService: produitService) {
    this.id = activatedRouter?.snapshot?.paramMap?.get('id');
    this.produitDetail = produitService.getproduit().filter((x) => x?.Id === +this.id)[0];
  }
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
}
