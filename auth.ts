import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
    pages: {
        signIn: "/auth/signin",
        error: "/auth/signin",
    },
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials, req){
                const res = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/account/login/`, {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log(res)

                const user = await res.json();


                if (user.message == "success") {

                    return user;
                }
                return null;
            }
        })
    ],
    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.access;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.user.role = token.role;
            return session;
        },
    },
    trustHost: true,
    AUTH_TRUST_HOST: true,
})