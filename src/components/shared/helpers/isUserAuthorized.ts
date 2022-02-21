export function isUserAuthorized(): boolean {
  const userId = localStorage.getItem('userId');
  const isUserAuthenticated =
    localStorage.getItem('userMessage') === 'Authenticated';

  return !!(userId && isUserAuthenticated);
}
