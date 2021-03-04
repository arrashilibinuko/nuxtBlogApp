export default function (context) {
  // eslint-disable-next-line no-console
  console.log('[Middleware] Check Auth')
  if (process.client) {
    context.store.dispatch('initAuth', context.req)
  }
}
