import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&access_type=offline&prompt=consent&scope=openid+email+profile+https://www.googleapis.com/auth/photoslibrary.readonly",
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        console.log("[auth] stored accessToken in JWT:", !!account.access_token);
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      console.log("[auth] session accessToken present:", !!session.accessToken);
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
});

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}
