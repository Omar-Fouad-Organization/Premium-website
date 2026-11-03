// Same-origin Laravel API. Authentication lives in an HttpOnly session cookie.
export interface User { id: number; email: string; name: string; role: string }
export interface Session { user: User }
type ApiError = { message: string };
type Result = { data: any; error: ApiError | null; count?: number };
let csrfToken: string | null = null;
let csrfRequest: Promise<string> | null = null;

async function csrf(): Promise<string> {
  if (csrfToken) return csrfToken;
  csrfRequest ??= fetch('/api/auth/csrf', { credentials: 'same-origin', headers: { Accept: 'application/json' } })
    .then(async response => {
      if (!response.ok) throw new Error('Could not initialize the API session.');
      const body = await response.json();
      return csrfToken = body.token;
    }).finally(() => { csrfRequest = null; });
  return csrfRequest;
}

export async function request(path: string, method = 'GET', body?: unknown, retry = true): Promise<Result> {
  try {
    if (method === 'GET' && path.startsWith('/resources/') && window.location.hash.startsWith('#/admin/')) path=path.replace('/resources/','/admin/resources/');
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (method !== 'GET') headers['X-CSRF-TOKEN'] = await csrf();
    if (body && !(body instanceof FormData)) headers['Content-Type'] = 'application/json';
    const response = await fetch(`/api${path}`, {
      method, headers, credentials: 'same-origin',
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    });
    if (response.status === 419 && retry) {
      csrfToken = null;
      return request(path, method, body, false);
    }
    const result = await response.json();
    if (!response.ok) return { data: null, error: { message: result.message || 'Request failed.' } };
    return { data: Object.prototype.hasOwnProperty.call(result, 'data') ? result.data : result, count: result.count, error: null };
  } catch (error) {
    return { data: null, error: { message: error instanceof Error ? error.message : 'API unavailable.' } };
  }
}

// A small query builder keeps all existing React editors on one HTTP contract.
// Laravel independently validates resources, fields, filters and permissions.
class ResourceQuery implements PromiseLike<Result> {
  private method = 'GET';
  private payload: unknown;
  private params = new URLSearchParams();
  private filters: { column: string; operator: string; value: unknown }[] = [];
  private orders: { column: string; ascending: boolean }[] = [];
  constructor(private resource: string) {}
  select(columns = '*', options?: { count?: string }) { this.params.set('columns', columns); if (options?.count) this.params.set('count', 'true'); return this; }
  eq(column: string, value: unknown) { this.filters.push({ column, operator: 'eq', value }); return this; }
  neq(column: string, value: unknown) { this.filters.push({ column, operator: 'neq', value }); return this; }
  in(column: string, value: unknown[]) { this.filters.push({ column, operator: 'in', value }); return this; }
  order(column: string, options?: { ascending?: boolean }) { this.orders.push({ column, ascending: options?.ascending !== false }); return this; }
  limit(value: number) { this.params.set('limit', String(value)); return this; }
  single() { this.params.set('single', 'true'); return this; }
  insert(data: unknown) { this.method = 'POST'; this.payload = data; return this; }
  update(data: unknown) { this.method = 'PATCH'; this.payload = data; return this; }
  delete() { this.method = 'DELETE'; return this; }
  upsert(data: unknown, options?: { onConflict?: string }) { this.method = 'PUT'; this.payload = data; if (options?.onConflict) this.params.set('conflict', options.onConflict); return this; }
  then<TResult1 = Result, TResult2 = never>(onfulfilled?: ((value: Result) => TResult1 | PromiseLike<TResult1>) | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null): PromiseLike<TResult1 | TResult2> {
    this.params.set('filters', JSON.stringify(this.filters));
    this.params.set('orders', JSON.stringify(this.orders));
    return request(`/resources/${encodeURIComponent(this.resource)}?${this.params}`, this.method, this.method === 'GET' ? undefined : { records: this.payload }).then(onfulfilled, onrejected);
  }
}

const listeners = new Set<(event: string, session: Session | null) => void>();
const uploadedUrls = new Map<string, string>();
export const api = {
  from: (resource: string) => new ResourceQuery(resource),
  auth: {
    async getSession() {
      const result = await request('/auth/me');
      return { data: { session: result.data?.user ? { user: result.data.user } as Session : null } };
    },
    onAuthStateChange(callback: (event: string, session: Session | null) => void) {
      listeners.add(callback);
      return { data: { subscription: { unsubscribe: () => { listeners.delete(callback); } } } };
    },
    async signInWithPassword(credentials: { email: string; password: string }) {
      const result = await request('/auth/login', 'POST', credentials);
      if (!result.error) {
        csrfToken = null;
        listeners.forEach(callback => callback('SIGNED_IN', { user: result.data.user }));
      }
      return result;
    },
    async signOut() {
      const result = await request('/auth/logout', 'POST');
      if (result.error) throw new Error(result.error.message);
      csrfToken = null;
      listeners.forEach(callback => callback('SIGNED_OUT', null));
    },
  },
  storage: {
    from: (bucket: string) => ({
      async upload(path: string, file: File, _options?: unknown) {
        const form = new FormData(); form.append('file', file); form.append('bucket', bucket);
        const result = await request('/uploads', 'POST', form);
        if (!result.error) uploadedUrls.set(`${bucket}/${path}`, result.data.url);
        return result;
      },
      getPublicUrl(path: string) { return { data: { publicUrl: uploadedUrls.get(`${bucket}/${path}`) || '' } }; },
    }),
  },
  users: { create: (body: { email: string; password: string }) => request('/admin/users', 'POST', body) },
};
