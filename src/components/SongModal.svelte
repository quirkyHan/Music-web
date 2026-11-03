<script>
  import { X, Music2, User, Link as LinkIcon, Loader2, Check } from '@lucide/svelte';

  let { isOpen = false, song = null, onSave, onClose } = $props();

  let title = $state('');
  let artist = $state('');
  let link = $state('');
  let saving = $state(false);
  let error = $state('');

  // Sync state whenever song prop changes
  $effect(() => {
    if (song) {
      title = song.title || '';
      artist = song.artist || '';
      link = song.link || '';
    } else {
      title = '';
      artist = '';
      link = '';
    }
    error = '';
  });

  async function handleSubmit(e) {
    e.preventDefault();
    error = '';

    const cleanTitle = title.trim();
    const cleanArtist = artist.trim();
    const cleanLink = link.trim();

    if (!cleanTitle) {
      error = 'Judul lagu wajib diisi.';
      return;
    }

    if (!cleanArtist) {
      error = 'Nama artis wajib diisi.';
      return;
    }

    saving = true;
    try {
      await onSave({
        id: song ? song.id : undefined,
        title: cleanTitle,
        artist: cleanArtist,
        link: cleanLink || null,
      });
      onClose();
    } catch (err) {
      error = err.message || 'Gagal menyimpan lagu.';
    } finally {
      saving = false;
    }
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
    <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-7 relative overflow-hidden animate-in zoom-in-95">
      
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-4 border-b border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Music2 class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-white">
              {song ? 'Edit Lagu Favorit' : 'Tambah Lagu Favorit'}
            </h2>
            <p class="text-xs text-slate-400">
              {song ? 'Perbarui informasi lagu di koleksimu' : 'Tambahkan lagu baru ke daftar koleksimu'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onclick={onClose}
          disabled={saving}
          class="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
          aria-label="Tutup"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Error feedback -->
      {#if error}
        <div class="mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      {/if}

      <!-- Form -->
      <form onsubmit={handleSubmit} class="mt-5 space-y-4">
        <!-- Judul Lagu -->
        <div>
          <label for="song-title" class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Judul Lagu <span class="text-rose-400">*</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Music2 class="w-4 h-4" />
            </div>
            <input
              id="song-title"
              type="text"
              bind:value={title}
              disabled={saving}
              placeholder="Contoh: Bohemian Rhapsody, Komang, dll"
              required
              class="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:opacity-50"
            />
          </div>
        </div>

        <!-- Artis -->
        <div>
          <label for="song-artist" class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Artis / Band <span class="text-rose-400">*</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <User class="w-4 h-4" />
            </div>
            <input
              id="song-artist"
              type="text"
              bind:value={artist}
              disabled={saving}
              placeholder="Contoh: Queen, Raim Laode, dll"
              required
              class="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:opacity-50"
            />
          </div>
        </div>

        <!-- Link (Opsional) -->
        <div>
          <label for="song-link" class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Link Lagu <span class="text-slate-500 font-normal lowercase">(opsional - Spotify, YouTube, SoundCloud)</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <LinkIcon class="w-4 h-4" />
            </div>
            <input
              id="song-link"
              type="url"
              bind:value={link}
              disabled={saving}
              placeholder="https://open.spotify.com/track/... atau link YouTube"
              class="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:opacity-50"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onclick={onClose}
            disabled={saving}
            class="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all disabled:opacity-50 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            class="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {#if saving}
              <Loader2 class="w-4 h-4 animate-spin text-white" />
              <span>Menyimpan...</span>
            {:else}
              <Check class="w-4 h-4" />
              <span>{song ? 'Simpan Perubahan' : 'Tambahkan'}</span>
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
