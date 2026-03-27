import { google } from "googleapis";

// Autenticación Server-to-Server mediante Service Account (JWT)
// Protege el acceso evitando exponer credenciales al cliente.
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: [
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive.readonly"
    ],
});

export const driveClient = google.drive({ version: "v3", auth });

// Carpeta principal de subidas de la plataforma
export const MAIN_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;
