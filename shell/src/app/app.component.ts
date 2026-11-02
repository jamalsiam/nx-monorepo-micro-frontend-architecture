import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserStateService } from './services/user-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'shell';
  readonly userState = inject(UserStateService);

  isEditingUser = false;
  editName = '';

  startEdit() {
    this.editName = this.userState.user().name;
    this.isEditingUser = true;
  }

  saveEdit() {
    if (this.editName.trim()) {
      this.userState.updateUser({ name: this.editName.trim() });
    }
    this.isEditingUser = false;
  }

  cancelEdit() {
    this.isEditingUser = false;
  }
}
