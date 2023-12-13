<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	import { ListBox, ListBoxItem, getModalStore } from '@skeletonlabs/skeleton';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	// Local
	let materias = 'fisica';
	const modalStore = getModalStore();

	// Handle Form Submission
	function onFormSubmit(): void {
		if(typeof materias !== 'object' || materias === null){
			parent.buttonPositive ="variant-filled-error";
			return;
		}else{
			parent.buttonPositive = "variant-filled";

		}

		if ($modalStore[0].response) $modalStore[0].response(materias);
		modalStore.close();
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		
			<ListBox class="border border-surface-500 p-4 rounded-container-token">
				{#each $modalStore[0].meta as item}
					<ListBoxItem bind:group={materias} name={item.nombre} value={item} >{item.nombre}</ListBoxItem>
				{/each}
			</ListBox>
		<!-- prettier-ignore -->
		
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn variant-ghost-surface" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
			<button class="btn variant-filled" on:click={onFormSubmit} >Aceptar</button>
    	</footer>
	</div>
{/if}