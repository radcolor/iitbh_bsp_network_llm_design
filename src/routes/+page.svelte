<script lang="ts">
	import UserAuthForm from './forms/user-auth.svelte';
</script>

<div
	class="container relative h-[800px] items-center justify-center md:grid"
>
	<div class="lg:p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">Login with Email</h1>
				<p class="text-sm text-muted-foreground">Enter your email below to sign-in</p>
			</div>
			<UserAuthForm />
			<p class="px-2 text-center text-sm text-muted-foreground">
				By clicking continue, you agree to our Terms of Service as well as our Privacy Policy.
			</p>
			<p style="font-family: 'Source code pro';" class="px-2 text-center text-sm text-muted-foreground">
				&lt;/&gt; with &lt;3 by shashank
			</p>
		</div>
	</div>
</div>
