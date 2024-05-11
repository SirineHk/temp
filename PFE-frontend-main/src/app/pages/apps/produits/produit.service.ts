import { Injectable } from '@angular/core';
import { produit } from './produit';
import { produitList } from './produit-data';

@Injectable({
  providedIn: 'root'
})
export class produitService {
  public produit = produitList;
  public getproduit(): produit[] {
    return this.produit;
  }
}
