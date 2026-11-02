import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserStateService } from './services/user-state.service';
import { TextInputComponent } from '@shophub/shared-ui';

export interface CatalogItem {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  badge?: string;
  description: string;
  tags: string[];
  icon: string;
  liked?: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, TextInputComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly userState = inject(UserStateService);
  searchTerm = signal<string>('');
  selectedCategory = signal<string>('All');
  sortBy = signal<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  onlyInStock = signal<boolean>(false);

  allCategories = ['All', 'Audio', 'Computing', 'Photography', 'Wearables', 'Workspace'];

  items = signal<CatalogItem[]>([
    {
      id: 1,
      title: 'Aura Studio Wireless Headphones',
      category: 'Audio',
      price: 299,
      rating: 4.9,
      reviews: 142,
      inStock: true,
      badge: 'Bestseller',
      description: 'Active noise cancellation with spatial soundstage and ultra-plush memory foam cushions.',
      tags: ['Wireless', 'ANC', 'Spatial Audio'],
      icon: '🎧'
    },
    {
      id: 2,
      title: 'ProVision Ultra 4K Monitor',
      category: 'Computing',
      price: 649,
      rating: 4.8,
      reviews: 98,
      inStock: true,
      badge: 'Popular',
      description: '32-inch IPS panel with 99% DCI-P3 color gamut, HDR600, and 90W USB-C single cable dock.',
      tags: ['4K UHD', 'IPS', 'USB-C'],
      icon: '🖥️'
    },
    {
      id: 3,
      title: 'Lumix Prime Mirrorless Body',
      category: 'Photography',
      price: 1199,
      rating: 4.9,
      reviews: 64,
      inStock: false,
      badge: 'Pro Tier',
      description: 'Full-frame 33MP BSI CMOS sensor with 8K cinema recording and 5-axis IBIS stabilization.',
      tags: ['Full Frame', '8K Video', 'IBIS'],
      icon: '📷'
    },
    {
      id: 4,
      title: 'Horizon Smartwatch Ultra',
      category: 'Wearables',
      price: 379,
      rating: 4.7,
      reviews: 215,
      inStock: true,
      badge: 'New',
      description: 'Titanium chassis, sapphire crystal display, dual-frequency GPS, and 14-day battery life.',
      tags: ['Titanium', 'GPS', 'Heart Rate'],
      icon: '⌚'
    },
    {
      id: 5,
      title: 'KeyChron Nova Mechanical Keyboard',
      category: 'Workspace',
      price: 159,
      rating: 4.8,
      reviews: 310,
      inStock: true,
      description: 'Custom gasket-mount 75% layout with hot-swappable lubed switches and CNC aluminum body.',
      tags: ['Mechanical', 'Hot-swap', 'RGB'],
      icon: '⌨️'
    },
    {
      id: 6,
      title: 'Pulse Studio Condenser Microphone',
      category: 'Audio',
      price: 189,
      rating: 4.6,
      reviews: 87,
      inStock: true,
      description: 'Broadcast-grade cardioid capsule with zero-latency hardware monitor and built-in pop filter.',
      tags: ['XLR/USB', 'Podcast', 'Studio'],
      icon: '🎙️'
    },
    {
      id: 7,
      title: 'ErgoGlide Precision Mouse',
      category: 'Workspace',
      price: 99,
      rating: 4.7,
      reviews: 178,
      inStock: true,
      description: 'Sculpted palm ergonomics, 26,000 DPI optical sensor, and infinite dual-mode scroll wheel.',
      tags: ['Wireless', 'Ergonomic', '26K DPI'],
      icon: '🖱️'
    },
    {
      id: 8,
      title: 'AeroBook Pro M3 Max 16"',
      category: 'Computing',
      price: 2499,
      rating: 5.0,
      reviews: 52,
      inStock: true,
      badge: 'Flagship',
      description: '16-core CPU, 40-core GPU, Liquid Retina XDR display with incredible battery efficiency.',
      tags: ['Apple Silicon', 'XDR', '36GB RAM'],
      icon: '💻'
    },
    {
      id: 9,
      title: 'CinemaLens 35mm f/1.4 Art',
      category: 'Photography',
      price: 849,
      rating: 4.9,
      reviews: 73,
      inStock: true,
      description: 'Razor-sharp edge-to-edge resolution with smooth circular bokeh and silent linear autofocus.',
      tags: ['Prime Lens', 'f/1.4', 'Weather Sealed'],
      icon: '🔭'
    },
    {
      id: 10,
      title: 'ZenPulse Noise-Isolating Earbuds',
      category: 'Audio',
      price: 179,
      rating: 4.5,
      reviews: 194,
      inStock: true,
      description: 'Compact IPX7 waterproof buds with hybrid active cancellation and wireless charging case.',
      tags: ['IPX7', 'Wireless Charging', 'Compact'],
      icon: '🎵'
    },
    {
      id: 11,
      title: 'Apex Lift Motorized Standing Desk',
      category: 'Workspace',
      price: 529,
      rating: 4.8,
      reviews: 112,
      inStock: false,
      badge: 'Popular',
      description: 'Dual-motor solid bamboo desktop with 4 memory presets, collision safety, and cable channel.',
      tags: ['Dual Motor', 'Bamboo', 'Memory Presets'],
      icon: '🪑'
    },
    {
      id: 12,
      title: 'Onyx Ring Health Tracker',
      category: 'Wearables',
      price: 269,
      rating: 4.6,
      reviews: 92,
      inStock: true,
      description: 'Subtle ceramic smart ring tracking sleep stages, HRV, body temperature, and daily readiness.',
      tags: ['Sleep Tracker', 'HRV', 'Waterproof'],
      icon: '💍'
    },
    {
      id: 13,
      title: 'Thunderbolt 4 Quad Pro Dock',
      category: 'Computing',
      price: 289,
      rating: 4.7,
      reviews: 140,
      inStock: true,
      description: '14-in-1 workstation expansion with dual 4K@120Hz display outputs and 98W host charging.',
      tags: ['Thunderbolt 4', '14 Ports', '98W PD'],
      icon: '🔌'
    },
    {
      id: 14,
      title: 'Carbon Travel Tripod Pro',
      category: 'Photography',
      price: 320,
      rating: 4.8,
      reviews: 81,
      inStock: true,
      description: 'Ultralight 8-layer carbon fiber legs with inverted ball head and 15kg load capacity.',
      tags: ['Carbon Fiber', 'Ballhead', 'Compact'],
      icon: '📐'
    },
    {
      id: 15,
      title: 'Verve RGB Ambient Lightbar',
      category: 'Workspace',
      price: 89,
      rating: 4.7,
      reviews: 240,
      inStock: true,
      badge: 'Trending',
      description: 'Auto-dimming monitor screenbar with back ambient lighting, wireless desktop puck control.',
      tags: ['Screenbar', 'Auto-Dimming', 'No Glare'],
      icon: '💡'
    },
    {
      id: 16,
      title: 'SonicBass Reference Subwoofer',
      category: 'Audio',
      price: 499,
      rating: 4.9,
      reviews: 45,
      inStock: true,
      description: '10-inch long-throw driver, 300W RMS Class D amplifier with digital DSP room correction.',
      tags: ['300W', '10-inch', 'Studio Sub'],
      icon: '🔊'
    }
  ]);

  // Reactive computed search and filter results
  filteredItems = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const category = this.selectedCategory();
    const sort = this.sortBy();
    const inStockOnly = this.onlyInStock();

    let list = this.items().filter((item) => {
      // Category filter
      const matchesCategory = category === 'All' || item.category === category;

      // In stock filter
      const matchesStock = !inStockOnly || item.inStock;

      // Query search filter (searches title, category, description, and tags)
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query));

      return matchesCategory && matchesStock && matchesQuery;
    });

    // Sorting
    return list.sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      return a.id - b.id; // featured / default
    });
  });

  categoryCount(cat: string): number {
    if (cat === 'All') return this.items().length;
    return this.items().filter(item => item.category === cat).length;
  }

  setCategory(cat: string) {
    this.selectedCategory.set(cat);
  }

  clearSearch() {
    this.searchTerm.set('');
  }

  toggleLike(id: number) {
    this.items.update(items =>
      items.map(item =>
        item.id === id ? { ...item, liked: !item.liked } : item
      )
    );
  }

  resetAllFilters() {
    this.searchTerm.set('');
    this.selectedCategory.set('All');
    this.sortBy.set('featured');
    this.onlyInStock.set(false);
  }
}
