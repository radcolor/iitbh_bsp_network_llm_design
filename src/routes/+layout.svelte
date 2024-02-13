<script>
	import '../app.pcss';
	import { Toaster } from 'svelte-sonner';
</script>

<slot />
<Toaster richColors expand={true} />