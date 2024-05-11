import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { DataSource } from './banners';
import { dataSource } from './banners-data';

@Injectable({
  providedIn: 'root',
})
export class ServicebannerService {
  private dataSource: DataSource[] = [];

  private getBanners(): any {
    return from(dataSource);
  }

  constructor() {
    this.getBanners().subscribe((data: any) => this.dataSource.push(data));
  }

  public getBannersList(): DataSource[] {
    return this.dataSource;
  }

}
