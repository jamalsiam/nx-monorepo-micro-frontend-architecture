import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StatMetric {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
  accentColor: string;
}

export interface ActivityBar {
  day: string;
  height: number;
  amount: string;
}

export interface RecentTransaction {
  id: string;
  customer: string;
  product: string;
  date: string;
  amount: string;
  status: 'Completed' | 'Processing' | 'Shipped';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-page">
      <!-- Dashboard Top Header -->
      <div class="dash-header">
        <div>
          <div class="dash-tag">
            <span class="live-dot"></span>
            Real-Time Analytics
          </div>
          <h1 class="dash-title">Platform Performance & Statistics</h1>
          <p class="dash-subtitle">Consolidated operational metrics, sales volume, and transaction history.</p>
        </div>

        <div class="header-actions">
          <div class="timeframe-selector">
            @for (tf of timeframes; track tf) {
              <button
                class="tf-btn"
                [class.active]="selectedTimeframe() === tf"
                (click)="selectedTimeframe.set(tf)"
              >
                {{ tf }}
              </button>
            }
          </div>
          <button class="export-btn" (click)="refresh()">
            <span [class.spinning]="isRefreshing()">↺</span>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards Grid -->
      <div class="kpi-grid">
        @for (metric of metrics; track metric.title) {
          <div class="kpi-card" [style.--card-accent]="metric.accentColor">
            <div class="kpi-top">
              <span class="kpi-icon">{{ metric.icon }}</span>
              <span class="kpi-trend" [class.negative]="!metric.isPositive">
                {{ metric.isPositive ? '↗ +' : '↘ -' }}{{ metric.change }}
              </span>
            </div>
            <div class="kpi-value">{{ metric.value }}</div>
            <div class="kpi-label">{{ metric.title }}</div>
          </div>
        }
      </div>

      <!-- Main Visualizations Grid -->
      <div class="charts-grid">
        <!-- Weekly Sales Velocity Bar Chart -->
        <div class="panel-card chart-panel">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">Weekly Revenue Velocity</h2>
              <p class="panel-subtitle">Daily sales aggregate for current billing period</p>
            </div>
            <span class="chart-badge">Avg $18.4k / day</span>
          </div>

          <div class="bars-container">
            @for (bar of weeklyData; track bar.day) {
              <div class="bar-col">
                <div class="bar-tooltip">{{ bar.amount }}</div>
                <div class="bar-track">
                  <div class="bar-fill" [style.height.%]="bar.height"></div>
                </div>
                <span class="bar-day">{{ bar.day }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Revenue by Category Breakdown -->
        <div class="panel-card category-panel">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">Sales by Category</h2>
              <p class="panel-subtitle">Share of volume by department</p>
            </div>
          </div>

          <div class="category-bars">
            <div class="cat-row">
              <div class="cat-meta">
                <span class="cat-name">Computing & Displays</span>
                <span class="cat-pct">42% • $53,950</span>
              </div>
              <div class="meter-track">
                <div class="meter-fill comp" style="width: 42%;"></div>
              </div>
            </div>

            <div class="cat-row">
              <div class="cat-meta">
                <span class="cat-name">Studio & Audio Gear</span>
                <span class="cat-pct">28% • $35,960</span>
              </div>
              <div class="meter-track">
                <div class="meter-fill audio" style="width: 28%;"></div>
              </div>
            </div>

            <div class="cat-row">
              <div class="cat-meta">
                <span class="cat-name">Smart Wearables</span>
                <span class="cat-pct">18% • $23,120</span>
              </div>
              <div class="meter-track">
                <div class="meter-fill wear" style="width: 18%;"></div>
              </div>
            </div>

            <div class="cat-row">
              <div class="cat-meta">
                <span class="cat-name">Workspace & Accessories</span>
                <span class="cat-pct">12% • $15,420</span>
              </div>
              <div class="meter-track">
                <div class="meter-fill work" style="width: 12%;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions Table Panel -->
      <div class="panel-card table-panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">Recent Transactions</h2>
            <p class="panel-subtitle">Latest settled orders across all micro-frontends</p>
          </div>
          <span class="badge-total">{{ transactions.length }} orders logged</span>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Item Purchased</th>
                <th>Date / Time</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              @for (tx of transactions; track tx.id) {
                <tr>
                  <td class="font-mono text-muted">{{ tx.id }}</td>
                  <td class="font-bold text-white">{{ tx.customer }}</td>
                  <td>{{ tx.product }}</td>
                  <td class="text-secondary">{{ tx.date }}</td>
                  <td class="font-mono text-white font-bold">{{ tx.amount }}</td>
                  <td>
                    <span
                      class="status-pill"
                      [class.completed]="tx.status === 'Completed'"
                      [class.processing]="tx.status === 'Processing'"
                      [class.shipped]="tx.status === 'Shipped'"
                    >
                      {{ tx.status }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    /* Top Header */
    .dash-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 20px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .dash-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #34d399;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.25);
      padding: 4px 12px;
      border-radius: var(--radius-full);
      margin-bottom: 10px;
    }

    .live-dot {
      width: 7px;
      height: 7px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px #10b981;
    }

    .dash-title {
      font-size: 34px;
      font-weight: 800;
      letter-spacing: -1.2px;
      color: #ffffff;
      line-height: 1.15;
      margin-bottom: 6px;
    }

    .dash-subtitle {
      font-size: 15px;
      color: var(--text-secondary);
      max-width: 600px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .timeframe-selector {
      display: flex;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 4px;
      gap: 4px;
    }

    .tf-btn {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-size: 12.5px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s;
    }

    .tf-btn.active {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }

    .export-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
      border: none;
      padding: 10px 18px;
      border-radius: var(--radius-sm);
      font-size: 13.5px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
      transition: all 0.2s;
    }

    .export-btn:hover {
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
      transform: translateY(-1px);
    }

    .spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }

    /* KPI Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
    }

    .kpi-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 22px;
      backdrop-filter: blur(16px);
      position: relative;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      transition: transform 0.25s, border-color 0.25s;
    }

    .kpi-card:hover {
      transform: translateY(-3px);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .kpi-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: var(--card-accent);
    }

    .kpi-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
    }

    .kpi-icon {
      font-size: 26px;
      width: 44px;
      height: 44px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border-subtle);
    }

    .kpi-trend {
      font-size: 12px;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: var(--radius-full);
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .kpi-trend.negative {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
      border-color: rgba(239, 68, 68, 0.3);
    }

    .kpi-value {
      font-size: 30px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.8px;
      margin-bottom: 4px;
    }

    .kpi-label {
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Charts Grid */
    .charts-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }

    @media (max-width: 992px) {
      .charts-grid {
        grid-template-columns: 1fr;
      }
    }

    .panel-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 24px;
      backdrop-filter: blur(16px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    }

    .panel-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .panel-title {
      font-size: 18px;
      font-weight: 700;
      color: #ffffff;
    }

    .panel-subtitle {
      font-size: 12.5px;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .chart-badge {
      font-size: 12px;
      font-weight: 700;
      color: #34d399;
      background: rgba(16, 185, 129, 0.12);
      padding: 4px 10px;
      border-radius: var(--radius-full);
      border: 1px solid rgba(16, 185, 129, 0.25);
    }

    /* Weekly Bar Chart */
    .bars-container {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      height: 220px;
      padding-top: 30px;
      gap: 12px;
    }

    .bar-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      position: relative;
    }

    .bar-tooltip {
      font-size: 11px;
      font-weight: 700;
      color: #fff;
      background: #111827;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid var(--border-subtle);
      margin-bottom: 8px;
      font-family: var(--font-mono);
    }

    .bar-track {
      flex: 1;
      width: 100%;
      max-width: 42px;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 8px;
      display: flex;
      align-items: flex-end;
      overflow: hidden;
      border: 1px solid var(--border-subtle);
    }

    .bar-fill {
      width: 100%;
      background: linear-gradient(180deg, #10b981, #06b6d4);
      border-radius: 8px 8px 0 0;
      transition: height 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
    }

    .bar-day {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 600;
      margin-top: 10px;
    }

    /* Category Breakdown */
    .category-bars {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .cat-meta {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      margin-bottom: 6px;
    }

    .cat-name {
      color: #ffffff;
      font-weight: 600;
    }

    .cat-pct {
      color: var(--text-muted);
      font-family: var(--font-mono);
      font-size: 12px;
    }

    .meter-track {
      width: 100%;
      height: 10px;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 10px;
      overflow: hidden;
    }

    .meter-fill {
      height: 100%;
      border-radius: 10px;
    }

    .meter-fill.comp { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
    .meter-fill.audio { background: linear-gradient(90deg, #10b981, #34d399); }
    .meter-fill.wear { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
    .meter-fill.work { background: linear-gradient(90deg, #8b5cf6, #a78bfa); }

    /* Transactions Table */
    .table-panel {
      margin-top: 8px;
    }

    .badge-total {
      font-size: 12px;
      color: var(--text-muted);
      padding: 4px 10px;
      background: rgba(255, 255, 255, 0.04);
      border-radius: var(--radius-full);
      border: 1px solid var(--border-subtle);
    }

    .table-responsive {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .data-table th {
      padding: 12px 16px;
      font-size: 12px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      font-weight: 600;
      border-bottom: 1px solid var(--border-subtle);
    }

    .data-table td {
      padding: 16px;
      font-size: 13.5px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      vertical-align: middle;
    }

    .font-mono { font-family: var(--font-mono); }
    .font-bold { font-weight: 700; }
    .text-white { color: #ffffff; }
    .text-muted { color: var(--text-muted); }
    .text-secondary { color: var(--text-secondary); }

    .status-pill {
      display: inline-block;
      padding: 4px 10px;
      border-radius: var(--radius-full);
      font-size: 11.5px;
      font-weight: 700;
    }

    .status-pill.completed {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .status-pill.processing {
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .status-pill.shipped {
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }
  `]
})
export class DashboardComponent {
  selectedTimeframe = signal('Last 7 Days');
  timeframes = ['Today', 'Last 7 Days', 'Last 30 Days', 'Quarter'];
  isRefreshing = signal(false);

  metrics: StatMetric[] = [
    {
      title: 'Gross Revenue',
      value: '$128,450',
      change: '14.8%',
      isPositive: true,
      icon: '💰',
      accentColor: '#10b981'
    },
    {
      title: 'Settled Orders',
      value: '1,842',
      change: '8.2%',
      isPositive: true,
      icon: '📦',
      accentColor: '#3b82f6'
    },
    {
      title: 'Conversion Rate',
      value: '3.64%',
      change: '0.9%',
      isPositive: true,
      icon: '📈',
      accentColor: '#8b5cf6'
    },
    {
      title: 'Average Order Value',
      value: '$84.20',
      change: '2.1%',
      isPositive: false,
      icon: '🏷️',
      accentColor: '#f59e0b'
    }
  ];

  weeklyData: ActivityBar[] = [
    { day: 'Mon', height: 45, amount: '$12.4k' },
    { day: 'Tue', height: 60, amount: '$16.8k' },
    { day: 'Wed', height: 80, amount: '$22.1k' },
    { day: 'Thu', height: 55, amount: '$15.3k' },
    { day: 'Fri', height: 95, amount: '$28.4k' },
    { day: 'Sat', height: 70, amount: '$19.8k' },
    { day: 'Sun', height: 50, amount: '$13.6k' }
  ];

  transactions: RecentTransaction[] = [
    {
      id: '#ORD-9821',
      customer: 'Sarah Jenkins',
      product: 'Aura Studio Wireless Headphones',
      date: '12 mins ago',
      amount: '$299.00',
      status: 'Completed'
    },
    {
      id: '#ORD-9820',
      customer: 'Alex Rivera',
      product: 'ProVision Ultra 4K Monitor',
      date: '45 mins ago',
      amount: '$649.00',
      status: 'Shipped'
    },
    {
      id: '#ORD-9819',
      customer: 'Marcus Vance',
      product: 'KeyChron Nova Mechanical Keyboard',
      date: '2 hours ago',
      amount: '$159.00',
      status: 'Processing'
    },
    {
      id: '#ORD-9818',
      customer: 'Elena Rostova',
      product: 'Horizon Smartwatch Ultra',
      date: '3 hours ago',
      amount: '$379.00',
      status: 'Completed'
    },
    {
      id: '#ORD-9817',
      customer: 'David Chen',
      product: 'Thunderbolt 4 Quad Pro Dock',
      date: '5 hours ago',
      amount: '$289.00',
      status: 'Completed'
    }
  ];

  refresh() {
    this.isRefreshing.set(true);
    setTimeout(() => this.isRefreshing.set(false), 800);
  }
}
