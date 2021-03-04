export default function (context) {
  // eslint-disable-next-line no-console
  console.log('[Middleware] Auth')
  if (!context.store.getters.isAuthenticated) {
    context.redirect('/admin/auth')
  }
}
