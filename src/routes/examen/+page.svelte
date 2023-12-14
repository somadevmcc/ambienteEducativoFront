<script lang="ts">
    import type { DrawerSettings, ModalComponent, ModalSettings, ToastSettings } from '@skeletonlabs/skeleton';
    import { ListBox, ListBoxItem, Modal, Step, Stepper, getDrawerStore, getModalStore, getToastStore } from '@skeletonlabs/skeleton';
    import type { SvelteComponent } from 'svelte';
    import { onDestroy } from 'svelte';
    import ModalComponentOne from '../../lib/Modal/ModalExampleList.svelte';
    import modalComponentTwo from '../../lib/Modal/ModalUrl.svelte';
    import { apertura,toasterAbierto } from '../../lib/stores/storesApertura.js';
    import { iniciaTimer } from '../../lib/stores/storesTimer.js';


	let elapsed = 0;
	let duration = 5000;
	let interval:any;
	let timerPregunta:any = 0;
	let ayudas = 0;

  interface Timer {
    id: any;
    elapsed: number;
	isRunning: boolean;
}

export const timers: Timer[] = [];

function startTimerPreguntas(index: number) {
    if (!timers[index] || !timers[index].isRunning) {
        const newTimer: Timer = {
            id: setInterval(() => {
                // Your timer logic here
                // For example, incrementing elapsed time
                timers[index].elapsed += 100;
                
            }, 100),
            elapsed: timers[index] ? timers[index].elapsed : 0,
            isRunning: true,
        };
        timers[index] = newTimer;
    }
}

function stopTimerPreguntas(index: number) {
    if (timers[index]) {
        clearInterval(timers[index].id);
        timers[index].isRunning = false;
    }
}

function resetTimerPreguntas(index: number) {
    if (timers[index]) {
        clearInterval(timers[index].id);
        timers[index].elapsed = 0;
        timers[index].isRunning = false;
    }
}


function resumeTimerPreguntas(index: number) {
    if (timers[index] && !timers[index].isRunning) {
        const resumedTimer: Timer = {
            id: setInterval(() => {
                timers[index].elapsed += 100;
                
            }, 100),
            elapsed: timers[index].elapsed,
            isRunning: true,
        };
        timers[index] = resumedTimer;
    }
}


onDestroy(() => {
    timers.forEach((timer) => {
        clearInterval(timer.id);
    });
    timers.length = 0;
});

	function startTimer() {
		
		interval = setInterval(() => {
			elapsed += 100;
		
		}, 100);
	}

	function stopTimer() {
		clearInterval(interval);
		interval = null;
		
	}
	function resetTimer() {
		clearInterval(interval);
		interval = null;
		elapsed = 0;
  	}

	

	onDestroy(() => {
		clearInterval(interval);
	});

	export let parent: SvelteComponent;
	const toastStore = getToastStore();
	const drawerStore = getDrawerStore();
    const modalStore = getModalStore();
	const modalRegistry: Record<string, ModalComponent> = {

		modalComponentOne: { ref: ModalComponentOne },
		modalComponentTwo: { ref: modalComponentTwo }
	}
	let flagApertura = false;
	let flagToast = false;
	toasterAbierto.subscribe(value => {
		flagToast = value; // cambiar luego
		//flagToast = false;
		
	});

	apertura.subscribe(value => {
		flagApertura = value;
		
	});

	let flagTimer = false;
	iniciaTimer.subscribe(value => {
		flagTimer = value;
		if(flagTimer){
			startTimer();
			startTimerPreguntas(0);
		}else{
			
			resetTimer();
			resetTimerPreguntas(0);
			
			
		}
	});
		

		
	
	
	export let data;
	let timer = false;
	let visible: boolean = true;
	let array = data.item.response;
	let userId = data.item.userData;
	let nivel = 1;
	let materiaid = '';
	let respuesta = '';
	let flag = false;
	let arrayPreguntas = [{pregunta: '', respuestas: [{
                    "correcto": "false",
                    "res": "A) El principio holográfico es un principio de la óptica que describe cómo se crean las imágenes tridimensionales en una placa fotográfica.",
                    "id": "preg2"
                }],"ayuda": "La respuesta correcta se refiere a cómo se mueve un objeto en una línea recta sin cambios de dirección.",
            "videourl": "https://www.youtube.com/embed/dZckH_13Urc",
            "correcta": 3}];
	let index = 0;
	let mensaje = '';
	let groupRespuestas: any[] = [];
	
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
function modalAyuda(flag:boolean,mensaje:string):void{
	const modal: ModalSettings = {
			type: 'alert',
			body: mensaje,
			buttonTextCancel: 'Terminar',
			
		};
		modalStore.trigger(modal);
}

function modalurl(flag:boolean,url:string){
	
	if (flag) {
		const modalurl: ModalSettings ={
	type: 'component',
	component: 'modalComponentTwo',
	meta: url,
	};
	
	modalStore.trigger(modalurl);
	}
	
}


const modal: ModalSettings = {
	type: 'component',
	component: 'modalComponentOne',
	title:"Tutor inteligente",
	body: "Favor de seleccionar una materia",
	meta: array,
	response: (materia) => {
	if(materia === undefined || materia === false){
		window.location.href = "/";
	}else{

		triggerStyled();

		materiaid = materia.id;
		fetch("http://localhost:8000/nivelmateria/"+materiaid+"/"+userId, {
			method: 'GET',
			headers: {
			'Content-Type': 'application/json',
			// Add other headers if needed
			}
			
      	})
		.then((response) => response.json())
		.then((data) => {
			nivel = data.response[0].nivel;
			fetch("http://localhost:8000/preguntas/"+materiaid+"/"+nivel, {
				method: 'GET',
				headers: {
				'Content-Type': 'application/json',
				// Add other headers if needed
				}
			})
			.then((response) => response.json())
			.then((data) => {
				arrayPreguntas = data.preguntas;
				timer = true;
				resetTimer();
				startTimer();
				resetTimerPreguntas(0);
				startTimerPreguntas(0);
			}).catch((error) => {
				console.error('Error fetching preguntas:', error);
				// Handle errors if necessary
			});
			flag = true;
			
           
        }).catch((error) => {
            console.error('Error fetching niveles:', error);
            // Handle errors if necessary
        });
		
	}
	}

};
function toast(mensaje:any){
	const t: ToastSettings = {
	message: mensaje,
	timeout: 10000
	};
	toastStore.trigger(t);
}


modalStore.trigger(modal);

let locked = true;

function onNextHandler(e: CustomEvent): void {
	
	index = (e.detail.step);


	timerPregunta = timers[e.detail.step].elapsed;
	
	stopTimerPreguntas(index);
	startTimerPreguntas(index+1);
	timerPregunta = timers[e.detail.step].elapsed;
	groupRespuestas[e.detail.step] = {res: respuesta, timer: timerPregunta };
	
	

	if (groupRespuestas[index+1] != undefined && groupRespuestas[index+1] != false && groupRespuestas[index+1] != '')  {
		respuesta = groupRespuestas[index+1].res;
	}else{
		respuesta = '';
	}
	
	
}
function onBackHandler(e: CustomEvent): void {
	index = (e.detail.step);
	timerPregunta = timers[e.detail.step].elapsed;
	stopTimerPreguntas(index);
	startTimerPreguntas(index-1);

	if(respuesta != undefined && respuesta != ''){
		groupRespuestas[index] = {res: respuesta, timer: timerPregunta };
	}
	
	if (groupRespuestas[(index-1)] != undefined && groupRespuestas[(index-1)] != false && groupRespuestas[(index-1)] != ''){
		respuesta = groupRespuestas[(index-1)].res;
	}else{
		respuesta = '';
	}
	
}

	function onCompleteHandler(e: CustomEvent): void {
		
		index = (e.detail.step);
		timerPregunta = timers[e.detail.step].elapsed;

		groupRespuestas[e.detail.step] = {res: respuesta, timer: timerPregunta };

		

		for (let index = 0; index < groupRespuestas.length; index++) {
			if(groupRespuestas[index].res === undefined || groupRespuestas[index].res === false || groupRespuestas[index].res === ''){
				return toast('Prgunta #'+(index+1)+' esta sin responder');
				
			}
			
		}
		
		
			
		
		
		mensaje = 'Terminastes!!';
		visible = true;
		stopTimer();
		stopTimerPreguntas(index);


		toast(mensaje);
		fuzzy();

	
	}

	function fuzzy(){
		let numCorrectas = contarRespuestas();
		let nivelFinal = 0;
		let tiempo = elapsed/1000;
		let json = {
			"consecuencia": "nivel",
			"input": [
				{
					"nombre": "tiempo",
					"valor": tiempo
				},
				{
					"nombre": "respuesta",
					"valor": numCorrectas
				},
				{
					"nombre": "ayuda",
					"valor": ayudas
				}
			]
		};

		fetch("http://localhost:8000/fuzzy", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(json),
})
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        nivelFinal = data;
        toast("¡Felicidades! Tu nivel es: " + nivelFinal);

        // Second fetch call
        const secondJson = {
            "nivel": nivelFinal,
            "idusuario": userId,
            "materia": materiaid
        };

        return fetch("http://localhost:8000/guardarnivel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(secondJson),
        });
		})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(() => {
			toast("Datos guardados correctamente");
			setTimeout(() => {
				window.location.href = "/";
			}, 5000);
			
		})
		.catch(error => {
			console.error('Error:', error);
		});


	}
	function contarRespuestas(){
		let contador = 0;
		for (let index = 0; index < groupRespuestas.length; index++) {
			if(arrayPreguntas[index].respuestas[(arrayPreguntas[index].correcta-1)] == groupRespuestas[index].res){
				contador++;
			}
			
		}
		return contador;
	}

</script>
  <Modal components={modalRegistry} />
 {#if flagTimer && timer}
  
<div class="text-right">
	<h1 class="h1"><span class="bg-gradient-to-br from-pink-500 to-violet-500 bg-clip-text text-transparent box-decoration-clone"> {(elapsed / 1000).toFixed(1)}s </span></h1>
</div>
 {/if} 
<br>
<br>
<br>
{#if flag }
  <div class="max-w-screen-lg h-5 mx-auto">
	<Stepper stepTerm='Pregunta' buttonBackLabel ='← Anterior' buttonNextLabel='Siguiente →' buttonCompleteLabel='Terminar' on:next={onNextHandler} on:back={onBackHandler} on:complete={onCompleteHandler}>

		{#each arrayPreguntas as index }
			<Step locked={flagToast}>
				<svelte:fragment slot="header">{index.pregunta}</svelte:fragment>
				<ListBox>
					{#if flag}
						{#each index.respuestas as item}
							<ListBoxItem bind:group={respuesta} name={item.id} value={item} >{item.res}</ListBoxItem>
						{/each}
					{/if}
				</ListBox>
				{#if flagApertura}
					<footer class=" ">
						<button class="btn bg-gradient-to-br variant-gradient-tertiary-primary" on:click={() => {modalAyuda(true,index.ayuda); ayudas++;}}>Ayuda</button>
						<button class="btn bg-gradient-to-br variant-gradient-secondary-tertiary" on:click={() => {modalurl(true,index.videourl); ayudas++}} >Video</button>
					</footer>
				{/if}
			</Step> 
		{/each}
		
	</Stepper>
	</div>
	{/if}

