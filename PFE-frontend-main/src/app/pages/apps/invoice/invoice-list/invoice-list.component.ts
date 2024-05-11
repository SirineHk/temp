import { Component, AfterViewInit, ViewChild, OnInit, Optional, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceinvoiceService } from '../serviceinvoice.service';
import { InvoiceList } from '../invoice';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Invoice } from './invoice';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html'
})
export class AppInvoiceListComponent implements AfterViewInit, OnInit {
  allComplete: boolean = false;
  invoiceList: MatTableDataSource<InvoiceList>;
  displayedColumns: string[] = ['chk', 'id', 'nom', 'prenom','DN', 'regime', 'adresse', 'email', 'codeP', 'tel', 'DE',"action"];

  dataSource = new MatTableDataSource<Invoice>([]);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router,public dialog: MatDialog, private invoiceService: ServiceinvoiceService, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Invoice>([]);
    const invoiceListData = this.invoiceService.getInvoiceList();
    this.invoiceList = new MatTableDataSource(invoiceListData);
    this.getFiches();
  }

  ngAfterViewInit(): void {
    this.invoiceList.paginator = this.paginator;
    this.invoiceList.sort = this.sort;
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppInvoiceDialogContentComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result:any) => {
       if (result.event === 'Update') {
        this.updateRowData(result.data);
      }
    });
  }

  updateRowData(row_obj: Invoice): void {
    this.dataSource.data = this.dataSource.data.filter((value: any) => {
      if (value.id === row_obj.id) {
        console.log(value.id);
        value.nom= row_obj.nom;
        value.prenom= row_obj.prenom;
        value.DN= row_obj.DN;
        value.regime= row_obj.regime;
        value.adresse=row_obj.adresse;
        value.email=row_obj.email;
        value.codeP=row_obj.codeP;
        value.tel= row_obj.tel;
        value.DE= row_obj.DE;
      }
      })
      const rowDataToSend: any = {
        id: row_obj.id,
        nom: row_obj.nom,
        prenom: row_obj.prenom,
        DN: row_obj.DN,
        regime:row_obj.regime,
        adresse:row_obj.adresse,
        email:row_obj.email,
        codeP:row_obj.codeP,
        tel:row_obj.tel,
        DE:row_obj.DE,
        };
        console.log(rowDataToSend)



        this.http.post('http://localhost:5555/api/v1/fiches/upd', rowDataToSend, { responseType: 'text' })
              .subscribe(
                  (resultData: any) => {
                      console.log(resultData);
                      alert('Fiche modifiée avec succès.');
                      this.getFiches();
                  },
                  (error) => {
                      console.error('Erreur lors de la modification de la fiche:', error);
                      alert('Une erreur est survenue. Veuillez réessayer plus tard.');
                  }
                );
    }
  viewInvoice(id: number): void {
    // Implémentez votre logique pour afficher les détails de la facture en fonction de l'ID
  }
  

  navigate(id:number) {
    console.log(id)                                                                                                     
    this.router.navigate(['/widgets/banners']);
  }

  /*updateAllComplete(): void {
    this.allComplete = this.invoiceList != null && this.invoiceList.data.every((t) => t.completed);
  }

  someComplete(): any {
    return this.invoiceList.data.filter((t) => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean): void {
    this.allComplete = completed;
    this.invoiceList.data.forEach((t) => (t.completed = completed));
  }*/

  filter(filterValue: string): void {
    this.invoiceList.filter = filterValue.trim().toLowerCase();
  }

  deleteInvoice(row: number): void {
    if (confirm('Are you sure you want to delete this record ?')) {
      this.invoiceService.deleteInvoice(row);
      this.invoiceList.data = this.invoiceList.data.filter((invoice) => invoice.id !== row);
    }
  }

  getFiches() {
    this.http.get("http://localhost:5555/api/v1/fiches/aff")
      .subscribe(
        (resultData: any) => {
          console.log(resultData);
          this.invoiceList = new MatTableDataSource<InvoiceList>(resultData);
          this.invoiceList.paginator = this.paginator;
          this.invoiceList.sort = this.sort;
        },
        (error: any) => {
          console.error(error);
        }
      );
  }
}


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  templateUrl: 'invoice-dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class AppInvoiceDialogContentComponent {
  action: string;
  effectDatePicker: any; 
  // tslint:disable-next-line - Disables all
  local_data: any;
  selectedImage: any = '';
  joiningDate: any = '';

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppInvoiceDialogContentComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Invoice,
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    if (this.local_data.DateOfJoining !== undefined) {
      this.joiningDate = this.datePipe.transform(
        new Date(this.local_data.DateOfJoining),
        'yyyy-MM-dd',
      );
    }
    if (this.local_data.imagePath === undefined) {
      this.local_data.imagePath = 'assets/images/profile/user-1.jpg';
    }
  }

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }
  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  selectFile(event: any): void {
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      // this.msg = 'You must select an image';
      return;
    }
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      // this.msg = "Only images are supported";
      return;
    }
    // tslint:disable-next-line - Disables all
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    // tslint:disable-next-line - Disables all
    reader.onload = (_event) => {
      // tslint:disable-next-line - Disables all
      this.local_data.imagePath = reader.result;
    };
  }
}

