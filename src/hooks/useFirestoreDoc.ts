"use client";

import { useState, useEffect } from 'react';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

interface FirestoreDocState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

export function useFirestoreDoc<T = DocumentData>(collectionName: string, docId: string | undefined | null) {
    const [state, setState] = useState<FirestoreDocState<T>>({
        data: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        if (!collectionName || !docId) {
            setState({ data: null, loading: false, error: null });
            return;
        }

        const docRef = doc(db, collectionName, docId);

        // onSnapshot gestiona websockets y caché; devuelve una función de unsubscribe
        const unsubscribe = onSnapshot(docRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    setState({ data: { id: docSnap.id, ...docSnap.data() } as T, loading: false, error: null });
                } else {
                    setState({ data: null, loading: false, error: null });
                }
            },
            (error) => {
                console.error(`Error on onSnapshot (${collectionName}/${docId}):`, error);
                setState({ data: null, loading: false, error });
            }
        );

        // Cleanup function: crítica para prevenir memory leaks en PWA re-renders
        return () => unsubscribe();
    }, [collectionName, docId]);

    return state;
}
