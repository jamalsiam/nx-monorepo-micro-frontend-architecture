import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextInputComponent } from '@shophub/shared-ui';

@Component({
  selector: 'app-item-setting',
  standalone: true,
  imports: [CommonModule, FormsModule, TextInputComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <span class="page-tag">Catalog & Inventory</span>
          <h1 class="page-title">Item Settings</h1>
          <p class="page-desc">Define inventory stock thresholds, default store currencies, tax percentages, and backorders.</p>
        </div>
        <button class="save-btn" (click)="save()">
          {{ saved() ? '✓ Changes Saved!' : 'Save Settings' }}
        </button>
      </div>

      <div class="cards-grid">
        <!-- Stock & Availability -->
        <div class="card">
          <div class="card-header">
            <div class="icon-box">📦</div>
            <div>
              <h2 class="card-title">Stock & Availability Controls</h2>
              <p class="card-desc">Automated rules for item inventory management</p>
            </div>
          </div>

          <div class="card-body">
            <div class="input-grid">
              <shophub-text-input
                label="Low Stock Warning Limit"
                type="number"
                icon="⚠️"
                placeholder="5"
                [(value)]="lowStockLimit"
              ></shophub-text-input>

              <div class="form-group">
                <label>Primary Currency</label>
                <select [(ngModel)]="currency" class="input">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="SAR">SAR (ر.س)</option>
                </select>
              </div>
            </div>

            <div class="switch-row">
              <div>
                <div class="switch-title">Auto-Hide Out-of-Stock Products</div>
                <div class="switch-desc">Instantly remove items with 0 inventory from search results</div>
              </div>
              <label class="switch">
                <input type="checkbox" [(ngModel)]="autoHideZeroStock" />
                <span class="slider"></span>
              </label>
            </div>

            <div class="switch-row">
              <div>
                <div class="switch-title">Enable Pre-Orders & Backorders</div>
                <div class="switch-desc">Allow checkout when incoming supply shipments are confirmed</div>
              </div>
              <label class="switch">
                <input type="checkbox" [(ngModel)]="allowBackorders" />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- Pricing & Taxes -->
        <div class="card">
          <div class="card-header">
            <div class="icon-box">🏷️</div>
            <div>
              <h2 class="card-title">Pricing & VAT Configurations</h2>
              <p class="card-desc">Default tax rates, automated tags, and shipping minimums</p>
            </div>
          </div>

          <div class="card-body">
            <div class="input-grid">
              <shophub-text-input
                label="Standard Tax Rate (%)"
                type="number"
                icon="📊"
                placeholder="15"
                [(value)]="taxRate"
              ></shophub-text-input>

              <shophub-text-input
                label="Free Shipping Threshold ($)"
                type="number"
                icon="🚚"
                placeholder="150"
                [(value)]="freeShippingMin"
              ></shophub-text-input>
            </div>

            <div class="switch-row">
              <div>
                <div class="switch-title">Display Prices with Tax Included</div>
                <div class="switch-desc">Calculate and reflect local sales tax in catalog list prices</div>
              </div>
              <label class="switch">
                <input type="checkbox" [(ngModel)]="taxInclusive" />
                <span class="slider"></span>
              </label>
            </div>

            <div class="switch-row">
              <div>
                <div class="switch-title">Auto-Tag 'Bestseller' Items</div>
                <div class="switch-desc">Promote items with high rating and sales velocity automatically</div>
              </div>
              <label class="switch">
                <input type="checkbox" [(ngModel)]="autoBadging" />
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
      color: var(--accent-secondary);
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
      background: linear-gradient(135deg, #06b6d4, #0891b2);
      color: #fff;
      border: none;
      padding: 12px 26px;
      border-radius: var(--radius-sm);
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 4px 18px rgba(6, 182, 212, 0.35);
      transition: all 0.2s;
    }
    .save-btn:hover {
      box-shadow: 0 6px 24px rgba(6, 182, 212, 0.5);
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
      background: rgba(6, 182, 212, 0.12);
      border: 1px solid rgba(6, 182, 212, 0.25);
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
      border-color: #06b6d4;
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
      background: #06b6d4;
      border-color: #22d3ee;
    }
    input:checked + .slider:before {
      transform: translateX(20px);
    }
  `]
})
export class ItemSettingComponent {
  lowStockLimit = 5;
  currency = 'USD';
  autoHideZeroStock = false;
  allowBackorders = true;
  taxRate = 15;
  freeShippingMin = 150;
  taxInclusive = true;
  autoBadging = true;

  saved = signal(false);

  save() {
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2000);
  }
}
