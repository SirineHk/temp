import { Component, Inject, Optional, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AppAddEmployeeComponent } from './add/add.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { __param } from 'tslib';

export interface Employee {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  password: string;
  tel: string;
  role: string;
  login:string
}

const employees = [
  {
    id: 1,
    nom: '',
    prenom: 'Seo Expert',
    email: 'r@gmail.com',
    password: '',
    tel: '',
    role: '',
    login:'',
  },
 
];

@Component({
  templateUrl: './employee.component.html',
})
export class AppEmployeeComponent implements AfterViewInit ,OnInit{

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any;
  displayedColumns: string[] = [
    'id',
    'nom',
    'prenom',
    'email',
    'password',
    'tel',
    'role',
    'login',
    'action'
  ];
  dataSource = new MatTableDataSource<Employee>([]);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(private router: Router, private http: HttpClient,public dialog: MatDialog) { }
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Employee>([]);
    this.aff();
  }

  aff() {
    r:Number;
    this.http.get<Employee[]>("http://localhost:5555/api/v1/users/users")
      .subscribe(
        (resultData: Employee[]) => {
          resultData.forEach((item: any, index: number) => {
            item["role"]=item["role"].nom;
           
          })
          console.log(resultData);
          this.dataSource = new MatTableDataSource<Employee>(resultData);
          this.dataSource.paginator = this.paginator;
        },
        (error: any) => {
          console.error(error);
        }
      );
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppEmployeeDialogContentComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if (result.event === 'Add') {
        this.addRowData(result.data);
      } else if (result.event === 'Update') {
        this.updateRowData(result.data);
      }
    });
  }

  Act(row_obj:Employee){
    let idrole: number | undefined;
      const nomrole = row_obj.role;
      if (nomrole === "admin") {
          idrole = 1;
      } else if (nomrole === "superviseur") {
          idrole = 2;
      } else if (nomrole === "commercial") {
          idrole = 3;
      }
  
      if (idrole !== undefined) {
          const roleObj = {
              id: idrole,
              nom: nomrole
          };
          // Créez un nouvel objet pour stocker les données modifiées
          const rowDataToSend: any = {
              id: row_obj.id,
              nom: row_obj.nom,
              prenom: row_obj.prenom,
              email: row_obj.email,
              password: row_obj.password,
              tel: row_obj.tel,
              role: roleObj, // Utilisez l'objet de rôle modifié
              login: row_obj.login
          };
    this.http.post('http://localhost:5555/api/v1/users/active',rowDataToSend ,{ responseType: 'text' })
              .subscribe(
                  (resultData: any) => {
                      console.log(resultData);
                      alert(resultData);
                  },
                  (error) => {
                      console.error('Erreur lors de la modification de la fiche:', error);
                      alert('Une erreur est survenue. Veuillez réessayer plus tard.');
                  }
              );
            } else {
              console.error('Erreur lors de l\'attribution de la valeur à idrole: le rôle n\'est pas valide.');
              // Gérez le cas où idrole n'a pas de valeur
          }
  }

  // tslint:disable-next-line - Disables all
  addRowData(row_obj: Employee): void {
    let idrole: number | undefined;
    const nomrole = row_obj.role;
    if (nomrole === "admin") {
        idrole = 1;
    } else if (nomrole === "superviseur") {
        idrole = 2;
    } else if (nomrole === "commercial") {
        idrole = 3;
    }

    if (idrole !== undefined) {
        const roleObj = {
            id: idrole,
            nom: nomrole
        };
        // Créez un nouvel objet pour stocker les données modifiées
        const rowDataToSend: any = {
            //id: row_obj.id,
            nom: row_obj.nom,
            prenom: row_obj.prenom,
            email: row_obj.email,
            password: row_obj.password,
            tel: row_obj.tel,
            role: roleObj, // Utilisez l'objet de rôle modifié
            login: row_obj.login
        };
        console.log(rowDataToSend)

        this.http.post('http://localhost:5555/api/v1/users/compte', rowDataToSend, { responseType: 'text' })
            .subscribe(
                (resultData: any) => {
                    console.log(resultData);
                    alert('Fiche ajoutée avec succès.');
                    this.aff();
                },
                (error) => {
                    console.error('Erreur lors de l\'ajout de la fiche:', error);
                    alert('Une erreur est survenue. Veuillez réessayer plus tard.');
                }
            );
    } else {
        console.error('Erreur lors de l\'attribution de la valeur à idrole: le rôle n\'est pas valide.');
        // Gérez le cas où idrole n'a pas de valeur
    }
    //this.dialog.open(AppAddEmployeeComponent);
    //this.table.renderRows();
  }



  // tslint:disable-next-line - Disables all
  updateRowData(row_obj: Employee): void {
    this.dataSource.data = this.dataSource.data.filter((value: any) => {
      if (value.id === row_obj.id) {
        console.log(value.id);
        value.nom= row_obj.nom;
        value.prenom= row_obj.prenom;
        value.email=row_obj.email;
        value.password= row_obj.password;
        value.tel= row_obj.tel;
        value.role=row_obj.role;
        value.login= row_obj.login;
      }
      })
      let idrole: number | undefined;
      const nomrole = row_obj.role;
      if (nomrole === "admin") {
          idrole = 1;
      } else if (nomrole === "superviseur") {
          idrole = 2;
      } else if (nomrole === "commercial") {
          idrole = 3;
      }
  
      if (idrole !== undefined) {
          const roleObj = {
              id: idrole,
              nom: nomrole
          };
          // Créez un nouvel objet pour stocker les données modifiées
          const rowDataToSend: any = {
              id: row_obj.id,
              nom: row_obj.nom,
              prenom: row_obj.prenom,
              email: row_obj.email,
              password: row_obj.password,
              tel: row_obj.tel,
              role: roleObj, // Utilisez l'objet de rôle modifié
              login: row_obj.login
          };
          console.log(rowDataToSend)
  
          this.http.post('http://localhost:5555/api/v1/users/modif', rowDataToSend, { responseType: 'text' })
              .subscribe(
                  (resultData: any) => {
                      console.log(resultData);
                      alert('Fiche modifiée avec succès.');
                      this.aff();
                  },
                  (error) => {
                      console.error('Erreur lors de la modification de la fiche:', error);
                      alert('Une erreur est survenue. Veuillez réessayer plus tard.');
                  }
              );
      } else {
          console.error('Erreur lors de l\'attribution de la valeur à idrole: le rôle n\'est pas valide.');
          // Gérez le cas où idrole n'a pas de valeur
      };
  }

  // tslint:disable-next-line - Disables all
   deleteRowData(row_obj: Employee): boolean | any {
    this.dataSource.data = this.dataSource.data.filter((value: any) => {
      return value.id !== row_obj.id;
    });
  }
} 

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  templateUrl: 'employee-dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class AppEmployeeDialogContentComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  selectedImage: any = '';
  joiningDate: any = '';

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppEmployeeDialogContentComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Employee,
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
