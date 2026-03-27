import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

export async function POST(request: NextRequest) {
    try {
        const { idToken } = await request.json();

        if (!idToken) {
            return NextResponse.json({ error: "No idToken provided" }, { status: 400 });
        }

        const decodedToken = await adminAuth.verifyIdToken(idToken);

        // Verificamos si el usuario fue revocado
        if (new Date().getTime() / 1000 - decodedToken.auth_time < 5 * 60) {
            // 14 days session
            const expiresIn = 60 * 60 * 24 * 14 * 1000;
            const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

            const response = NextResponse.json({ status: "success" });
            response.cookies.set("__session", sessionCookie, {
                maxAge: expiresIn,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                sameSite: "lax",
            });

            return response;
        }

        return NextResponse.json({ error: "Recent sign-in required" }, { status: 401 });

    } catch (error) {
        console.error("Session creation error", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE() {
    const response = NextResponse.json({ status: "success" });
    response.cookies.delete("__session");
    return response;
}
