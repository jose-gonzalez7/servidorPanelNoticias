#!/bin/bash

# -------------------------------
# Configuración
# -------------------------------
API_URL="http://localhost:3000/api"
EMAIL="admin@gmail.com"
PASSWORD="12345678"

# Datos de la nueva publicación
PUB_ID="pub_010"
PUB_TITLE="Reunión de Profesores"
PUB_BODY="Se realizará una reunión general de profesores en el aula magna."
PUB_CATEGORY="cat_03"   # Asegúrate de que esta categoría exista
PUB_START_DATE="2025-11-06"
PUB_END_DATE="2025-11-07"
PUB_PRIORITY="alta"
PUB_ATTACHMENTS="reunion.pdf"
PUB_TAGS="reunion,profesores"

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

# # -------------------------------
# # 2️⃣ Crear nueva publicación
# # -------------------------------
# echo "Creando nueva publicación..."
# CREATE_RESPONSE=$(curl -s -X POST "$API_URL/publicaciones" \
#   -H "Authorization: Bearer $TOKEN" \
#   -H "Content-Type: application/json" \
#   -d "{
#         \"id_publicacion\": \"$PUB_ID\",
#         \"titulo\": \"$PUB_TITLE\",
#         \"cuerpo\": \"$PUB_BODY\",
#         \"id_categoria\": \"$PUB_CATEGORY\",
#         \"fecha_inicio\": \"$PUB_START_DATE\",
#         \"fecha_fin\": \"$PUB_END_DATE\",
#         \"prioridad\": \"$PUB_PRIORITY\",
#         \"adjuntos\": \"$PUB_ATTACHMENTS\",
#         \"etiquetas\": \"$PUB_TAGS\"
#       }")

# echo "Respuesta al crear publicación:"
# echo $CREATE_RESPONSE | jq

# -------------------------------
# 3️⃣ Solicitar lista de publicaciones
# -------------------------------
echo "Solicitando lista de publicaciones..."
curl -s -X GET "$API_URL/publicaciones" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  | jq

# # -------------------------------
# # 4️⃣ Modificar la publicación creada
# # -------------------------------
# echo "Modificando la publicación creada..."
# MODIFY_RESPONSE=$(curl -s -X PUT "$API_URL/publicaciones/$PUB_ID" \
#   -H "Authorization: Bearer $TOKEN" \
#   -H "Content-Type: application/json" \
#   -d "{
#         \"nuevoTitulo\": \"Reunión General de Profesores\",
#         \"cuerpo\": \"Se realizará la reunión general de profesores en el aula magna a las 10:00.\"
#       }")

# echo "Respuesta al modificar publicación:"
# echo $MODIFY_RESPONSE | jq

# # -------------------------------
# # 5️⃣ Solicitar lista de publicaciones actualizada
# # -------------------------------
# echo "Solicitando lista de publicaciones actualizada..."
# curl -s -X GET "$API_URL/publicaciones" \
#   -H "Authorization: Bearer $TOKEN" \
#   -H "Content-Type: application/json" \
#   | jq

# # -------------------------------
# # 6️⃣ Borrar la publicación creada
# # -------------------------------
# echo "Borrando la publicación creada..."
# DELETE_RESPONSE=$(curl -s -X DELETE "$API_URL/publicaciones/$PUB_ID" \
#   -H "Authorization: Bearer $TOKEN" \
#   -H "Content-Type: application/json")

# echo "Respuesta al borrar publicación:"
# echo $DELETE_RESPONSE | jq

# # -------------------------------
# # 7️⃣ Solicitar lista de publicaciones final
# # -------------------------------
# echo "Solicitando lista de publicaciones final..."
# curl -s -X GET "$API_URL/publicaciones" \
#   -H "Authorization: Bearer $TOKEN" \
#   -H "Content-Type: application/json" \
#   | jq

# echo "✅ Script de publicaciones finalizado."
