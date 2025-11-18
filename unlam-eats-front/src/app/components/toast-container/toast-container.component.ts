import { Component, computed, inject } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [NgFor, NgClass],
  template: `
    <div class="pointer-events-none fixed inset-x-0 top-16 z-50 flex justify-center px-4 sm:top-20">
      <div class="w-full max-w-md space-y-2">
        <div
          *ngFor="let t of toasts()"
          class="pointer-events-auto flex items-start gap-3 rounded-2xl border px-3 py-2 shadow-lg text-sm bg-white/95 backdrop-blur
                 animate-[toast-in_0.25s_ease-out]"
          [ngClass]="{
            'border-unlam-green-400 bg-unlam-green-50': t.type === 'success',
            'border-sky-400 bg-sky-50': t.type === 'info',
            'border-red-400 bg-red-50': t.type === 'error'
          }"
        >
          <div class="mt-0.5 text-lg" [ngClass]="{
            'text-unlam-green-700': t.type === 'success',
            'text-sky-600': t.type === 'info',
            'text-red-600': t.type === 'error'
          }">
            <span *ngIf="t.type === 'success'">✔</span>
            <span *ngIf="t.type === 'info'">ℹ</span>
            <span *ngIf="t.type === 'error'">!</span>
          </div>
          <div class="flex-1 text-gray-800 leading-snug">
            {{ t.message }}
          </div>
          <button
            type="button"
            class="ml-2 mt-0.5 text-xs text-gray-400 hover:text-gray-700 transition-colors"
            (click)="dismiss(t.id)"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <style>
      @keyframes toast-in {
        from {
          opacity: 0;
          transform: translateY(-4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    </style>
  `,
})
export class ToastContainerComponent {
  private readonly toastService = inject(ToastService);
  readonly toasts = computed(() => this.toastService.toasts());

  dismiss(id: number) {
    this.toastService.dismiss(id);
  }
}
