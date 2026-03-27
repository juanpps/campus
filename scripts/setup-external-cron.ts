import dotenv from "dotenv";
import readline from "readline";

dotenv.config({ path: ".env.local" });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function setupCron() {
    console.log("🚀 Iniciando configuración de Cron-Job.org (Subagente 2)");

    const CRON_SECRET = process.env.CRON_SECRET;
    if (!CRON_SECRET) {
        console.error("❌ Error: CRON_SECRET no encontrado en .env.local");
        process.exit(1);
    }

    rl.question("🔑 Dame tu API Key gratuita de cron-job.org para proceder: ", async (apiKey) => {
        if (!apiKey) {
            console.error("❌ Error: API Key requerida.");
            process.exit(1);
        }

        const payload = {
            job: {
                url: "https://campus-raptor.vercel.app/api/cron/recordatorio-eventos",
                enabled: true,
                saveResponses: true,
                schedule: {
                    timezone: "UTC",
                    expiresAt: 0,
                    hours: [-1],
                    mdays: [-1],
                    months: [-1],
                    wdays: [-1],
                    minutes: [0, 15, 30, 45],
                },
                requestMethod: 0, // GET
                extendedData: {
                    headers: {
                        Authorization: `Bearer ${CRON_SECRET}`,
                    },
                },
            },
        };

        try {
            const response = await fetch("https://api.cron-job.org/jobs", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("✅ Éxito: Webhook matriculado en cron-job.org");
                console.log("ID del Trabajo:", data.jobId || "Creado");
            } else {
                console.error("❌ Error de la API:", data);
            }
        } catch (error) {
            console.error("❌ Fallo crítico al invocar la API:", error);
        } finally {
            rl.close();
        }
    });
}

setupCron();
