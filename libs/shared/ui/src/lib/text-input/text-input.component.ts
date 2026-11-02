import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'shophub-text-input',
  standalone: true,
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="shophub-input-wrapper" [class.has-label]="label">
      @if (label) {
        <label class="shophub-input-label">{{ label }}</label>
      }
      <div 
        class="shophub-input-box" 
        [class.focused]="isFocused"
        [class.has-value]="!!innerValue"
        [class.disabled]="disabled"
      >
        @if (icon) {
          <span class="shophub-input-icon">{{ icon }}</span>
        }

        <input
          [type]="type"
          class="shophub-native-input"
          [placeholder]="placeholder"
          [value]="innerValue"
          [disabled]="disabled"
          (input)="onInput($event)"
          (focus)="isFocused = true"
          (blur)="onBlur()"
        />

        @if (clearable && innerValue && !disabled) {
          <button 
            type="button" 
            class="shophub-clear-btn" 
            (click)="clear()" 
            title="Clear"
            tabindex="-1"
          >
            ✕
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .shophub-input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
    }

    .shophub-input-label {
      font-size: 12.5px;
      font-weight: 600;
      color: #94a3b8;
      letter-spacing: 0.2px;
    }

    .shophub-input-box {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 0 14px;
      height: 44px;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      backdrop-filter: blur(8px);
      box-sizing: border-box;
      width: 100%;
    }

    .shophub-input-box:hover:not(.disabled) {
      border-color: rgba(99, 102, 241, 0.4);
      background: rgba(255, 255, 255, 0.06);
    }

    .shophub-input-box.focused {
      border-color: #6366f1;
      background: rgba(99, 102, 241, 0.08);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2), 0 4px 16px rgba(99, 102, 241, 0.15);
    }

    .shophub-input-box.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .shophub-input-icon {
      font-size: 16px;
      line-height: 1;
      opacity: 0.8;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .shophub-native-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: #ffffff;
      font-size: 14px;
      font-family: inherit;
      width: 100%;
      height: 100%;
    }

    .shophub-native-input::placeholder {
      color: #64748b;
      font-size: 13.5px;
    }

    .shophub-clear-btn {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: #94a3b8;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .shophub-clear-btn:hover {
      background: rgba(239, 68, 68, 0.8);
      color: #fff;
    }
  `]
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder: string = '';
  @Input() icon?: string;
  @Input() type: string = 'text';
  @Input() clearable: boolean = false;
  @Input() disabled: boolean = false;

  @Input() set value(val: any) {
    this.innerValue = val ?? '';
  }
  get value(): any {
    return this.innerValue;
  }

  @Output() valueChange = new EventEmitter<any>();

  innerValue: any = '';
  isFocused: boolean = false;

  private onChange: (val: any) => void = () => { };
  private onTouched: () => void = () => { };

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const val = this.type === 'number' && input.value !== '' ? Number(input.value) : input.value;
    this.innerValue = val;
    this.onChange(val);
    this.valueChange.emit(val);
  }

  clear() {
    this.innerValue = '';
    this.onChange('');
    this.valueChange.emit('');
  }

  onBlur() {
    this.isFocused = false;
    this.onTouched();
  }

  // ControlValueAccessor methods
  writeValue(val: any): void {
    this.innerValue = val ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
