'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  CATALOGUE_DATA,
  INITIAL_ORDERS,
  PRICE_DESIGN_ONLY,
  PRICE_WITH_GRADING,
  formatRupiah,
  ServiceTier,
  CategoryType,
  OrderStatus,
  UiSimState,
  ActiveView,
  CartItem,
  OrderRecord,
} from '@/data/studioData';

export default function FeedDesignStudioApp() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [uiSim, setUiSim] = useState<UiSimState>('normal');
  const [activeView, setActiveView] = useState<ActiveView>('catalogue');
  const [categoryFilter, setCategoryFilter] = useState<CategoryType>('all');

  // Per-card calculator states (service tier & photo count)
  const [cardSelections, setCardSelections] = useState<
    Record<string, { tier: ServiceTier; qty: number }>
  >(() => {
    const init: Record<string, { tier: ServiceTier; qty: number }> = {};
    CATALOGUE_DATA.forEach((item) => {
      init[item.id] = { tier: 'grading', qty: item.defaultPhotos };
    });
    return init;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(
    INITIAL_ORDERS[0].invoiceId
  );
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Checkout Form States
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [clientDriveLink, setClientDriveLink] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('QRIS Studio');

  const trackerRef = useRef<HTMLElement | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
  };

  useEffect(() => {
    if (!toastMsg) return;
    const timer = setTimeout(() => setToastMsg(null), 3200);
    return () => clearTimeout(timer);
  }, [toastMsg]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  // Close Cart Modal on Escape key (R-32)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen]);

  const updateCardTier = (id: string, tier: ServiceTier) => {
    setCardSelections((prev) => ({
      ...prev,
      [id]: { ...prev[id], tier },
    }));
  };

  const updateCardQty = (id: string, nextQty: number) => {
    const clamped = Math.max(1, Math.min(99, nextQty || 1));
    setCardSelections((prev) => ({
      ...prev,
      [id]: { ...prev[id], qty: clamped },
    }));
  };

  const handleAddToCart = (itemId: string) => {
    const item = CATALOGUE_DATA.find((c) => c.id === itemId);
    if (!item) return;

    const { tier, qty } = cardSelections[itemId];
    const unitPrice = tier === 'grading' ? PRICE_WITH_GRADING : PRICE_DESIGN_ONLY;
    const tierLabel =
      tier === 'grading' ? 'Design + Editing Color Grading' : 'Design Only';
    const cartItemId = `${itemId}-${tier}`;

    setCart((prev) => {
      const idx = prev.findIndex((c) => c.cartItemId === cartItemId);
      if (idx > -1) {
        const updated = [...prev];
        const newCount = updated[idx].photoCount + qty;
        updated[idx] = {
          ...updated[idx],
          photoCount: newCount,
          subtotal: newCount * unitPrice,
        };
        return updated;
      }
      return [
        ...prev,
        {
          cartItemId,
          catalogueId: item.id,
          title: `${item.title} (${item.categoryLabel})`,
          tier,
          tierLabel,
          unitPrice,
          photoCount: qty,
          subtotal: qty * unitPrice,
        },
      ];
    });

    triggerToast(`${qty} foto "${item.title}" ditambahkan ke keranjang.`);
  };

  const handleChangeCartTier = (idx: number, newTier: ServiceTier) => {
    setCart((prev) => {
      const updated = [...prev];
      const unitPrice =
        newTier === 'grading' ? PRICE_WITH_GRADING : PRICE_DESIGN_ONLY;
      const tierLabel =
        newTier === 'grading'
          ? 'Design + Editing Color Grading'
          : 'Design Only';
      updated[idx] = {
        ...updated[idx],
        tier: newTier,
        tierLabel,
        unitPrice,
        subtotal: updated[idx].photoCount * unitPrice,
      };
      return updated;
    });
  };

  const handleChangeCartQty = (idx: number, delta: number) => {
    setCart((prev) => {
      const updated = [...prev];
      const nextCount = updated[idx].photoCount + delta;
      if (nextCount < 1) {
        updated.splice(idx, 1);
        return updated;
      }
      updated[idx] = {
        ...updated[idx],
        photoCount: nextCount,
        subtotal: nextCount * updated[idx].unitPrice,
      };
      return updated;
    });
  };

  const handleRemoveCartItem = (idx: number) => {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const totalAmount = cart.reduce((acc, item) => acc + item.subtotal, 0);
    const nextNum = String(orders.length + 1).padStart(3, '0');
    const newInvoiceId = `INV-20261019-${nextNum}`;

    const newOrder: OrderRecord = {
      invoiceId: newInvoiceId,
      createdAt: '19 Okt 2026, WITA',
      clientName: clientName.trim(),
      clientContact: clientContact.trim(),
      driveLink: clientDriveLink.trim(),
      notes: clientNotes.trim() || 'Tidak ada catatan tambahan.',
      paymentMethod,
      status: 'Menunggu Konfirmasi',
      resultLink: '',
      adminNote: 'Pesanan baru diterima. Menunggu verifikasi pembayaran oleh Admin.',
      items: [...cart],
      totalAmount,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setSelectedInvoiceId(newInvoiceId);
    setCart([]);
    setClientName('');
    setClientContact('');
    setClientDriveLink('');
    setClientNotes('');
    setIsCartOpen(false);
    setActiveView('invoice');
    triggerToast(`Invoice ${newInvoiceId} berhasil diterbitkan.`);
  };

  const handleAdminOrderUpdate = (
    e: React.FormEvent<HTMLFormElement>,
    invoiceId: string
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nextStatus = formData.get('status') as OrderStatus;
    const nextResultLink = (formData.get('resultLink') as string).trim();
    const nextAdminNote =
      (formData.get('adminNote') as string).trim() ||
      'Status diperbarui oleh Admin.';

    setOrders((prev) =>
      prev.map((ord) =>
        ord.invoiceId === invoiceId
          ? {
              ...ord,
              status: nextStatus,
              resultLink: nextResultLink,
              adminNote: nextAdminNote,
            }
          : ord
      )
    );
    triggerToast(`Order ${invoiceId} diperbarui ke status "${nextStatus}".`);
  };

  const totalPhotosInCart = cart.reduce((acc, item) => acc + item.photoCount, 0);
  const cartGrandTotal = cart.reduce((acc, item) => acc + item.subtotal, 0);

  const filteredCatalogue =
    categoryFilter === 'all'
      ? CATALOGUE_DATA
      : CATALOGUE_DATA.filter((item) => item.category === categoryFilter);

  const currentOrder =
    orders.find((o) => o.invoiceId === selectedInvoiceId) || orders[0];

  const getStatusBadgeClass = (status: OrderStatus) => {
    if (status === 'Selesai') return 'status-done';
    if (status === 'Sedang Dalam Pengerjaan') return 'status-work';
    return 'status-wait';
  };

  return (
    <>
      {/* Simulator State Toolbar (R-27) */}
      <div
        className="sim-banner"
        role="region"
        aria-label="Simulator State Antarmuka"
      >
        <div>
          <strong>Mode Estetika:</strong> Editorial Swiss Grid (Dial: ENERGY 2 / RHYTHM 2 / MOTION 1)
        </div>
        <div className="sim-toolbar">
          <span>Uji State UI (R-27):</span>
          {(['normal', 'loading', 'empty', 'error'] as UiSimState[]).map(
            (st) => (
              <button
                key={st}
                type="button"
                className="btn-sim"
                aria-pressed={uiSim === st}
                onClick={() => setUiSim(st)}
              >
                {st.charAt(0).toUpperCase() + st.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="site-header">
        <div className="header-inner">
          <div className="brand-identity">
            <span className="brand-logo">[LOGO STUDIO]</span>
            <span className="brand-sub">
              Jasa Desain Feed IG Wisuda &amp; Wedding
            </span>
          </div>

          <nav className="desktop-nav" aria-label="Navigasi Utama Desktop">
            <button
              type="button"
              className="btn btn-nav"
              aria-current={activeView === 'catalogue' ? 'page' : undefined}
              onClick={() => setActiveView('catalogue')}
            >
              1. Katalog Paket
            </button>
            <button
              type="button"
              className="btn btn-nav"
              aria-current={activeView === 'invoice' ? 'page' : undefined}
              onClick={() => setActiveView('invoice')}
            >
              2. Invoice &amp; Progress Klien
            </button>
            <button
              type="button"
              className="btn btn-nav"
              aria-current={activeView === 'admin' ? 'page' : undefined}
              onClick={() => setActiveView('admin')}
            >
              3. Panel Admin
            </button>
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="btn"
              onClick={toggleTheme}
              aria-label="Ganti tema warna terang atau gelap"
            >
              Tema: {theme === 'light' ? 'Terang' : 'Gelap'}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsCartOpen(true)}
              aria-label="Buka keranjang pesanan"
            >
              <span>Keranjang</span>
              <span className="cart-badge">
                {cart.length} Paket ({totalPhotosInCart} Foto)
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        {/* Global UI State Overrides (R-27) */}
        {uiSim === 'loading' && (
          <div className="state-box" role="status">
            <h2 className="state-title">Memuat Data Ruang Kerja Studio...</h2>
            <p className="state-desc">
              Sedang mengambil daftar paket katalog 4:5, rincian struk invoice,
              dan antrean pesanan dari penyimpanan.
            </p>
            <button
              type="button"
              className="btn"
              onClick={() => setUiSim('normal')}
            >
              Batalkan &amp; Kembali ke Tampilan Normal
            </button>
          </div>
        )}

        {uiSim === 'empty' && (
          <div className="state-box">
            <h2 className="state-title">Belum Ada Data pada Tampilan Ini</h2>
            <p className="state-desc">
              Daftar katalog atau antrean pesanan masih kosong. Tambahkan paket
              baru dari katalog untuk memulai transaksi pertama.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setUiSim('normal')}
            >
              Muat Katalog Standar
            </button>
          </div>
        )}

        {uiSim === 'error' && (
          <div className="state-box error" role="alert">
            <h2 className="state-title">Gagal Memuat Data Pesanan</h2>
            <p className="state-desc">
              Koneksi ke penyimpanan data terputus saat menyinkronkan status
              invoice. Periksa jaringan Anda lalu muat ulang data.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setUiSim('normal')}
            >
              Coba Muat Ulang Sekarang
            </button>
          </div>
        )}

        {/* VIEW 1: CATALOGUE (WISUDA & WEDDING) */}
        {uiSim === 'normal' && activeView === 'catalogue' && (
          <section aria-labelledby="heading-catalogue">
            <div className="section-header">
              <div>
                <h1 id="heading-catalogue" className="section-title">
                  Katalog Desain Feed Instagram
                </h1>
                <p className="section-desc">
                  Pilih tata letak sambungan feed kanvas 1080 x 1350 px (4:5)
                  untuk dokumentasi wisuda atau pernikahan. Harga dihitung
                  proporsional per jumlah foto yang dimasukkan ke dalam grid.
                </p>
              </div>
            </div>

            <div
              className="pricing-ledger"
              aria-label="Informasi Harga Satuan Wisuda dan Wedding"
            >
              <div>
                <strong>Aturan Tarif Satuan (Wisuda &amp; Wedding Sama):</strong>
              </div>
              <div className="pricing-rate">
                <span>Design Only:</span>
                <span className="rate-amount">Rp 8.000 / FOTO</span>
              </div>
              <div className="pricing-rate">
                <span>Design + Editing Color Grading:</span>
                <span className="rate-amount">Rp 12.000 / FOTO</span>
              </div>
            </div>

            <div
              className="filter-bar"
              role="group"
              aria-label="Filter Kategori Katalog"
            >
              <button
                type="button"
                className="btn btn-nav"
                aria-current={categoryFilter === 'all' ? 'page' : undefined}
                onClick={() => setCategoryFilter('all')}
              >
                Semua Kategori ({CATALOGUE_DATA.length})
              </button>
              <button
                type="button"
                className="btn btn-nav"
                aria-current={
                  categoryFilter === 'Graduation' ? 'page' : undefined
                }
                onClick={() => setCategoryFilter('Graduation')}
              >
                Katalog Wisuda (2)
              </button>
              <button
                type="button"
                className="btn btn-nav"
                aria-current={categoryFilter === 'Wedding' ? 'page' : undefined}
                onClick={() => setCategoryFilter('Wedding')}
              >
                Katalog Wedding (2)
              </button>
            </div>

            <div className="catalogue-grid">
              {filteredCatalogue.map((item) => {
                const selection = cardSelections[item.id] || {
                  tier: 'grading',
                  qty: item.defaultPhotos,
                };
                const unitPrice =
                  selection.tier === 'grading'
                    ? PRICE_WITH_GRADING
                    : PRICE_DESIGN_ONLY;
                const subtotal = selection.qty * unitPrice;

                return (
                  <article key={item.id} className="card">
                    <div className="card-top">
                      <div>
                        <span className="tag">{item.categoryLabel}</span>
                        <h2 style={{ fontSize: '1.35rem', marginTop: '6px' }}>
                          {item.title}
                        </h2>
                      </div>
                      <span className="tag">{item.id}</span>
                    </div>

                    <p
                      style={{
                        fontSize: '0.9375rem',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {item.description}
                    </p>

                    <div className="ig-grid-wrapper">
                      <div className="ig-grid-meta">
                        <span> Kanvas: {item.dimensionsLabel}</span>
                        <span>3 Kolom Sambung</span>
                      </div>
                      <div
                        className="ig-grid-preview"
                        aria-label={`Pratinjau tata letak grid Instagram ${item.title}`}
                      >
                        {item.gridPattern.map((cellLabel, i) => {
                          const isJoined =
                            cellLabel.includes('SAMBUNGAN') ||
                            cellLabel.includes('INISIAL');
                          return (
                            <div
                              key={i}
                              className={`ig-cell ${
                                isJoined ? 'joined-banner' : ''
                              }`}
                            >
                              {cellLabel}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor={`tier-${item.id}`}
                      >
                        Pilih Jenis Layanan:
                      </label>
                      <select
                        id={`tier-${item.id}`}
                        className="form-control"
                        value={selection.tier}
                        onChange={(e) =>
                          updateCardTier(item.id, e.target.value as ServiceTier)
                        }
                      >
                        <option value="grading">
                          Design + Editing Color Grading (Rp 12.000 / foto)
                        </option>
                        <option value="design">
                          Design Only : Tanpa Color Grading (Rp 8.000 / foto)
                        </option>
                      </select>
                    </div>

                    <div className="qty-row">
                      <label className="form-label" htmlFor={`qty-${item.id}`}>
                        Jumlah Foto:
                      </label>
                      <div className="qty-controls">
                        <button
                          type="button"
                          className="btn"
                          onClick={() =>
                            updateCardQty(item.id, selection.qty - 1)
                          }
                          aria-label="Kurangi 1 foto"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          id={`qty-${item.id}`}
                          className="form-control qty-input"
                          min={1}
                          max={99}
                          value={selection.qty}
                          onChange={(e) =>
                            updateCardQty(
                              item.id,
                              parseInt(e.target.value, 10)
                            )
                          }
                        />
                        <button
                          type="button"
                          className="btn"
                          onClick={() =>
                            updateCardQty(item.id, selection.qty + 1)
                          }
                          aria-label="Tambah 1 foto"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="price-summary-box">
                      <span style={{ fontSize: '0.875rem' }}>
                        Estimasi Subtotal:
                      </span>
                      <span className="display-price">
                        {formatRupiah(subtotal)}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleAddToCart(item.id)}
                    >
                      Masukkan Paket ke Keranjang
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* VIEW 2: INVOICE RECEIPT & INTEGRATED CLIENT PROGRESS TRACKER */}
        {uiSim === 'normal' && activeView === 'invoice' && (
          <section aria-labelledby="heading-invoice">
            <div className="section-header">
              <div>
                <h1 id="heading-invoice" className="section-title">
                  Struk Invoice &amp; Halaman Progress Klien
                </h1>
                <p className="section-desc">
                  Setiap nomor invoice terhubung langsung dengan halaman pantau
                  status pengerjaan dan pengunduhan file desain beresolusi penuh.
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <label htmlFor="invoiceSelector" className="form-label">
                  Pilih Nomor Invoice:
                </label>
                <select
                  id="invoiceSelector"
                  className="form-control"
                  style={{ width: 'auto', minWidth: '250px' }}
                  value={currentOrder?.invoiceId || ''}
                  onChange={(e) => setSelectedInvoiceId(e.target.value)}
                >
                  {orders.map((ord) => (
                    <option key={ord.invoiceId} value={ord.invoiceId}>
                      {ord.invoiceId} : {ord.clientName} ({ord.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {!currentOrder ? (
              <div className="state-box">
                <h2 className="state-title">Belum Ada Struk Invoice</h2>
                <p className="state-desc">
                  Pilih paket dari Katalog Wisuda atau Wedding untuk menerbitkan
                  invoice dan halaman pantau progres klien.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setActiveView('catalogue')}
                >
                  Buka Katalog Paket
                </button>
              </div>
            ) : (
              <div className="split-layout">
                {/* Left Column: Official Invoice Receipt */}
                <article
                  className="invoice-paper"
                  aria-label="Struk Pembayaran Resmi"
                >
                  <div className="invoice-header">
                    <div>
                      <span className="brand-logo">[LOGO STUDIO]</span>
                      <div
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        Struk / Invoice Resmi
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="display-price">
                        {currentOrder.invoiceId}
                      </div>
                      <div
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {currentOrder.createdAt}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginBottom: '16px',
                      fontSize: '0.9375rem',
                      display: 'grid',
                      gap: '4px',
                    }}
                  >
                    <div>
                      <strong>Klien:</strong> {currentOrder.clientName}
                    </div>
                    <div>
                      <strong>Kontak WhatsApp:</strong>{' '}
                      {currentOrder.clientContact}
                    </div>
                    <div>
                      <strong>Metode Pembayaran:</strong>{' '}
                      {currentOrder.paymentMethod}
                    </div>
                    <div>
                      <strong>Status Order:</strong>{' '}
                      <span
                        className={`tag ${getStatusBadgeClass(
                          currentOrder.status
                        )}`}
                      >
                        {currentOrder.status}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '8px',
                    }}
                  >
                    {currentOrder.items.map((item) => (
                      <div key={item.cartItemId} className="invoice-row">
                        <div>
                          <strong>{item.title}</strong>
                          <div
                            style={{
                              fontSize: '0.8125rem',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            {item.tierLabel} ({item.photoCount} foto x{' '}
                            {formatRupiah(item.unitPrice)})
                          </div>
                        </div>
                        <div className="display-price">
                          {formatRupiah(item.subtotal)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="invoice-total">
                    <span>Total Tagihan Dibayar</span>
                    <span className="display-price">
                      {formatRupiah(currentOrder.totalAmount)}
                    </span>
                  </div>

                  <div
                    style={{
                      marginTop: '20px',
                      paddingTop: '16px',
                      borderTop: '1px dashed var(--border-strong)',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '10px',
                      }}
                    >
                      Tautan halaman pantau progres klien terintegrasi langsung
                      dengan nomor invoice ini:
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                      onClick={() => {
                        trackerRef.current?.focus();
                        trackerRef.current?.scrollIntoView({
                          behavior: 'smooth',
                        });
                        triggerToast(
                          `Menampilkan panel progres untuk ${currentOrder.invoiceId}.`
                        );
                      }}
                    >
                      Fokus ke Tracker Progres ({currentOrder.invoiceId})
                    </button>
                  </div>
                </article>

                {/* Right Column: Integrated Client Result & Progress Tracker */}
                <article
                  ref={trackerRef}
                  id="result-client-tracker"
                  className="card"
                  tabIndex={-1}
                  aria-label="Halaman Progress dan Hasil Klien"
                >
                  <div className="card-top">
                    <div>
                      <span className="tag">
                        Halaman Klien Terintegrasi Invoice
                      </span>
                      <h2 style={{ fontSize: '1.45rem', marginTop: '6px' }}>
                        Tracker Progres: {currentOrder.invoiceId}
                      </h2>
                    </div>
                    <span
                      className={`tag ${getStatusBadgeClass(
                        currentOrder.status
                      )}`}
                    >
                      {currentOrder.status}
                    </span>
                  </div>

                  <div
                    className="progress-steps"
                    aria-label="Tahapan Pengerjaan"
                  >
                    <div
                      className={`step-item ${
                        currentOrder.status === 'Menunggu Konfirmasi'
                          ? 'current'
                          : ''
                      }`}
                    >
                      <span>1. Menunggu Konfirmasi</span>
                    </div>
                    <div
                      className={`step-item ${
                        currentOrder.status === 'Sedang Dalam Pengerjaan'
                          ? 'current'
                          : ''
                      }`}
                    >
                      <span>2. Sedang Dikerjakan</span>
                    </div>
                    <div
                      className={`step-item ${
                        currentOrder.status === 'Selesai' ? 'current' : ''
                      }`}
                    >
                      <span>3. Selesai &amp; Unduh</span>
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: '0.875rem',
                      backgroundColor: 'var(--bg-muted)',
                      padding: '14px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-color)',
                      display: 'grid',
                      gap: '6px',
                    }}
                  >
                    <div>
                      <strong>Catatan Admin Studio:</strong>{' '}
                      {currentOrder.adminNote}
                    </div>
                    <div>
                      <strong>Brief Klien:</strong> {currentOrder.notes}
                    </div>
                    <div>
                      <strong>Folder Foto Mentah:</strong>{' '}
                      <a
                        href={currentOrder.driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {currentOrder.driveLink}
                      </a>
                    </div>
                  </div>

                  {currentOrder.status === 'Selesai' ? (
                    <div
                      className="card"
                      style={{ backgroundColor: 'var(--bg-muted)' }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '8px',
                        }}
                      >
                        <strong>
                          Pratinjau Hasil Desain Feed IG (1080 x 1350 px Siap
                          Upload)
                        </strong>
                        <span className="tag status-done">
                          Selesai Dikerjakan
                        </span>
                      </div>
                      <div
                        className="ig-grid-preview"
                        aria-label="Pratinjau Hasil Feed Selesai"
                      >
                        {[1, 2, 3, 4, 5, 6].map((slot) => (
                          <div key={slot} className="ig-cell joined-banner">
                            [HASIL FEED {slot} : 1080x1350]
                          </div>
                        ))}
                      </div>
                      <p style={{ fontSize: '0.875rem' }}>
                        <strong>Tautan Unduh Hasil Resolusi Penuh:</strong>
                      </p>
                      <a
                        href={
                          currentOrder.resultLink || '#result-client-tracker'
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                      >
                        Buka Folder Hasil Desain (
                        {currentOrder.resultLink
                          ? currentOrder.resultLink
                          : 'Tautan Tersedia'}
                        )
                      </a>
                    </div>
                  ) : (
                    <div className="state-box" style={{ margin: 0 }}>
                      <h3 className="state-title">
                        Hasil Desain Sedang Diproses Studio
                      </h3>
                      <p className="state-desc">
                        Status saat ini: <strong>{currentOrder.status}</strong>.
                        Tautan unduh resolusi penuh akan terbuka otomatis di
                        kotak ini segera setelah Admin mengubah status menjadi
                        &quot;Selesai&quot;.
                      </p>
                      <button
                        type="button"
                        className="btn"
                        onClick={() => setActiveView('admin')}
                      >
                        Buka Panel Admin untuk Update Status
                      </button>
                    </div>
                  )}
                </article>
              </div>
            )}
          </section>
        )}

        {/* VIEW 3: ADMIN PANEL */}
        {uiSim === 'normal' && activeView === 'admin' && (
          <section aria-labelledby="heading-admin">
            <div className="section-header">
              <div>
                <h1 id="heading-admin" className="section-title">
                  Panel Admin: Kelola Order &amp; Submit Hasil
                </h1>
                <p className="section-desc">
                  Periksa pesanan masuk, perbarui status pengerjaan, dan tempel
                  tautan hasil desain Google Drive. Perubahan langsung
                  tersinkronisasi ke halaman Invoice &amp; Result milik klien.
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="state-box">
                <h2 className="state-title">Tidak Ada Antrean Pesanan</h2>
                <p className="state-desc">
                  Belum ada pesanan yang masuk dari halaman checkout klien.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setActiveView('catalogue')}
                >
                  Buat Pesanan Simulasi dari Katalog
                </button>
              </div>
            ) : (
              orders.map((order) => (
                <article key={order.invoiceId} className="admin-order-card">
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '8px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span className="display-price">{order.invoiceId}</span>
                      <span
                        className={`tag ${getStatusBadgeClass(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div>
                      <strong>Klien:</strong> {order.clientName} (
                      {order.clientContact})
                    </div>
                    <div>
                      <strong>Waktu Order:</strong> {order.createdAt} |{' '}
                      <strong>Pembayaran:</strong> {order.paymentMethod}
                    </div>
                    <div>
                      <strong>Tautan Foto Mentah Klien:</strong>{' '}
                      <a
                        href={order.driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {order.driveLink}
                      </a>
                    </div>
                    <div>
                      <strong>Catatan Brief:</strong> {order.notes}
                    </div>
                    <div
                      style={{
                        backgroundColor: 'var(--bg-muted)',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      <strong>
                        Rincian Paket (Total: {formatRupiah(order.totalAmount)}
                        ):
                      </strong>
                      <ul
                        style={{
                          marginTop: '4px',
                          paddingLeft: '18px',
                          fontSize: '0.875rem',
                        }}
                      >
                        {order.items.map((item) => (
                          <li key={item.cartItemId}>
                            {item.title} : {item.tierLabel} ({item.photoCount}{' '}
                            foto = {formatRupiah(item.subtotal)})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => handleAdminOrderUpdate(e, order.invoiceId)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      backgroundColor: 'var(--bg-muted)',
                      padding: '16px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <h2 style={{ fontSize: '1.2rem' }}>
                      Update Status &amp; Submit Hasil Desain
                    </h2>

                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor={`admin-status-${order.invoiceId}`}
                      >
                        Status Pengerjaan:
                      </label>
                      <select
                        id={`admin-status-${order.invoiceId}`}
                        name="status"
                        className="form-control"
                        defaultValue={order.status}
                      >
                        <option value="Menunggu Konfirmasi">
                          Menunggu Konfirmasi
                        </option>
                        <option value="Sedang Dalam Pengerjaan">
                          Sedang Dalam Pengerjaan
                        </option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor={`admin-link-${order.invoiceId}`}
                      >
                        Tautan Google Drive Hasil Desain (Untuk Klien):
                      </label>
                      <input
                        type="url"
                        id={`admin-link-${order.invoiceId}`}
                        name="resultLink"
                        className="form-control"
                        defaultValue={order.resultLink}
                        placeholder="https://drive.google.com/drive/folders/hasil-desain..."
                      />
                    </div>

                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor={`admin-note-${order.invoiceId}`}
                      >
                        Pesan Progres ke Klien:
                      </label>
                      <input
                        type="text"
                        id={`admin-note-${order.invoiceId}`}
                        name="adminNote"
                        className="form-control"
                        defaultValue={order.adminNote}
                        placeholder="Contoh: Revisi warna selesai, silakan unduh."
                      />
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                      }}
                    >
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ flex: 1 }}
                      >
                        Simpan Status &amp; Hasil
                      </button>
                      <button
                        type="button"
                        className="btn"
                        onClick={() => {
                          setSelectedInvoiceId(order.invoiceId);
                          setActiveView('invoice');
                        }}
                      >
                        Lihat di Halaman Klien
                      </button>
                    </div>
                  </form>
                </article>
              ))
            )}
          </section>
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation (R-03) */}
      <nav className="mobile-bottom-nav" aria-label="Navigasi Utama Mobile">
        <button
          type="button"
          className="btn btn-nav"
          aria-current={activeView === 'catalogue' ? 'page' : undefined}
          onClick={() => setActiveView('catalogue')}
        >
          Katalog
        </button>
        <button
          type="button"
          className="btn btn-nav"
          aria-current={activeView === 'invoice' ? 'page' : undefined}
          onClick={() => setActiveView('invoice')}
        >
          Invoice &amp; Hasil
        </button>
        <button
          type="button"
          className="btn btn-nav"
          aria-current={activeView === 'admin' ? 'page' : undefined}
          onClick={() => setActiveView('admin')}
        >
          Admin
        </button>
      </nav>

      {/* Cart & Payment Checkout Modal */}
      {isCartOpen && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalCartTitle"
        >
          <div className="modal-panel">
            <div className="modal-header">
              <h2 id="modalCartTitle" style={{ fontSize: '1.4rem' }}>
                Keranjang &amp; Checkout Pesanan
              </h2>
              <button
                type="button"
                className="btn"
                onClick={() => setIsCartOpen(false)}
                aria-label="Tutup jendela keranjang"
              >
                Tutup (Esc)
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="state-box" style={{ margin: '8px 0' }}>
                <h3 className="state-title">
                  Keranjang Pesanan Masih Kosong
                </h3>
                <p className="state-desc">
                  Anda belum memilih paket desain feed Wisuda atau Wedding.
                  Pilih minimal 1 paket katalog untuk melanjutkan ke pembayaran.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveView('catalogue');
                  }}
                >
                  Pilih Paket dari Katalog
                </button>
              </div>
            ) : (
              <>
                <div>
                  {cart.map((cItem, idx) => (
                    <div key={cItem.cartItemId} className="cart-item">
                      <div className="cart-item-header">
                        <div>
                          <strong>{cItem.title}</strong>
                          <div
                            style={{
                              fontSize: '0.8125rem',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            Harga Satuan: {formatRupiah(cItem.unitPrice)} / foto
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn"
                          onClick={() => handleRemoveCartItem(idx)}
                          aria-label={`Hapus ${cItem.title} dari keranjang`}
                        >
                          Hapus Paket
                        </button>
                      </div>

                      <div className="cart-item-controls">
                        <div
                          className="form-group"
                          style={{ flex: 1, minWidth: '210px' }}
                        >
                          <label
                            className="form-label"
                            htmlFor={`cart-tier-${idx}`}
                          >
                            Ubah Layanan:
                          </label>
                          <select
                            id={`cart-tier-${idx}`}
                            className="form-control"
                            value={cItem.tier}
                            onChange={(e) =>
                              handleChangeCartTier(
                                idx,
                                e.target.value as ServiceTier
                              )
                            }
                          >
                            <option value="grading">
                              Design + Color Grading (Rp 12.000/foto)
                            </option>
                            <option value="design">
                              Design Only (Rp 8.000/foto)
                            </option>
                          </select>
                        </div>

                        <div className="qty-controls">
                          <button
                            type="button"
                            className="btn"
                            onClick={() => handleChangeCartQty(idx, -1)}
                            aria-label="Kurangi jumlah foto"
                          >
                            -
                          </button>
                          <span
                            className="display-price"
                            style={{ minWidth: '76px', textAlign: 'center' }}
                          >
                            {cItem.photoCount} FOTO
                          </span>
                          <button
                            type="button"
                            className="btn"
                            onClick={() => handleChangeCartQty(idx, 1)}
                            aria-label="Tambah jumlah foto"
                          >
                            +
                          </button>
                        </div>

                        <div className="display-price">
                          {formatRupiah(cItem.subtotal)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={handleCheckoutSubmit}
                  style={{
                    borderTop: '2px solid var(--border-color)',
                    paddingTop: '16px',
                  }}
                >
                  <h3 style={{ marginBottom: '12px', fontSize: '1.25rem' }}>
                    Data Klien &amp; Pembayaran
                  </h3>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(240px, 1fr))',
                      gap: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    <div className="form-group">
                      <label className="form-label" htmlFor="clientName">
                        Nama Klien (Wajib)
                      </label>
                      <input
                        type="text"
                        id="clientName"
                        className="form-control"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Nama Lengkap Anda"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="clientContact">
                        Nomor WhatsApp (Wajib)
                      </label>
                      <input
                        type="tel"
                        id="clientContact"
                        className="form-control"
                        required
                        value={clientContact}
                        onChange={(e) => setClientContact(e.target.value)}
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-label" htmlFor="clientDriveLink">
                      Tautan Folder Foto Mentah Google Drive (Wajib)
                    </label>
                    <input
                      type="url"
                      id="clientDriveLink"
                      className="form-control"
                      required
                      value={clientDriveLink}
                      onChange={(e) => setClientDriveLink(e.target.value)}
                      placeholder="https://drive.google.com/drive/folders/..."
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-label" htmlFor="clientNotes">
                      Catatan Tulisan / Nama Gelar / Tanggal Acara
                    </label>
                    <textarea
                      id="clientNotes"
                      className="form-control"
                      rows={2}
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      placeholder="Tuliskan nama wisudawan beserta gelar atau nama pasangan wedding & tanggal..."
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label" htmlFor="paymentMethod">
                      Metode Pembayaran
                    </label>
                    <select
                      id="paymentMethod"
                      className="form-control"
                      required
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="QRIS Studio">
                        QRIS Studio (Otomatis Dicek Admin)
                      </option>
                      <option value="Transfer Bank BCA">
                        Transfer Bank BCA : [NOMOR REKENING PLACEHOLDER]
                      </option>
                      <option value="Transfer Bank Mandiri">
                        Transfer Bank Mandiri : [NOMOR REKENING PLACEHOLDER]
                      </option>
                    </select>
                  </div>

                  <div
                    className="price-summary-box"
                    style={{ marginBottom: '16px' }}
                  >
                    <span>Total Tagihan Pembayaran:</span>
                    <span className="display-price">
                      {formatRupiah(cartGrandTotal)}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'flex-end',
                      gap: '8px',
                    }}
                  >
                    <button
                      type="button"
                      className="btn"
                      onClick={() => setIsCartOpen(false)}
                    >
                      Kembali Pilih Katalog
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Konfirmasi Pembayaran &amp; Buat Invoice
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Action Toast Feedback */}
      {toastMsg && (
        <div className="toast-msg" role="status" aria-live="polite">
          {toastMsg}
        </div>
      )}
    </>
  );
}