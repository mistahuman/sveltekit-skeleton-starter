const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export interface ExampleItem {
	id: string;
	title: string;
	value: number;
	code: string;
	description?: string;
}

export interface CreateExampleItem {
	title: string;
	value: number;
	code: string;
	description?: string;
}

export interface UpdateExampleItem {
	title?: string;
	value?: number;
	code?: string;
	description?: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
	const res = await fetch(`${BASE_URL}${path}`, {
		headers: { 'Content-Type': 'application/json', ...init?.headers },
		...init
	});
	if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
	if (res.status === 204) return undefined as T;
	return res.json();
}

export const exampleItemsApi = {
	list: () => request<ExampleItem[]>('/exampleitems/'),
	get: (id: string) => request<ExampleItem>(`/exampleitems/${id}`),
	create: (payload: CreateExampleItem) =>
		request<ExampleItem>('/exampleitems/', {
			method: 'POST',
			body: JSON.stringify(payload)
		}),
	update: (id: string, payload: UpdateExampleItem) =>
		request<ExampleItem>(`/exampleitems/${id}`, {
			method: 'PATCH',
			body: JSON.stringify(payload)
		}),
	delete: (id: string) => request<void>(`/exampleitems/${id}`, { method: 'DELETE' })
};
