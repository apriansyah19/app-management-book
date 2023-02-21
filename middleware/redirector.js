export default async function ({
  app,
  redirect,
  route,
  next
}) {
  const cookieRes = await app.$cookies.get('libraryState')
  if (cookieRes) {
    if (route.path === '/register' || route.path === '/login' || route.path === '/') {
      redirect('/managementBook')
    }
  } else if (route.path === '/managementBook' || route.path === '/') {
    return redirect('/login')
  }
}