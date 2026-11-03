<script>
  import { api } from '../lib/api.js';
  import { currentRoute, currentUser, showToast } from '../lib/stores.js';
  import { Music2, Lock, Eye, EyeOff, Loader2, ArrowRight, AlertCircle, User } from '@lucide/svelte';

  let identifier = $state('');
  let password = $state('');
  let showPassword = $state(false);
  let loading = $state(false);
  let errorMessage = $state('');

  async function handleLogin(e) {
    e.preventDefault();
    errorMessage = '';

    const trimmedIdentifier = identifier.trim();
    if (!trimmedIdentifier) {
      errorMessage = 'Email atau username wajib diisi.';
      return;
    }

    if (!password) {
      errorMessage = 'Kata sandi wajib diisi.';
      return;
    }

    loading = true;

    try {
      // Backend mungkin mengharapkan field 'email', 'username', atau 'identifier'.
      // Mengirimkan payload yang kompatibel dengan berbagai konfigurasi Express backend:
      const payload = {
        email: trimmedIdentifier,
        username: trimmedIdentifier,
        identifier: trimmedIdentifier,
        password: password,
      };

      const res = await api.login(payload);
      
      // Simpan data user jika backend merespons dengan objek user
      if (res && res.user) {
        currentUser.set(res.user);
      } else {
        currentUser.set({ username: trimmedIdentifier });
      }

      showToast('Berhasil masuk! Selamat datang kembali.', 'success');
      currentRoute.set('songs');
    } catch (err) {
      errorMessage = err.message || 'Gagal masuk. Periksa kembali email/username dan kata sandi Anda.';
      showToast(errorMessage, 'error');
    } finally {
      loading = false;
    }
  }

  function goToSignup() {
    errorMessage = '';
    currentRoute.set('signup');
  }
</script>

<div class="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-950">
  <!-- Subtle decorative ambient lights -->
  <div class="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
  <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

  <div class="w-full max-w-md relative z-10">
    <!-- Brand Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25 mb-4 ring-1 ring-white/20">
        <Music2 class="w-8 h-8 text-white" />
      </div>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-white">
        Lagu Favorit
      </h1>
      <p class="text-slate-400 text-sm mt-1.5">
        Masuk untuk mengelola dan memutar koleksi musik Anda
      </p>
    </div>

    <!-- Login Card -->
    <div class="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/50">
      
      <!-- Error Banner -->
      {#if errorMessage}
        <div class="mb-6 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm animate-in fade-in">
          <AlertCircle class="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          <span class="leading-relaxed">{errorMessage}</span>
        </div>
      {/if}

      <form onsubmit={handleLogin} class="space-y-5">
        <!-- Identifier Field -->
        <div>
          <label for="identifier" class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Email atau Username
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <User class="w-4 h-4" />
            </div>
            <input
              id="identifier"
              type="text"
              bind:value={identifier}
              disabled={loading}
              placeholder="nama@email.com atau username"
              autocomplete="username"
              required
              class="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <!-- Password Field -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label for="password" class="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Kata Sandi
            </label>
          </div>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock class="w-4 h-4" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              bind:value={password}
              disabled={loading}
              placeholder="••••••••"
              autocomplete="current-password"
              required
              class="w-full pl-10 pr-11 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onclick={() => (showPassword = !showPassword)}
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
              aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
            >
              {#if showPassword}
                <EyeOff class="w-4 h-4" />
              {:else}
                <Eye class="w-4 h-4" />
              {/if}
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          disabled={loading}
          class="w-full mt-2 py-3 px-4 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-[0.99] transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
        >
          {#if loading}
            <Loader2 class="w-4 h-4 animate-spin text-white" />
            <span>Memproses Masuk...</span>
          {:else}
            <span>Masuk</span>
            <ArrowRight class="w-4 h-4" />
          {/if}
        </button>
      </form>

      <!-- Switch to Signup -->
      <div class="mt-6 pt-5 border-t border-slate-800 text-center">
        <p class="text-xs text-slate-400">
          Belum memiliki akun?
          <button
            type="button"
            onclick={goToSignup}
            class="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors ml-1 underline underline-offset-4 cursor-pointer"
          >
            Daftar sekarang
          </button>
        </p>
      </div>

    </div>

    <!-- API & Cookie info hint for development -->
    <div class="mt-6 text-center">
      <p class="text-xs text-slate-500">
        Autentikasi aman melalui httpOnly cookie &bull; Terhubung ke <span class="text-slate-400 font-mono">POST /auth/login</span>
      </p>
    </div>
  </div>
</div>
