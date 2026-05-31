import { Component, inject } from '@angular/core';
import { ToastService } from '../../../services/toast-service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-toast',
  standalone: true,
  templateUrl: './toast-component.html',
  imports: [CommonModule, RouterLink],
})

export class ToastComponent {
  protected readonly toast = inject(ToastService);
}
