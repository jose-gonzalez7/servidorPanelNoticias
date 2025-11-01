#!/bin/bash

# -------------------------------
# Configuración
# -------------------------------
API_URL="http://localhost:3000/api"
EMAIL="admin@gmail.com"
PASSWORD="12345678"

# Datos del nuevo usuario
NEW_USER_NAME="Juan Pérez"
NEW_USER_EMAIL="juanperez@gmail.com"
NEW_USER_PASSWORD="123456"
NEW_USER_ROLE="usuario"

# -------------------------------
# 1️⃣ Login y obtener token
# -------------------------------
echo "Haciendo login..."
RESPONSE=$(curl -s -X POST "$API_URL/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\", \"password\":\"$PASSWORD\"}")

# Extraer el token usando jq
TOKEN=$(echo $RESPONSE | jq -r '.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "Error: no se obtuvo token. Respuesta del servidor:"
  echo $RESPONSE
  exit 1
fi

echo "✅ Token obtenido correctamente."

# -------------------------------
# 2️⃣ Crear nuevo usuario
# -------------------------------
echo "Creando nuevo usuario..."
CREATE_RESPONSE=$(curl -s -X POST "$API_URL/usuarios" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
        \"nombre\": \"$NEW_USER_NAME\",
        \"email\": \"$NEW_USER_EMAIL\",
        \"contraseña\": \"$NEW_USER_PASSWORD\",
        \"rol\": \"$NEW_USER_ROLE\"
      }")

echo "Respuesta al crear usuario:"
echo $CREATE_RESPONSE | jq

# -------------------------------
# 3️⃣ Solicitar lista de usuarios (actualizada)
# -------------------------------
echo "Solicitando lista de usuarios actualizada..."
curl -s -X GET "$API_URL/usuarios/admin" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  | jq

# -------------------------------
# 4️⃣ Modificar el usuario creado
# -------------------------------
echo "Modificando el usuario creado..."
MODIFY_RESPONSE=$(curl -s -X PUT "$API_URL/usuarios" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
        \"email\": \"$NEW_USER_EMAIL\",
        \"nuevoNombre\": \"Juan P.\"
      }")

echo "Respuesta al modificar usuario:"
echo $MODIFY_RESPONSE | jq

# -------------------------------
# Solicitar lista de usuarios (actualizada)
# -------------------------------
echo "Solicitando lista de usuarios actualizada..."
curl -s -X GET "$API_URL/usuarios/admin" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  | jq

# -------------------------------
# 5 solicitar borrado del usuario creado
# -------------------------------
echo "Borrando el usuario creado..."
DELETE_RESPONSE=$(curl -s -X DELETE "$API_URL/usuarios" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
        \"email\": \"$NEW_USER_EMAIL\"
      }")
echo "Respuesta al borrar usuario:"
echo $DELETE_RESPONSE | jq

# -------------------------------
# 6 Solicitar lista de usuarios (actualizada)
# -------------------------------
echo "Solicitando lista de usuarios actualizada..."
curl -s -X GET "$API_URL/usuarios/admin" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  | jq

echo "✅ Script finalizado."

