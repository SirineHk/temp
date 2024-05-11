import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Data, Router } from '@angular/router';
import { DataSource } from './banners';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ServicebannerService } from './servicebanners.service';
import { N } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html'
})
export class AppBannersComponent implements OnInit {
[x: string]: any;
  verticalPosition1: MatSnackBarVerticalPosition = 'bottom';
  verticalPosition2: MatSnackBarVerticalPosition = 'bottom';
  verticalPosition3: MatSnackBarVerticalPosition = 'bottom';
  verticalPosition4: MatSnackBarVerticalPosition = 'bottom';
  verticalPosition5: MatSnackBarVerticalPosition = 'bottom';
  disabled = false;
  max = 500;
  min = 0;
  value = 0;
  offres: any[] = [];
  allComplete: boolean = false;
  dataSource: MatTableDataSource<DataSource>;
  displayedColumns = [
    'select',
    'société',
    'prod',
    'prix',
  ];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router, private invoiceService: ServicebannerService, private http: HttpClient) {
  }

  ngOnInit(): void {
    const bannersListData = this.invoiceService.getBannersList();
    this.dataSource = new MatTableDataSource(bannersListData);
    this.getOffres();
  }

  selection = new SelectionModel<DataSource>(true, []);
  selectedRows: DataSource[] = [];


  isAllSelected(): any {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  selectedCount = 0;

  toggleSelection(row: DataSource): void {
    const maxSelection = 3; // Maximum number of rows that can be selected
  
    if (this.selection.isSelected(row)) {
      // Deselect the row if it's already selected
      this.selection.deselect(row);
      this.selectedCount--;
      this.selectedRows = this.selectedRows.filter(r => r !== row);
    } else if (this.selectedCount < maxSelection) {
      // Select the row if the limit has not been reached
      this.selection.select(row);
      this.selectedCount++;
      this.selectedRows.push(row);
    }
  
    // Disable the button if more than 3 rows are selected
    if (this.selectedCount > maxSelection) {
      this.selectedCount = maxSelection;
      this.selection.clear(); // Clear any extra selections
    }
  }
  
  compareRows(): void {
    this.router.navigate(['/tables/sticky-column-table']);
    // Perform comparison logic with this.selectedRows
    console.log('Selected rows:', this['selectedRows']);
  }
  
 

  getOffres()
  {
    this.http.get("http://localhost:5555/api/v1/prods/tar")
      .subscribe(
        (resultData: any) => {
          resultData.forEach((item: any, index: number) => {
            if(item["societe"]=="Néoliane"){
              item.im="C:/Users/Sirine/Downloads/PFE-frontend-main/PFE-frontend-main/src/app/pages/widgets/banners/neoliane_logo.jpg";
            }
          });
          this.dataSource = new MatTableDataSource<DataSource>(resultData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        (error: any) => {
          console.error(error);
        }
      );
  }
}