<script>
  import { toast } from '../lib/stores.js';
  import { CheckCircle2, AlertCircle, Info, X } from '@lucide/svelte';

  function closeToast() {
    toast.set({ show: false, message: '', type: 'info' });
  }
</script>

{#if $toast.show}
  <div class="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 max-w-md backdrop-blur-md
    {$toast.type === 'success' 
      ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200' 
      : $toast.type === 'error' 
        ? 'bg-rose-950/90 border-rose-500/40 text-rose-200' 
        : 'bg-slate-900/90 border-slate-700 text-slate-200'}">
    
    <div class="shrink-0">
      {#if $toast.type === 'success'}
        <CheckCircle2 class="w-5 h-5 text-emerald-400" />
      {:else if $toast.type === 'error'}
        <AlertCircle class="w-5 h-5 text-rose-400" />
      {:else}
        <Info class="w-5 h-5 text-sky-400" />
      {/if}
    </div>

    <p class="text-sm font-medium leading-snug flex-1">{$toast.message}</p>

    <button 
      type="button" 
      onclick={closeToast}
      class="p-1 rounded-lg opacity-70 hover:opacity-100 transition-opacity hover:bg-white/10"
      aria-label="Tutup notifikasi">
      <X class="w-4 h-4" />
    </button>
  </div>
{/if}
