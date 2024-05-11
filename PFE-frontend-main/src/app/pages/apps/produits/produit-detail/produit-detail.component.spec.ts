import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppproduitDetailComponent } from './produit-detail.component';

describe('AppproduitDetailComponent', () => {
  let component: AppproduitDetailComponent;
  let fixture: ComponentFixture<AppproduitDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppproduitDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppproduitDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
