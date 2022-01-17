import NextAuth from 'next-auth/next';
import Credentials from 'next-auth/providers/credentials';
import axios from 'axios';

export default NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        auth: { label: 'auth', type: 'text', placeholder: 'Email/Username' },
        password: {
          label: 'password',
          type: 'password',
          placeholder: 'Password',
        },
      },
      async authorize(credentials) {
        let user = {};
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in`,
            credentials
          );
          const data = await res.data;
          user = data;
        } catch (error) {
          user = null;
          throw new Error('Email or Username or Password is incorrect');
        }
        if (user) {
          return {
            token: user.token,
            username: user.username,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      return { ...token, ...user };
    },
    session: async ({ session, token, user }) => {
      session.user = token;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
  secret: process.env.SECRET,
  jwt: {
    secret: process.env.SECRET,
  },
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
});
