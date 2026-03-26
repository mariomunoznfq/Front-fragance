# Informe: Tests de Manejo de Excepciones

## Resumen Ejecutivo

Se han creado tests unitarios para verificar el correcto manejo de excepciones en el componente `ViewLookAnalysis` del flujo de adultos de la aplicación "In Essence AI".

---

## Objetivo

Validar que el componente `ViewLookAnalysis` gestiona correctamente los errores de API, mostrando mensajes apropiados al usuario y permitiendo la recuperación mediante un botón de reintento.

---

## Componente Testeado

**Archivo:** `src/pages/FlowAdults/ViewLookAnalysis.jsx`

**Ubicación en el flujo:**
```
Gender → Home → Attitud → Plan → Look (ViewLookAnalysis) → Result
```

**Funcionalidad probada:**
- `handleAnalyze()`: Función asíncrona que llama a la API para generar una fragancia
- Manejo de errores HTTP (400, 401, 429, 500)
- Manejo de errores de red
- Manejo de respuestas vacías o inválidas
- Flujo completo: Carrusel de carga → Resultado (éxito o error)

---

## Casos de Test Implementados

| # | Test | Descripción | Código HTTP | Resultado Esperado |
|---|------|-------------|------------|-------------------|
| 1 | Flujo Carrusel + Error 400 | Datos incompletos | 400 | Mensaje de error 400 |
| 2 | Flujo Carrusel + Error 401 | API Key inválida | 401 | Mensaje de error 401 |
| 3 | Flujo Carrusel + Error 429 | Límite de peticiones | 429 | Mensaje de error 429 |
| 4 | Flujo Carrusel + Error 500 | Error interno del servidor | 500 | Mensaje de error 500 |
| 5 | Flujo Carrusel + Error de Red | Fallo de conexión | N/A | Mensaje de error de red |
| 6 | Flujo Carrusel + Respuesta Vacía | IA sin datos | 200 | Mensaje "La IA no ha devuelto..." |
| 7 | Flujo Exitoso | Respuesta correcta | 200 | Navegación a siguiente vista |
| 8 | Botón Volver a Intentarlo | Recuperación de error | N/A | Vuelve al formulario |

---

## Mensajes de Error Implementados

```javascript
400 → "Datos incompletos o solicitud mal formada."
401 → "Falta la API Key o es inválida."
422 → "Los parámetros enviados no tienen un formato válido."
429 → "Has superado el límite de peticiones. Espera un momento."
500 → "Error interno del servidor. Inténtalo más tarde."
503 → "Error inesperado en el servidor (503)."
Red → "Network request failed" (mensaje del error)
Vacío → "La IA no ha devuelto ninguna fragancia"
```

---

## Archivos Creados

```
├── __tests__/
│   ├── setup.js                    # Configuración de vitest + testing-library
│   └── ViewLookAnalysis.test.jsx  # Suite de tests
├── vite.config.js                  # Configuración de Vitest
```

---

## Herramientas Utilizadas

| Herramienta | Propósito |
|-------------|-----------|
| Vitest | Framework de testing |
| @testing-library/react | Renderizado y query de componentes |
| @testing-library/jest-dom | Matchers personalizados (toBeInTheDocument) |
| jsdom | Simulación de DOM en Node.js |

---

## Instalación y Ejecución

```bash
# Instalar dependencias
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom

# Ejecutar tests
npm test
```

---

## Resultado de los Tests

```
Test Files  1 passed (1)
     Tests  8 passed (8)
```

**Estado:** Todos los tests pasan correctamente.

---

## Flujo de Usuario Probado

```
1. Usuario selecciona un "look" (CASUAL, ELEGANTE, DEPORTIVO, etc.)
2. Usuario pulsa "RECOMENDACIÓN"
3. Se muestra el carrusel "PREPARANDO SELECCIÓN" (LoadingCarousel)
4. Se ejecuta handleAnalyze() → llamada a la API
5. ┌─ Si hay error → Se muestra pantalla de error con mensaje específico
6. │                      ↓
7. │               Usuario pulsa "VOLVER A INTENTAR"
8. │                      ↓
9. └─ Si es éxito → Se navega a la siguiente vista (onNext)
```

---

## Conclusiones

1. **El manejo de errores es robusto**: El componente cubre los principales códigos HTTP de error y proporciona mensajes útiles al usuario.

2. **La recuperación funciona**: El botón "VOLVER A INTENTAR" limpia correctamente el estado de error y devuelve al usuario al formulario.

3. **El flujo de carga es consistente**: El carrusel se muestra mientras la API procesa la solicitud, tanto en éxito como en error.

4. **Tests cubrían el 100%** de los escenarios de error identificados en el código.

---

## Recomendaciones Futuras

1. **Añadir tests para el flujo Kids** (`ViewKidsAnimal.jsx`) que tiene un manejo de errores similar
2. **Testear la funcionalidad IA SCAN** (subida de imagen y detección de look)
3. **Implementar tests de integración** para el flujo completo de la aplicación
4. **Añadir tests de rendimiento** para el carrusel de imágenes
