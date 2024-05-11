import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { FormBuilder} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService, private router: Router, private http: HttpClient) { }

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.getRawValue();
      this.http.post('http://localhost:5555/api/v1/users/auth', formData, { responseType: 'text' }).subscribe(
        (resultData: any) => {
          if (resultData=="Je suis un admin"){
            this.router.navigate(['/dashboards/dashboard1']);
          }
          else if (resultData=="Je suis un commercial"){
            this.router.navigate(['/dashboards/dashboard1']);
          }
          else if (resultData=="Je suis un superviseur"){
            this.router.navigate(['/dashboards/dashboard1']);
          }
          alert(resultData);
        },
        (        error: any) => {
          console.error('Error:', error);
          alert("An error occurred. Please try again later.");
        }
      );
    } else {
      alert("Invalid form");
    }
  }
  
  
}
