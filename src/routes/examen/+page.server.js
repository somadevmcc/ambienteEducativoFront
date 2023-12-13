import { redirect } from '@sveltejs/kit';

export async function load({ fetch, params,cookies }) {
    if (!cookies.get('logged_in')) {
		throw redirect(303, '/login');
	}

    const res = await fetch("http://localhost:8000/materias");
	const item = await res.json();
	
    const userDataCookie = cookies.get('user_id'); // Replace 'user_data' with your specific cookie name
    item.userData = userDataCookie;

	return { item };
}
