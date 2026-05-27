import type { PageLoad } from './$types';
import { createExampleItemsApi } from '$lib/api/client';

export const load: PageLoad = async ({ fetch }) => {
	const items = await createExampleItemsApi(fetch).list();
	return { items };
};
