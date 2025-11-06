#!/bin/bash

# -------------------------------
# Configuración
# -------------------------------
API_URL="http://localhost:3000/api"
EMAIL="admin@gmail.com"
PASSWORD="12345678"

# Datos de la nueva categoría
NEW_CATEGORY_ID="C001"
NEW_CATEGORY_NAME="Tecnología"

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
  echo "❌ Error: no se obtuvo token. Respuesta del servidor:"
  echo $RESPONSE
  exit 1
fi

echo "✅ Token obtenido correctamente."

# -------------------------------
# 3️⃣ Listar categorías (actualizada)
# -------------------------------
echo "Solicitando lista de categorías..."
curl -s -X GET "$API_URL/categorias" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  | jq

# -------------------------------
# 2️⃣ Crear nueva categoría
# -------------------------------
echo "Creando nueva categoría..."
CREATE_RESPONSE=$(curl -s -X POST "$API_URL/categorias" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
        \"id_categoria\": \"$NEW_CATEGORY_ID\",
        \"nombre\": \"$NEW_CATEGORY_NAME\"
      }")

echo "Respuesta al crear categoría:"
echo $CREATE_RESPONSE | jq

# -------------------------------
# 3️⃣ Listar categorías (actualizada)
# -------------------------------
echo "Solicitando lista de categorías..."
curl -s -X GET "$API_URL/categorias" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  | jq

# -------------------------------
# 4️⃣ Modificar la categoría creada
# -------------------------------
echo "Modificando la categoría creada..."
MODIFY_RESPONSE=$(curl -s -X PUT "$API_URL/categorias" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
        \"id_categoria\": \"$NEW_CATEGORY_ID\",
        \"nuevoNombre\": \"Tecnología y Ciencia\"
      }")

echo "Respuesta al modificar categoría:"
echo $MODIFY_RESPONSE | jq

# -------------------------------
# 5️⃣ Listar categorías nuevamente
# -------------------------------
echo "Solicitando lista de categorías actualizada..."
curl -s -X GET "$API_URL/categorias" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  | jq

# -------------------------------
# 6️⃣ Eliminar la categoría creada
# -------------------------------
echo "Borrando la categoría creada..."
DELETE_RESPONSE=$(curl -s -X DELETE "$API_URL/categorias" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
        \"id_categoria\": \"$NEW_CATEGORY_ID\"
      }")

echo "Respuesta al borrar categoría:"
echo $DELETE_RESPONSE | jq

# -------------------------------
# 7️⃣ Listar categorías final
# -------------------------------
echo "Solicitando lista de categorías (final)..."
curl -s -X GET "$API_URL/categorias" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  | jq

echo "✅ Script finalizado correctamente."
