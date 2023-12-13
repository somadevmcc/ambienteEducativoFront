import { redirect } from '@sveltejs/kit';
export async function load({ cookies,url }) {
    console.log(url);
	if (cookies.get('logged_in')) {
		throw redirect(303, `/examen`);
	}
}
export const actions = {
  login: async ({ request, cookies, url }) => {


    try {
      const formData = await request.formData();
    
        if(formData.get('usuario').length == 0 || formData.get('contrasena').length == 0){
            return {success: false,
                missing: true,
                incorrect: false};
        }

      const response = await fetch("http://localhost:8000/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add other headers if needed
        },
        body: JSON.stringify({
            usuario: formData.get('usuario'),
            contrasena: formData.get('contrasena')
          })
      });

      const data = await response.json();
      
      if (Object.keys(data).length !== 0) {
        cookies.set('logged_in', 'true', { path: '/' });
        cookies.set('user_id',data.id);
        cookies.set('user_rol',data.rol);
        cookies.set('user_priv',data.privilegio);
        throw redirect(303, '/');
      }
      return {success: false,
        missing: false,
        incorrect: true};
      
    } catch (error) {
     
    }
  },
};