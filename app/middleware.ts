// middleware.ts  — place at E:\broke-founders\middleware.ts
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/login',
  },
})

export const config = {
  // Protect these routes — extend this list as you build
  matcher: ['/dashboard/:path*', '/seed/:path*', '/profile/:path*'],
}