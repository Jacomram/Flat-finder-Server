# 🚀 DEMOSTRACIÓN COMPLETA DE LA API FLAT-FINDER

## 📋 Configuración de Headers para Postman

### Headers para Usuarios Normales:
```
Authorization: Bearer dummy-token-for-testing
x-user-info: {"id": "user123", "role": "user", "email": "test@example.com"}
```

### Headers para Admin:
```
Authorization: Bearer dummy-token-for-testing
x-user-info: {"id": "admin123", "role": "admin", "email": "admin@test.com"}
```

## 🎯 DEMOSTRACIÓN PASO A PASO

### ✅ PASO 1: Registrar un nuevo usuario
**POST** `http://localhost:3000/users/register`
**Headers:** Ninguno (público)
**Body (JSON):**
```json
{
  "name": "Usuario Demo",
  "email": "demo@example.com", 
  "password": "123456",
  "role": "user"
}
```

### ✅ PASO 2: Login con ese usuario
**POST** `http://localhost:3000/users/login`
**Headers:** Ninguno (público)
**Body (JSON):**
```json
{
  "email": "demo@example.com",
  "password": "123456"
}
```
**📝 Nota:** Copia el token retornado (aunque en nuestro demo usamos token dummy)

### ✅ PASO 3: Obtener todos los pisos (GET /flats)
**GET** `http://localhost:3000/flats`
**Headers:**
```
Authorization: Bearer dummy-token-for-testing
x-user-info: {"id": "user123", "role": "user", "email": "demo@example.com"}
```

### ✅ PASO 4: Agregar un piso con ciudad y precio de alquiler
**POST** `http://localhost:3000/flats`
**Headers:**
```
Authorization: Bearer dummy-token-for-testing
x-user-info: {"id": "user123", "role": "user", "email": "demo@example.com"}
```
**Body (JSON):**
```json
{
  "title": "Piso Demo",
  "description": "Hermoso piso para demostración",
  "city": "Madrid",
  "rentPrice": 850,
  "location": "Madrid Centro",
  "bedrooms": 2,
  "bathrooms": 1,
  "available": true
}
```

### ✅ PASO 5: Actualizar el precio de alquiler de ese piso
**PATCH** `http://localhost:3000/flats/FLAT_ID_AQUI`
**Headers:**
```
Authorization: Bearer dummy-token-for-testing
x-user-info: {"id": "user123", "role": "user", "email": "demo@example.com"}
```
**Body (JSON):**
```json
{
  "rentPrice": 950
}
```

### ✅ PASO 6: Eliminar ese piso
**DELETE** `http://localhost:3000/flats/FLAT_ID_AQUI`
**Headers:**
```
Authorization: Bearer dummy-token-for-testing
x-user-info: {"id": "user123", "role": "user", "email": "demo@example.com"}
```

### ✅ PASO 7: Agregar un mensaje a un piso
**POST** `http://localhost:3000/flats/FLAT_ID_AQUI/messages`
**Headers:**
```
Authorization: Bearer dummy-token-for-testing
x-user-info: {"id": "sender123", "role": "user", "email": "sender@example.com"}
```
**Body (JSON):**
```json
{
  "content": "¡Hola! Me interesa mucho este piso. ¿Podríamos agendar una visita?",
  "subject": "Solicitud de visita"
}
```

### ✅ PASO 8: Como propietario del piso, listar todos los mensajes
**GET** `http://localhost:3000/flats/FLAT_ID_AQUI/messages`
**Headers:**
```
Authorization: Bearer dummy-token-for-testing
x-user-info: {"id": "user123", "role": "user", "email": "demo@example.com"}
```

### ❌ PASO 9: Intentar acceder a todos los usuarios con token no-admin (debe dar error)
**GET** `http://localhost:3000/users`
**Headers:**
```
Authorization: Bearer dummy-token-for-testing
x-user-info: {"id": "user123", "role": "user", "email": "demo@example.com"}
```
**Resultado esperado:** `403 Forbidden - Admin privileges required`

### ✅ PASO 10: Acceder a todos los usuarios con token admin (debe funcionar)
**GET** `http://localhost:3000/users`
**Headers:**
```
Authorization: Bearer dummy-token-for-testing
x-user-info: {"id": "admin123", "role": "admin", "email": "admin@test.com"}
```

## 🎯 RESPUESTAS ESPERADAS

### ✅ Éxito (200/201):
- Register: `201 Created`
- Login: `200 OK` con token
- Get flats: `200 OK` con array de pisos
- Add flat: `201 Created` con datos del piso
- Update flat: `200 OK` con piso actualizado
- Add message: `201 Created` con mensaje
- Get messages (owner): `200 OK` con array de mensajes
- Get users (admin): `200 OK` con array de usuarios

### ❌ Errores esperados:
- Get users (non-admin): `403 Forbidden`
- Update/Delete flat (non-owner): `403 Forbidden`
- Missing headers: `401 Unauthorized`

## 🚀 Estado del Servidor:
✅ Servidor corriendo en puerto 3000
✅ Conectado a MongoDB
✅ Todas las rutas configuradas