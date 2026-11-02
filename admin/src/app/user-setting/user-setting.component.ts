import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserStateService } from '../services/user-state.service';

@Component({
  selector: 'app-user-setting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <span class="page-tag">User Management</span>
          <h1 class="page-title">User Settings</h1>
          <p class="page-desc">Manage system administrator profiles, security credentials, and access permissions across all micro-frontends.</p>
        </div>
        <button class="save-btn" (click)="save()">
          {{ saved() ? '✓ Changes Saved to Monorepo!' : 'Save Settings' }}
        </button>
      </div>

      <div class="cards-grid">
        <!-- Account Info -->
        <div class="card">
          <div class="card-header">
            <div class="icon-box">👤</div>
            <div>
              <h2 class="card-title">Profile Information</h2>
              <p class="card-desc">Personal administrator contact and role details (Synchronized Globally)</p>
            </div>
          </div>

          <div class="card-body">
            <div class="profile-row">
              <div class="avatar">{{ userState.user().avatarText }}</div>
              <div class="avatar-info">
                <span class="avatar-name">{{ userState.user().name }}</span>
                <span class="sub-text">Synchronized via Monorepo Global Store (Port 4202)</span>
              </div>
            </div>

            <div class="input-grid">
              <div class="form-group">
                <label>Admin Name</label>
                <input type="text" [(ngModel)]="name" class="input" placeholder="Admin Name" />
              </div>

              <div class="form-group">
                <label>Official Email</label>
                <input type="email" [(ngModel)]="email" class="input" placeholder="Official Email" />
              </div>
            </div>

            <div class="form-group">
              <label>Role Assignment</label>
              <select [(ngModel)]="role" class="input">
                <option value="Super Administrator">Super Administrator (Full Privileges)</option>
                <option value="Store Manager">Store Operations Manager</option>
                <option value="Auditor">Security & Audit Reviewer</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Security & Access -->
        <div class="card">
          <div class="card-header">
            <div class="icon-box">🛡️</div>
            <div>
              <h2 class="card-title">Security & Authentications</h2>
              <p class="card-desc">Two-factor auth and account session controls</p>
            </div>
          </div>

          <div class="card-body">
            <div class="switch-row">
              <div>
                <div class="switch-title">Two-Factor Authentication (2FA)</div>
                <div class="switch-desc">Require OTP authenticator code upon signing in</div>
              </div>
              <label class="switch">
                <input type="checkbox" [(ngModel)]="twoFactor" />
                <span class="slider"></span>
              </label>
            </div>

            <div class="switch-row">
              <div>
                <div class="switch-title">Auto Inactivity Logout</div>
                <div class="switch-desc">Automatically terminate active sessions after 30 minutes</div>
              </div>
              <label class="switch">
                <input type="checkbox" [(ngModel)]="autoLogout" />
                <span class="slider"></span>
              </label>
            </div>

            <div class="switch-row">
              <div>
                <div class="switch-title">Security Alert Webhooks</div>
                <div class="switch-desc">Notify security channels on suspicious login attempts</div>
              </div>
              <label class="switch">
                <input type="checkbox" [(ngModel)]="securityAlerts" />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      display: flex;
      flex-direction: column;
      gap: 28px;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border-subtle);
      flex-wrap: wrap;
      gap: 16px;
    }
    .page-tag {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 700;
      color: var(--accent-primary);
      margin-bottom: 6px;
      display: block;
    }
    .page-title {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -1px;
      color: #fff;
      margin-bottom: 6px;
    }
    .page-desc {
      font-size: 15px;
      color: var(--text-secondary);
      max-width: 650px;
    }
    .save-btn {
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: #fff;
      border: none;
      padding: 12px 26px;
      border-radius: var(--radius-sm);
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 4px 18px rgba(99, 102, 241, 0.35);
      transition: all 0.2s;
    }
    .save-btn:hover {
      box-shadow: 0 6px 24px rgba(99, 102, 241, 0.5);
      transform: translateY(-2px);
    }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: 24px;
    }
    .card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 26px;
      backdrop-filter: blur(16px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      padding-bottom: 18px;
      border-bottom: 1px solid var(--border-subtle);
    }
    .icon-box {
      font-size: 24px;
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid rgba(99, 102, 241, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card-title {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
    }
    .card-desc {
      font-size: 12.5px;
      color: var(--text-muted);
      margin-top: 2px;
    }
    .card-body {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .profile-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding-bottom: 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }
    .avatar {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #06b6d4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 800;
      color: #fff;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
    }
    .avatar-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .action-btn-sm {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid var(--border-subtle);
      color: #fff;
      padding: 6px 14px;
      border-radius: var(--radius-sm);
      font-size: 12.5px;
      cursor: pointer;
      width: fit-content;
      transition: all 0.2s;
    }
    .action-btn-sm:hover {
      background: rgba(255, 255, 255, 0.12);
    }
    .sub-text {
      font-size: 11px;
      color: var(--text-muted);
    }
    .input-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-group label {
      font-size: 12.5px;
      font-weight: 600;
      color: var(--text-secondary);
    }
    .input {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      color: #fff;
      padding: 10px 14px;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
    }
    .input:focus {
      border-color: #6366f1;
    }
    .input option {
      background: #101626;
      color: #fff;
    }
    .switch-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }
    .switch-row:last-child {
      border-bottom: none;
    }
    .switch-title {
      font-size: 14px;
      font-weight: 600;
      color: #fff;
    }
    .switch-desc {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 2px;
    }
    .switch {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
    }
    .switch input {
      display: none;
    }
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 30px;
      transition: 0.25s;
      border: 1px solid var(--border-subtle);
    }
    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 2px;
      bottom: 2px;
      background: #fff;
      border-radius: 50%;
      transition: 0.25s;
    }
    input:checked + .slider {
      background: #6366f1;
      border-color: #818cf8;
    }
    input:checked + .slider:before {
      transform: translateX(20px);
    }
  `]
})
export class UserSettingComponent {
  readonly userState = inject(UserStateService);

  name = '';
  email = '';
  role = 'Super Administrator';
  twoFactor = true;
  autoLogout = true;
  securityAlerts = true;

  saved = signal(false);

  constructor() {
    // Keep local form in sync whenever global user state updates
    effect(() => {
      const u = this.userState.user();
      this.name = u.name;
      this.email = u.email;
      this.role = u.role;
    });
  }

  save() {
    this.userState.updateUser({
      name: this.name.trim(),
      email: this.email.trim(),
      role: this.role
    });
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2500);
  }
}
