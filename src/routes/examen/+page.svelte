<script>
    import { Stepper, Step } from '@skeletonlabs/skeleton';
</script>

<Stepper>
	<Step>
		<svelte:fragment slot="header">(header)</svelte:fragment>
		(content)
	</Step>
	<Step>
		<svelte:fragment slot="header">(header)</svelte:fragment>
		(content)
	</Step>
	<!-- ... -->
</Stepper>