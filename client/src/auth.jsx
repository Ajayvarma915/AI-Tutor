import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import axios, { AxiosError } from "axios";
import { redirect } from "next/dist/server/api-utils";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async signIn({ user, account }) {
      try {
        const payload = {
          email: user.email,
          name: user.name,
          image:user.image,
          oauth_id: account?.providerAccountId,
          provider: account?.provider,
        };
        console.log(payload);
      } catch (err) {
        if (err instanceof AxiosError) {
          return redirect(`/auth/error?message=${err.message}`);
        }
        return redirect(
          "/auth/error?message=something went wrong please try again later"
        );
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, user, token }) {
      session.user = token.user;
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
});
