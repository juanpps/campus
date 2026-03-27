import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
    // 1. Verificación de Seguridad Zero-Trust (Vercel Cron Header)
    const authHeader = request.headers.get('authorization');
    if (
        process.env.NODE_ENV === 'production' &&
        authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
        console.warn('[Cron] Ejecución denegada: Secret inválido o ausente.');
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const ahora = new Date();

        // 2. Query a Firebase Admin
        const anunciosRef = adminDb.collection('anuncios');
        const snapshot = await anunciosRef.where('fecha_expiracion', '<=', ahora).get();

        if (snapshot.empty) {
            return NextResponse.json({
                success: true,
                message: 'No existen anuncios caducados.',
                deletedCount: 0
            });
        }

        // 3. Destrucción en Batch para optimizar cuotas (Firebase Admin soporta hasta 500 por lote)
        const batch = adminDb.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();

        console.log(`[Cron] Limpieza exitosa: ${snapshot.size} anuncios expirados purgados.`);
        return NextResponse.json({
            success: true,
            deletedCount: snapshot.size,
            timestamp: ahora.toISOString()
        });

    } catch (error) {
        console.error('[Cron] Error masivo durante la purga de anuncios:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
