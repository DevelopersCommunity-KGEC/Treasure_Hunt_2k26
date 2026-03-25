import "server-only"
import {SignJWT, jwtVerify} from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const key = new TextEncoder().encode(process.env.JWT_SECRET)

const cookie= {
    name : 'session',
    options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    },
    duration: 24*60*60*1000
}
export async function encrypt(payload : any) {
    return new SignJWT(payload)
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('3h')
        .sign(key);
}

export async function decrypt(session : any) {
    try {
        const {payload} = await jwtVerify(session, key, {
            algorithms: ['HS256']
        })
        return payload;
    } catch (error) {
        return null;
    }
}


export async function createSession(data : any) {
    const expires = new Date(Date.now() + cookie.duration);
    const session = await encrypt({data, expires})

    cookies().set(cookie.name, session, {
        ...cookie.options,
        expires,
        sameSite: 'lax',
    });
}

export async function verifySession() {

    const usercookie  = cookies().get(cookie.name)?.value;
    const session = await decrypt(usercookie);

    return session;
}

export async function destroySession() {
    cookies().delete(cookie.name);
    redirect('/');
}
