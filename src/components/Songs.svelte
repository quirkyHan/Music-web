<script>
  import { onMount } from 'svelte';
  import { api } from '../lib/api.js';
  import { currentRoute, currentUser, showToast } from '../lib/stores.js';
  import SongModal from './SongModal.svelte';
  import {
    Music2,
    Plus,
    Search,
    ExternalLink,
    Pencil,
    Trash2,
    LogOut,
    Loader2,
    AlertCircle,
    User,
    Disc3
  } from '@lucide/svelte';

  let songs = $state([]);
  let loading = $state(true);
  let searchQuery = $state('');
  let isModalOpen = $state(false);
  let selectedSong = $state(null);
  let deletingId = $state(null);
  let loggingOut = $state(false);

  // Filter songs based on search
  let filteredSongs = $derived(
    songs.filter(
      (song) =>
        (song.title && song.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (song.artist && song.artist.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  async function loadSongs() {
    loading = true;
    try {
      const data = await api.getSongs();
      // Handle array or wrapped response { songs: [...] }
      if (Array.isArray(data)) {
        songs = data;
      } else if (data && Array.isArray(data.songs)) {
        songs = data.songs;
      } else if (data && Array.isArray(data.data)) {
        songs = data.data;
      } else {
        songs = [];
      }
    } catch (err) {
      if (err.status === 401) {
        showToast('Sesi Anda telah berakhir. Silakan masuk kembali.', 'error');
        currentRoute.set('login');
      } else {
        showToast(err.message || 'Gagal memuat daftar lagu.', 'error');
      }
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadSongs();
  });

  function openAddModal() {
    selectedSong = null;
    isModalOpen = true;
  }

  function openEditModal(song) {
    selectedSong = song;
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
    selectedSong = null;
  }

  async function handleSaveSong(songData) {
    if (songData.id) {
      // Edit
      await api.updateSong(songData.id, {
        title: songData.title,
        artist: songData.artist,
        link: songData.link,
      });
      showToast('Lagu berhasil diperbarui!', 'success');
    } else {
      // Add
      await api.addSong({
        title: songData.title,
        artist: songData.artist,
        link: songData.link,
      });
      showToast('Lagu berhasil ditambahkan ke favorit!', 'success');
    }
    await loadSongs();
  }

  async function handleDeleteSong(song) {
    if (!confirm(`Hapus "${song.title}" dari daftar favorit?`)) {
      return;
    }

    deletingId = song.id;
    try {
      await api.deleteSong(song.id);
      showToast('Lagu berhasil dihapus.', 'success');
      await loadSongs();
    } catch (err) {
      showToast(err.message || 'Gagal menghapus lagu.', 'error');
    } finally {
      deletingId = null;
    }
  }

  async function handleLogout() {
    loggingOut = true;
    try {
      await api.logout();
      currentUser.set(null);
      showToast('Berhasil keluar.', 'info');
      currentRoute.set('login');
    } catch (err) {
      showToast(err.message || 'Gagal logout.', 'error');
      // Tetap alihkan ke login jika cookie kadaluarsa
      currentRoute.set('login');
    } finally {
      loggingOut = false;
    }
  }
</script>

<div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
  <!-- Top Navigation Bar -->
  <header class="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <!-- Brand Logo -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
          <Music2 class="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 class="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
            Lagu Favorit
          </h1>
          <p class="text-[11px] text-slate-400">Koleksi Musik Pribadi</p>
        </div>
      </div>

      <!-- User Info & Logout Button -->
      <div class="flex items-center gap-3">
        {#if $currentUser}
          <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <User class="w-3.5 h-3.5 text-indigo-400" />
            <span class="font-medium max-w-[140px] truncate">
              {$currentUser.username || $currentUser.email || 'Pengguna'}
            </span>
          </div>
        {/if}

        <button
          type="button"
          onclick={handleLogout}
          disabled={loggingOut}
          class="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer disabled:opacity-50"
          title="Keluar dari akun"
        >
          {#if loggingOut}
            <Loader2 class="w-3.5 h-3.5 animate-spin" />
            <span class="hidden sm:inline">Keluar...</span>
          {:else}
            <LogOut class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Keluar</span>
          {/if}
        </button>
      </div>
    </div>
  </header>

  <!-- Main Content Area -->
  <main class="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
    <!-- Header Banner & Action Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Daftar Lagu Milikku
        </h2>
        <p class="text-xs sm:text-sm text-slate-400 mt-1">
          {songs.length} lagu tersimpan di koleksi favorit Anda
        </p>
      </div>

      <button
        type="button"
        onclick={openAddModal}
        class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-600/25 cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        <span>Tambah Lagu</span>
      </button>
    </div>

    <!-- Search / Filter Bar -->
    <div class="mt-6 mb-6">
      <div class="relative max-w-md">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
          <Search class="w-4 h-4" />
        </div>
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari berdasarkan judul atau artis..."
          class="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />
      </div>
    </div>

    <!-- Song List / Grid -->
    {#if loading}
      <!-- Loading State -->
      <div class="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
        <Loader2 class="w-8 h-8 animate-spin text-indigo-500" />
        <p class="text-sm">Memuat koleksi lagu favorit Anda...</p>
      </div>
    {:else if filteredSongs.length === 0}
      <!-- Empty State -->
      <div class="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-slate-900/40 border border-slate-800/60 mt-4">
        <div class="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center text-slate-500 mb-4 ring-1 ring-white/5">
          <Disc3 class="w-8 h-8 animate-pulse text-indigo-400/60" />
        </div>
        {#if searchQuery}
          <h3 class="text-base font-semibold text-white">Lagu tidak ditemukan</h3>
          <p class="text-xs text-slate-400 mt-1 max-w-sm">
            Tidak ada lagu yang cocok dengan kata kunci "{searchQuery}".
          </p>
        {:else}
          <h3 class="text-base font-semibold text-white">Belum Ada Lagu Favorit</h3>
          <p class="text-xs text-slate-400 mt-1 max-w-sm">
            Koleksi lagumu masih kosong. Klik tombol di bawah untuk menambahkan lagu favorit pertamamu!
          </p>
          <button
            type="button"
            onclick={openAddModal}
            class="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>Tambah Lagu Sekarang</span>
          </button>
        {/if}
      </div>
    {:else}
      <!-- Songs Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each filteredSongs as song (song.id || song.title + song.artist)}
          <div class="group relative bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 transition-all duration-200 hover:shadow-xl hover:shadow-black/40 flex flex-col justify-between">
            
            <div>
              <!-- Top Row: Icon & Actions -->
              <div class="flex items-start justify-between gap-3 mb-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform shrink-0">
                  <Music2 class="w-5 h-5" />
                </div>

                <!-- Action buttons -->
                <div class="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onclick={() => openEditModal(song)}
                    class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Edit lagu"
                    aria-label="Edit lagu"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onclick={() => handleDeleteSong(song)}
                    disabled={deletingId === song.id}
                    class="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50"
                    title="Hapus lagu"
                    aria-label="Hapus lagu"
                  >
                    {#if deletingId === song.id}
                      <Loader2 class="w-4 h-4 animate-spin text-rose-400" />
                    {:else}
                      <Trash2 class="w-4 h-4" />
                    {/if}
                  </button>
                </div>
              </div>

              <!-- Title & Artist -->
              <h3 class="text-base font-semibold text-white tracking-tight line-clamp-1 group-hover:text-indigo-300 transition-colors" title={song.title}>
                {song.title}
              </h3>
              <p class="text-xs text-slate-400 mt-1 flex items-center gap-1.5 line-clamp-1">
                <User class="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{song.artist}</span>
              </p>
            </div>

            <!-- Optional Link -->
            <div class="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
              {#if song.link}
                <a
                  href={song.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                  title="Buka link lagu"
                >
                  <ExternalLink class="w-3.5 h-3.5" />
                  <span>Dengarkan Lagu</span>
                </a>
              {:else}
                <span class="text-slate-600 text-[11px] italic">Tidak ada link</span>
              {/if}

              <span class="text-[11px] text-slate-500 font-mono">
                #{song.id ?? '—'}
              </span>
            </div>

          </div>
        {/each}
      </div>
    {/if}
  </main>

  <!-- Modal Tambah/Edit Lagu -->
  <SongModal
    isOpen={isModalOpen}
    song={selectedSong}
    onSave={handleSaveSong}
    onClose={closeModal}
  />
</div>
