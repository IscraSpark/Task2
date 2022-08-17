import { AbstractControl, ValidationErrors } from '@angular/forms';

export function validateCheckBox(
  multipleArray: AbstractControl): ValidationErrors | null {

  const minLen = 1;
  let valid = false;
  let count = 0;

  if (!multipleArray.value.length) {
    return null;
  }

  for (let control of multipleArray.value) {
    if (control?.inp == true) {
      count++;
    }
  }

  if (count >= minLen) {
    valid = true;
  }

  return valid ? null: {multipleCheckboxRequireOne: true};
}

export function validateRadioButton(
  singleArray: AbstractControl
): ValidationErrors | null {
  const minLen = 1;
  let valid = false;
  let count = 0;

  if (!singleArray.value.length) {
    return null;
  }

  for (let control of singleArray.value) {
    if (control?.radio == true) {
      count++;
    }
  }

  if (count >= minLen) {
    valid = true;
  }

  return valid ? null: {multipleCheckboxRequireOne: true};
}
