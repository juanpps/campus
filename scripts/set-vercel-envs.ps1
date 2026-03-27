# Script de Sincronización de Variables de Entorno para Vercel - Campus Raptor
$envs = @(
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
    "FIREBASE_ADMIN_PROJECT_ID",
    "FIREBASE_ADMIN_CLIENT_EMAIL",
    "FIREBASE_ADMIN_PRIVATE_KEY",
    "GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL",
    "GOOGLE_DRIVE_SERVICE_ACCOUNT_PRIVATE_KEY",
    "NEXT_PUBLIC_FIREBASE_VAPID_KEY"
)

# Leer .env.local y extraer valores
$envLocal = Get-Content .env.local -Raw
foreach ($name in $envs) {
    if ($envLocal -match "$name=(.*)") {
        $value = $matches[1].Trim().Trim('"').Trim("'")
        Write-Host "Configurando $name en Vercel..."
        # Usamos pipe para evitar problemas con comillas y saltos de línea en el valor
        echo "$value" | npx vercel env add $name production
    }
}
