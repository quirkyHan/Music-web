<script>
  import { api } from '../lib/api.js';
  import { currentRoute, showToast } from '../lib/stores.js';
  import { Music2, Lock, Eye, EyeOff, Loader2, ArrowRight, AlertCircle, User, Mail, ArrowLeft } from '@lucide/svelte';

  let username = $state('');
  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let showPassword = $state(false);
  let loading = $state(false);
  let errorMessage = $state('');

  async function handleSignup(e) {
    e.preventDefault();
    errorMessage = '';

    const cleanUsername = username.trim();
    const cleanEmail = email.trim();

    if (!cleanUsername) {
      errorMessage = 'Username wajib diisi.';
      return;
    }

    if (!cleanEmail) {
      errorMessage = 'Email wajib diisi.';
      return;
    }

    if (password.length < 6) {
      errorMessage = 'Kata sandi minimal 6 karakter.';
      return;
    }

    if (password !== confirmPassword) {
      errorMessage = 'Konfirmasi kata sandi tidak cocok.';
      return;
    }

    loading = true;

    try {
      await api.signup({
        username: cleanUsername,
        email: cleanEmail,
        password: password,
      });

      showToast('Pendaftaran akun berhasil! Silakan masuk.', 'success');
      currentRoute.set('login');
    } catch (err) {
      errorMessage = err.message || 'Gagal mendaftar akun. Silakan coba lagi.';
      showToast(errorMessage, 'error');
    } finally {
      loading = false;
    }
  }

  function goToLogin() {
    errorMessage = '';
    currentRoute.set('login');
  }
</script>

<div class="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-950">
  <!-- Subtle decorative ambient lights -->
  <div class="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
  <div class="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

  <div class="w-full max-w-md relative z-10">
    <!-- Brand Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/25 mb-4 ring-1 ring-white/20">
        <Music2 class="w-8 h-8 text-white" />
      </div>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-white">
        Buat Akun Baru
      </h1>
      <p class="text-slate-400 text-sm mt-1.5">
        Mulai simpan dan kelompokkan daftar lagu favoritmu
      </p>
    </div>

    <!-- Signup Card -->
    <div class="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/50">
      
      <!-- Error Banner -->
      {#if errorMessage}
        <div class="mb-6 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm animate-in fade-in">
          <AlertCircle class="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          <span class="leading-relaxed">{errorMessage}</span>
        </div>
      {/if}

      <form onsubmit={handleSignup} class="space-y-4">
        <!-- Username Field -->
        <div>
          <label for="reg-username" class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Username
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <User class="w-4 h-4" />
            </div>
            <input
              id="reg-username"
              type="text"
              bind:value={username}
              disabled={loading}
              placeholder="contoh: johan_music"
              required
              class="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:opacity-50"
            />
          </div>
        </div>

        <!-- Email Field -->
        <div>
          <label for="reg-email" class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Email
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Mail class="w-4 h-4" />
            </div>
            <input
              id="reg-email"
              type="email"
              bind:value={email}
              disabled={loading}
              placeholder="nama@email.com"
              required
              class="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:opacity-50"
            />
          </div>
        </div>

        <!-- Password Field -->
        <div>
          <label for="reg-password" class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Kata Sandi
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock class="w-4 h-4" />
            </div>
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              bind:value={password}
              disabled={loading}
              placeholder="Minimal 6 karakter"
              required
              class="w-full pl-10 pr-11 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:opacity-50"
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

        <!-- Confirm Password Field -->
        <div>
          <label for="reg-confirm-password" class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Konfirmasi Kata Sandi
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock class="w-4 h-4" />
            </div>
            <input
              id="reg-confirm-password"
              type={showPassword ? 'text' : 'password'}
              bind:value={confirmPassword}
              disabled={loading}
              placeholder="Ulangi kata sandi"
              required
              class="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all disabled:opacity-50"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          disabled={loading}
          class="w-full mt-2 py-3 px-4 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-[0.99] transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {#if loading}
            <Loader2 class="w-4 h-4 animate-spin text-white" />
            <span>Mendaftarkan Akun...</span>
          {:else}
            <span>Daftar Sekarang</span>
            <ArrowRight class="w-4 h-4" />
          {/if}
        </button>
      </form>

      <!-- Switch back to Login -->
      <div class="mt-6 pt-5 border-t border-slate-800 text-center">
        <p class="text-xs text-slate-400">
          Sudah punya akun?
          <button
            type="button"
            onclick={goToLogin}
            class="text-purple-400 font-semibold hover:text-purple-300 transition-colors ml-1 underline underline-offset-4 cursor-pointer"
          >
            Masuk di sini
          </button>
        </p>
      </div>

    </div>

    <!-- API info hint -->
    <div class="mt-6 text-center">
      <p class="text-xs text-slate-500">
        Terhubung ke endpoint <span class="text-slate-400 font-mono">POST /auth/signup</span>
      </p>
    </div>
  </div>
</div>
