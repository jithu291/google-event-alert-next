
async function fetchApi(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return res.json();
}

export const api = {
  updatePhone: (phoneNumber: string) =>
    fetchApi('/api/user/update-phone', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    }),

  getProfile: () => fetchApi('/api/user/getProfile'),
  getCalendarEvents: () => fetchApi('/api/calendar/getEvents'),

};

