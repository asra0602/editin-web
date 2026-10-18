export type ServiceTier = 'grading' | 'design';
export type CategoryType = 'all' | 'Graduation' | 'Wedding';
export type OrderStatus = 'Menunggu Konfirmasi' | 'Sedang Dalam Pengerjaan' | 'Selesai';
export type UiSimState = 'normal' | 'loading' | 'empty' | 'error';
export type ActiveView = 'catalogue' | 'invoice' | 'admin';

export interface CatalogueItem {
  id: string;
  category: 'Graduation' | 'Wedding';
  categoryLabel: string;
  title: string;
  description: string;
  defaultPhotos: number;
  dimensionsLabel: string;
  gridPattern: string[];
}

export interface CartItem {
  cartItemId: string;
  catalogueId: string;
  title: string;
  tier: ServiceTier;
  tierLabel: string;
  unitPrice: number;
  photoCount: number;
  subtotal: number;
}

export interface OrderRecord {
  invoiceId: string;
  createdAt: string;
  clientName: string;
  clientContact: string;
  driveLink: string;
  notes: string;
  paymentMethod: string;
  status: OrderStatus;
  resultLink: string;
  adminNote: string;
  items: CartItem[];
  totalAmount: number;
}

export const PRICE_DESIGN_ONLY = 8000;
export const PRICE_WITH_GRADING = 12000;

export const CATALOGUE_DATA: CatalogueItem[] = [
  {
    id: 'GRAD-01',
    category: 'Graduation',
    categoryLabel: 'Wisuda',
    title: 'Editorial Seremonial 9-Grid',
    description: 'Tata letak 9 foto bersambung rasio 4:5 dengan ruang tipografi nama gelar wisudawan di baris tengah.',
    defaultPhotos: 9,
    dimensionsLabel: '1080 x 1350 px (4:5)',
    gridPattern: [
      '[FOTO 1]', '[FOTO 2]', '[FOTO 3]',
      '[SAMBUNGAN TEKS GELAR]', '[FOTO 5 UTAMA]', '[SAMBUNGAN TAHUN]',
      '[FOTO 7]', '[FOTO 8]', '[FOTO 9]'
    ],
  },
  {
    id: 'GRAD-02',
    category: 'Graduation',
    categoryLabel: 'Wisuda',
    title: 'Kolase Studio & Kampus 6-Grid',
    description: 'Susunan 6 slot foto rasio 4:5 dengan potongan objek lintas bingkai untuk foto grup dan orang tua.',
    defaultPhotos: 6,
    dimensionsLabel: '1080 x 1350 px (4:5)',
    gridPattern: [
      '[FOTO 1]', '[SAMBUNGAN 2]', '[FOTO 3]',
      '[FOTO 4]', '[SAMBUNGAN 5]', '[FOTO 6]',
      '[SLOT OPSIONAL 7]', '[SLOT OPSIONAL 8]', '[SLOT OPSIONAL 9]'
    ],
  },
  {
    id: 'WED-01',
    category: 'Wedding',
    categoryLabel: 'Wedding',
    title: 'Monogram Akad & Resepsi 9-Grid',
    description: 'Alur cerita kronologis pernikahan dengan sambungan inisial pasangan dan kutipan tanggal acara.',
    defaultPhotos: 9,
    dimensionsLabel: '1080 x 1350 px (4:5)',
    gridPattern: [
      '[DETAIL CINCIN]', '[INISIAL PASANGAN]', '[BUSANA AKAD]',
      '[FOTO UTAMA 4]', '[SAMBUNGAN TENGAH]', '[FOTO UTAMA 6]',
      '[RESEPSI 7]', '[TAMU 8]', '[PENUTUP 9]'
    ],
  },
  {
    id: 'WED-02',
    category: 'Wedding',
    categoryLabel: 'Wedding',
    title: 'Intimate Portrait 6-Grid',
    description: 'Fokus pada potret dekat pasangan dengan bingkai bersih dan sambungan garis minimal antar baris.',
    defaultPhotos: 6,
    dimensionsLabel: '1080 x 1350 px (4:5)',
    gridPattern: [
      '[POTRET 1]', '[SAMBUNGAN TANGGAL]', '[POTRET 3]',
      '[POTRET 4]', '[POTRET 5]', '[SAMBUNGAN LOKASI]',
      '[SLOT OPSIONAL 7]', '[SLOT OPSIONAL 8]', '[SLOT OPSIONAL 9]'
    ],
  },
];

// Initial simulation record explicitly labeled per R-38 so it is never mistaken for fabricated customer data.
export const INITIAL_ORDERS: OrderRecord[] = [
  {
    invoiceId: 'INV-20261019-001',
    createdAt: '19 Okt 2026, 10:30 WITA',
    clientName: '[DATA SIMULASI] Nadia Putri, S.Kom.',
    clientContact: '0812-0000-0001',
    driveLink: 'https://drive.google.com/drive/folders/simulasi-mentah-wisuda',
    notes: 'Nama: Nadia Putri, S.Kom. Kampus: Universitas Lambung Mangkurat.',
    paymentMethod: 'QRIS Studio',
    status: 'Sedang Dalam Pengerjaan',
    resultLink: '',
    adminNote: 'Proses penyelarasan tone warna untuk 9 foto.',
    items: [
      {
        cartItemId: 'GRAD-01-grading',
        catalogueId: 'GRAD-01',
        title: 'Editorial Seremonial 9-Grid (Wisuda)',
        tier: 'grading',
        tierLabel: 'Design + Editing Color Grading',
        unitPrice: 12000,
        photoCount: 9,
        subtotal: 108000,
      },
    ],
    totalAmount: 108000,
  },
];

export function formatRupiah(num: number): string {
  return 'Rp ' + num.toLocaleString('id-ID');
}