<script lang="ts">
import { focusTrap } from '@skeletonlabs/skeleton';
import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';

const toastStore = getToastStore();
let isFocused = false;

let user = '';
let contra = '';
export let form;

function toastBasic(): void {
		const t: ToastSettings = {
			message:
				// cspell:disable-next-line
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio consequuntur, blanditiis ducimus perspiciatis minima odit repellat rem iste incidunt laborum amet culpa officia maiores eum qui asperiores.',
			autohide: true
		};
		toastStore.trigger(t);
	}
</script>
<br>
<br>
<br>
<div class="max-w-screen-sm mx-auto">
    <form class=" card p-4 text-token space-y-4" use:focusTrap={isFocused}  action="?/login" method="POST">
        {#if form?.missing}<p class="error">Favor de verificar los datos</p>{/if}
	    {#if form?.incorrect}<p class="error">Credenciales incorrectas, intente de nuevo</p>{/if}
        <label class="label">
            <span>Usuario</span>
            <input bind:value={user} name="usuario" class="input" type="text" placeholder="Escribir usuario..." />
        </label>
        <label class="label">
            <span>Contraseña</span>
            <input bind:value={contra} name="contrasena" class="input" type="password" placeholder="Escribir contraseña" />
        </label>
        <div class="text-right">
            <button class="btn variant-filled" >Aceptar</button>
        </div>
    </form>
</div>
