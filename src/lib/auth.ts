// utils/auth.ts

export async function checkLoginStatus() {
  const res = await fetch('/api/login', {
    method: 'GET',
    credentials: 'include',
  });

  if (res.ok) {
    const { loggedIn } = await res.json();
    return loggedIn;
  }

  return false;
}
