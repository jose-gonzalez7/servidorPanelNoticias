#!/bin/bash

# -------------------------------
# Configuración
# -------------------------------
API_URL="http://localhost:3000/api"
EMAIL="admin@gmail.com"
PASSWORD="12345678"

# ID de la publicación a enviar por email
PUB_ID="pub_003"

# Lista de destinatarios separados por coma
DESTINATARIOS=("180abromotor@gmail.com" "jgonzalezroman7@gmail.com")

# -------------------------------
# 1️⃣ Login y obtener token
# -------------------------------
echo "Haciendo login..."
RESPONSE=$(curl -s -X POST "$API_URL/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\", \"password\":\"$PASSWORD\"}")

TOKEN=$(echo $RESPONSE | jq -r '.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "Error: no se obtuvo token. Respuesta del servidor:"
  echo $RESPONSE
  exit 1
fi

echo "✅ Token obtenido correctamente."

# -------------------------------
# 2️⃣ Enviar email de publicación
# -------------------------------
echo "Enviando email de la publicación $PUB_ID..."
EMAIL_RESPONSE=$(curl -s -X POST "$API_URL/publicaciones/emailPublicaciones" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
        \"id_publicacion\": \"$PUB_ID\",
        \"destinatarios\": $(printf '%s\n' "${DESTINATARIOS[@]}" | jq -R . | jq -s .)
      }")

echo "Respuesta del servidor al enviar email:"
if echo "$EMAIL_RESPONSE" | jq empty 2>/dev/null; then
  echo "$EMAIL_RESPONSE" | jq
else
  echo "$EMAIL_RESPONSE"
fi

echo "✅ Script de envío de email finalizado."
