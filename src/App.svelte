<script>
  import { currentRoute } from './lib/stores.js';
  import Login from './components/Login.svelte';
  import Signup from './components/Signup.svelte';
  import Songs from './components/Songs.svelte';
  import Toast from './components/Toast.svelte';
</script>

<main class="min-h-screen bg-slate-950 text-slate-100">
  <!-- Global Toast Notifications -->
  <Toast />

  <!-- Page Routing -->
  {#if $currentRoute === 'login'}
    <Login />
  {:else if $currentRoute === 'signup'}
    <Signup />
  {:else if $currentRoute === 'songs'}
    <Songs />
  {/if}
</main>
