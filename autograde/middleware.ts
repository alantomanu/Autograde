import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    // Add routes that need authentication
    "/dashboard/:path*",
    "/evaluation/:path*",
    // Add more protected routes as needed
  ],
};