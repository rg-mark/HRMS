import  db  from '@src/lib/database';
import bcrypt from 'bcryptjs';
import { NextApiRequest } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { IncomingMessage } from 'http';
import { parse } from 'cookie';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn:'/sign-in',

  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
  
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null
  
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ]

}

interface User {
    id: number;
    username: string;
    password: string;
  }

interface Session {
    id: number;
    user_id: number;
    session_token: string;
    expires: Date;
  }

  export async function findUserByUsername(username: string): Promise<User | null> {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = (rows as User[])[0];
    return user || null;
  }

  export async function verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
  
  export async function createSession(userId: number): Promise<{ sessionToken: string; expires: Date }> {
    const sessionToken = uuidv4();
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 1 week
    await db.query('INSERT INTO sessions (user_id, session_token, expires) VALUES (?, ?, ?)', [userId, sessionToken, expires]);
    return { sessionToken, expires };
  }
  
  export async function findSessionByToken(sessionToken: string): Promise<Session | null> {
    const [rows] = await db.query('SELECT * FROM sessions WHERE session_token = ?', [sessionToken]);
    const session = (rows as Session[])[0];
    return session || null;
  }
  
  export async function deleteSession(sessionToken: string): Promise<void> {
    await db.query('DELETE FROM sessions WHERE session_token = ?', [sessionToken]);
  }

  export async function getSession(req: IncomingMessage): Promise<Session | null> {
    const cookies = parse(req.headers.cookie || '');
    const sessionToken = cookies.sessionToken;
    if (!sessionToken) {
      return null;
    }
    return await findSessionByToken(sessionToken);
}