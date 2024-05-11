import { Component, OnInit, ViewChild } from '@angular/core';
import { produitService } from './produit.service';
import { produit } from './produit';
import { MatDialog } from '@angular/material/dialog';
import { AppDialogOverviewComponent } from '../../ui-components/dialog/dialog.component';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.scss'],
})
export class AppproduitsComponent implements OnInit{
  //produitList: produit[] = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selectedCategory = 'All';

  constructor(public dialog: MatDialog,private produitService: produitService,private http: HttpClient) {
  }
  produitList: MatTableDataSource<produit>

  
  ngOnInit(): void {
    this.produitList = new MatTableDataSource<produit>(this.produitService.getproduit());
    this.produitList.paginator = this.paginator;
    this.produitList.sort = this.sort;
    this.affProd();
  }
  affProd() {
    this.http.get("http://localhost:5555/api/v1/prods/neo")
      .subscribe(
        (resultData: any) => {
          console.log(resultData);
          resultData.forEach((item: any) => {
            console.log(item.soc);
            if(item.soc==='Zenioo'){
              item.courseType='primary';
            }else if(item.soc==='Néoliane'){
              item.courseType='error';
            }
            
          });
          this.produitList.data = resultData;
          this.produitList.paginator = this.paginator;
          this.produitList.sort = this.sort;
        },
        (error: any) => {
          console.error(error);
        }
      );
  }

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(AppDialogOverviewComponent, {
      width: '900px',
      height:'400px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
  
  
 applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.produitList.filter = filterValue.trim().toLowerCase();
  }

  filter(v: string): produit[] {
    return this.produitService
      .getproduit()
      .filter((x) => x['produitFramework'].toLowerCase().indexOf(v.toLowerCase()) !== -1);
  }

  trackByFn(index: number, item: produit): any {
    return item.Id; // Remplacez 'Id' par la clé unique de votre objet produit
  }

   /*ddlChange(ob: any): void {
    const filterValue = ob.value;
    if (filterValue === 'All') {
      this.produitList = this.produitService.getproduit();
    } else {
      this.produitList = this.produitService
        .getproduit()
        // tslint:disable-next-line: no-shadowed-variable
        .filter((produit) => produit.produitFramework === filterValue);
    }
    // this.todos.filter(produit => produit.produitType==filterValue);
  }*/
}
