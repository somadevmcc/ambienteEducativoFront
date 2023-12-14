<script lang="ts">
	import type { ConicStop, DrawerSettings, ModalSettings, ToastSettings } from '@skeletonlabs/skeleton';
	import { AppBar, AppRail, AppRailAnchor, AppShell, Drawer, LightSwitch, Toast, getDrawerStore, getModalStore, getToastStore, initializeStores, localStorageStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import '../app.postcss';
	import icono from '../lib/img/icono5.png';
	import { apertura, toasterAbierto } from '../lib/stores/storesApertura.js';
	import { iniciaTimer } from '../lib/stores/storesTimer.js';

 
	

		let ruta = "/examen";

	initializeStores();	
	const toastStore = getToastStore();
	const storeExample: Writable<string> = localStorageStore('storeExample', 'initialValueHere');
	const conicStops: ConicStop[] = [
	{ color: 'transparent', start: 0, end: 25 },
	{ color: 'rgb(var(--color-primary-500))', start: 75, end: 100 }
];

	

function triggerStyled(): void {
		const drawerSettings: DrawerSettings = {
			id: 'grabacion',
			// Property Overrides
			position: 'top',
			bgDrawer: 'bg-purple-900 text-white',
			bgBackdrop: 'bg-gradient-to-tr from-indigo-500/50 via-purple-500/50 to-pink-500/50',
			
			padding: 'p-4',
			rounded: 'rounded-xl',
			
			// Metadata
			meta: 'Styled Drawer'
		};
		drawerStore.open(drawerSettings);
	}

	
	const drawerStore = getDrawerStore();
	const modalStore = getModalStore();
	let cargado = false;
	let mediaRecorderSupported = false;
	let media: Blob [] = [];
	let mediaRecorder: MediaRecorder;
	let audioSrc: string | null = null;
	let trigger = false;
	let fileInput: HTMLInputElement;
	let thinking = false;
	$: recording = false;

	onMount(async () => {
		mediaRecorderSupported = !!window.navigator.mediaDevices.getUserMedia;
		const stream = await window.navigator.mediaDevices.getUserMedia({audio: true});
		mediaRecorder = new MediaRecorder(stream);
		mediaRecorder.ondataavailable = (e) => media.push(e.data);
		mediaRecorder.onstop = function(){
			const blob = new Blob(media, {type: 'audio/wav; codecs=opus'});
			media = [];
			audioSrc = window.URL.createObjectURL(blob);
			let file = new File([blob],'note.wav',{
				type: 'audio/wav',
				lastModified: new Date().getTime()
			});
			let container = new DataTransfer();
			container.items.add(file);
			const newFileList = container.files;
			fileInput.files = newFileList;

		};
	
  });
  $: getStatus = () => mediaRecorder?.state;
  function record(){
	media = [];
	mediaRecorder?.start();
	recording = true;
	active = false;
  }
  function stop(){

	if(recording){
		mediaRecorder?.stop();
		recording = false;
		active = true;
		console.log(fileInput);
		return;
	}

	
	if (buttonText === 'Terminar') {
	trigger = false;
 	 const formData = new FormData();
	  cargado = true;
	let blob = null;

	if (fileInput.files && fileInput.files.length > 0) {
		blob = new Blob([fileInput.files[0]], { type: 'audio/wav' }); // Adjust the file type if needed
	}
	if (blob) {
		formData.append('audioFile', blob, 'audio.wav');
	}
	
  

	fetch("http://localhost:8000/subirAudio", {
		method: 'POST',
		body: formData,
	})
	.then((response) => {
		if (!response.ok) {
		throw new Error('Network response was not ok');
		}
		toast('Cargando...');
		return response.json();
	})
	.then((data) => {
		// This block runs when the first request succeeds
		console.log('Upload successful:', data);
		// Now make the second request
		return fetch("http://localhost:8000/obtenerPersonalidad/", {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			// Add other headers if needed
		}
		});
	})
	.then((response) => {
		if (!response.ok) {
		throw new Error('Network response was not ok');
		}
		return response.json();
		
	})
	.then((data) => {
		console.log(data);
		// Handle data from the second request here
		if (typeof data === 'object' && (data as { presenta_apertura: string }).presenta_apertura === 'Si') {
			
			apertura.set(true);

	
			
		}else{
			apertura.set(false);
		}
		cargado = false;
		// Additional actions with the response
	})
	.catch((error) => {
		console.error('Error:', error);
		// Handle errors for both requests
	});

	drawerStore.close();
	}

	


	

	
  }

//-skew-y-12
let active = true;
	
$: active_class = active ? 'animate-bounce btn bg-gradient-to-br variant-gradient-secondary-tertiary' : ' btn bg-gradient-to-br variant-gradient-secondary-tertiary';
$: positionClasses = $drawerStore.open || cargado ? 'blur' : '';
$: iniciarTimer(positionClasses);

function iniciarTimer(positionClasses:any){
	
	if(positionClasses != 'blur'){
		iniciaTimer.set(true);
	}else{
		iniciaTimer.set(false);
	}
}

$: onChange($drawerStore.open);
function toastConfirmacion(mensaje:any){
	const t: ToastSettings = {
	message: mensaje,
	background: 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white',
	classes: 'border-4 border-purple-500',
	hideDismiss: false,
	hoverable: true,
	action: {
		label: 'Abrir',
		
		response: () => {
                triggerStyled();
                
                // You can add more commands here if needed
            }
	},
	callback: (response) => {
		if (response.status === 'queued')toasterAbierto.set(true);
		if (response.status === 'closed') toasterAbierto.set(false);
	},
	timeout: 10000
	};
	toastStore.trigger(t);
}
function toast(mensaje:any){
	const t: ToastSettings = {
	message: mensaje,
	timeout: 10000
	};
	toastStore.trigger(t);
}
function onChange(flagDrawer:any){
	if(!flagDrawer && trigger ){
		toastConfirmacion("Vuelve y cuentame tu dia :)");
		toasterAbierto.set(true);
		return;
	}
	trigger = true;
	return;
	
}

function modalComponentList(): void {
		const modal:ModalSettings  = {
			type: 'component',
			component: 'exampleList',
			title: 'Custom List Component',
			body: 'Make your selection then press submit.',
			response: (r) => console.log('response:', r)
		};
		modalStore.trigger(modal);
	}


let showModal = false;

function toggleModal() {
	showModal = !showModal;
}


$: buttonText = audioSrc && !recording ? 'Terminar' : 'Detener';
//$: buttonClass = audioSrc && !recording ? 

</script>

	<Drawer >
		{#if $drawerStore.id === 'grabacion'}
		<input type="file" bind:this={fileInput} name="file" class="invisible" />
		<div class="grid  place-items-center">
			<h1 class="h1">
				<span class="bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone">Dime</span>
			</h1>
			<h1 class="h1">
				<span class="bg-gradient-to-br from-red-500 to-yellow-500 bg-clip-text text-transparent box-decoration-clone">como te sientes</span>
			</h1>
			<h1 class="h1">
				<span class="bg-gradient-to-br from-pink-500 to-violet-500 bg-clip-text text-transparent box-decoration-clone">hoy..?</span>
			</h1>
		</div>
		<br>
		<div class="grid  place-items-center">
			<audio id="reproductor" controls style="width: 200px;" src={audioSrc}></audio>
			<br>
			<div >
				
				<button id="detener" on:click={stop} class="btn bg-gradient-to-br variant-gradient-secondary-tertiary"  aria-disabled={!recording}>{buttonText}</button>
				<button id="record" on:click={record} class="{active_class}" disabled={recording || thinking} aria-disabled={recording}>{#if recording} 
					<span class="relative flex h-3 w-3">
						<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
						<span class="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
					  </span>
				  Grabando...{:else} Grabar {/if}</button>
							</div>
			
		</div>
	
		
	{/if}
	</Drawer>
<Toast />
<!-- App Shell -->
<AppShell class="transition-transform {positionClasses}">
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<a href="/"> <strong class="text-xl uppercase"> Ambiente Educativo</strong> </a>
				
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://discord.gg/NqqDnm9UYX"
					target="_blank"
					rel="noreferrer"
				>
					Discord
				</a>
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://twitter.com/somadev322"
					target="_blank"
					rel="noreferrer"
				>
					Twitter
				</a>
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://github.com/somadevmcc/ambienteEducativoFront"
					target="_blank"
					rel="noreferrer"
				>
					GitHub
				</a>
			</svelte:fragment>
		</AppBar>

	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
	<svelte:fragment slot="sidebarLeft">
		<AppRail>
			<svelte:fragment slot="lead">
				
				<AppRailAnchor data-sveltekit-reload href="/examen"><img alt="The project logo" src={icono} /></AppRailAnchor>
				
			</svelte:fragment>
		
			
			<svelte:fragment slot="trail">
				<LightSwitch />
				
			</svelte:fragment>
			
		</AppRail>

	</svelte:fragment>
	
	
</AppShell>
