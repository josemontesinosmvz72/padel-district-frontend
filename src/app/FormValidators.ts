import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class FormValidators {
  static required(control: AbstractControl): ValidationErrors | null {
    const v = control.value;

    if (v === null || v === undefined) return { required: true };

    if (typeof v === 'string') {
      return v.trim().length > 0 ? null : { required: true };
    }

    return null;
  }

  static minLength(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = control.value;
      if (v === null || v === undefined) return null;
      if (typeof v !== 'string') return null;
      return v.trim().length >= min ? null : { minLength: { requiredLength: min, actualLength: v.trim().length } };
    };
  }

  static minNumber(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = control.value;
      if (v === null || v === undefined || v === '') return null;
      const n = typeof v === 'number' ? v : Number(v);
      if (Number.isNaN(n)) return { minNumber: { min, actual: v } };
      return n >= min ? null : { minNumber: { min, actual: n } };
    };
  }

  static requiredDate(control: AbstractControl): ValidationErrors | null {
    const v = control.value;
    if (v === null || v === undefined || v === '') return { requiredDate: true };

    const d = v instanceof Date ? v : new Date(v);
    return Number.isNaN(d.getTime()) ? { requiredDate: true } : null;
  }

  static notOnlyWhiteSpace(control: AbstractControl): ValidationErrors | null {
    if (control.value == null || typeof control.value !== 'string') {
      return null;
    }
    if (control.value.trim().length === 0) {
      return { notOnlyWhiteSpace: true };
    }
    return null;
  }

  static forbiddenWord(word: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null || typeof control.value !== 'string') {
        return null;
      }
      if (control.value.toLowerCase().includes(word.toLowerCase())) {
        return { forbiddenWord: true };
      }
      return null;
    };
  }
}
