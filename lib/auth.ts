import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";

import prismadb from "@/lib/db";
import { transporter } from "@/lib/mail";
import { render } from "@react-email/render";
import { NewUserEmail } from "@/components/email/new-user";
import { ActivationLink } from "@/components/email/activation";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prismadb),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET!,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const user = await prismadb.user.findUnique({
          where: {
            email: identifier,
          },
          select: {
            emailVerified: true,
          },
        });

        const html = !user?.emailVerified
          ? render(NewUserEmail({ url }))
          : render(ActivationLink({ url }));

        const mailOptions = {
          from: provider.from as string,
          to: identifier,
          subject: "Verification of Email",
          html,
        };
        try {
          await transporter.sendMail(mailOptions);
          console.log("Message Sent");
        } catch (err) {
          console.log("ERROR while sending");
        }
      },
    }),
  ],
  callbacks: {
    // runs after jwt callback
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await prismadb.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        if (user) {
          token.id = user?.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
  },
};
