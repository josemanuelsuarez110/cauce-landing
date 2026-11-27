# Cauce — Landing fintech

Landing de demostración en español dominicano, creada con Next.js App Router, React, TypeScript, Tailwind CSS 4 y Zod 4. Presenta una calculadora ilustrativa en pesos dominicanos (RD$).

> **Importante:** esta página no ofrece ni confirma productos financieros, alianzas, licencias o rendimientos. Las métricas y proyecciones son ejemplos, no datos de operaciones reales ni una promesa de resultados.

## Funcionalidades

- Calculadora interactiva de proyecciones con supuestos editables y comparación ilustrativa de comisiones.
- Indicadores simulados que se actualizan en pantalla.
- Formulario de demostración y endpoint `POST /api/leads` con validación en servidor, comprobación de origen, límite de solicitudes y honeypot.
- Diseño adaptable, etiquetas accesibles, estados del formulario anunciados y respeto por `prefers-reduced-motion`.
- Cabeceras de seguridad y logs estructurados con el correo y la IP enmascarados.

## Requisitos

- Node.js 24.
- npm.

## Inicio rápido

```bash
npm ci
cp .env.example .env.local
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Comandos

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run lint` | Ejecuta ESLint. |
| `npm run typecheck` | Comprueba los tipos TypeScript. |
| `npm test` | Ejecuta lint y comprobación de tipos. |
| `npm run build` | Genera el build de producción. |
| `npm run audit:deps` | Audita vulnerabilidades de dependencias de producción. |

El workflow de GitHub Actions ejecuta estas comprobaciones en cada pull request y en los pushes a `main`.

## Datos y privacidad en esta demostración

El formulario no crea una inscripción ni está conectado a un CRM o base de datos. No ingreses información personal real. El endpoint valida las solicitudes y puede procesar la IP para limitar intentos; los registros de la aplicación enmascaran la IP y el correo. No hay analítica ni cookies propias implementadas por la aplicación. La infraestructura de alojamiento puede tener sus propios registros y condiciones de tratamiento.

Antes de habilitar captura real de leads, define y publica con asesoría legal el responsable y propósito del tratamiento, base legal/consentimiento, datos estrictamente necesarios, plazo de conservación, canal para ejercer derechos, proveedores receptores y medidas para incidentes. Implementa persistencia, controles de acceso, eliminación y consentimiento verificable antes de conectar un CRM. Este README no constituye asesoría legal ni certifica cumplimiento normativo.

## Configuración

Las variables de entorno están listadas en [`.env.example`](./.env.example). Los secretos de Upstash son opcionales y solo deben configurarse en el entorno del servidor, nunca con el prefijo `NEXT_PUBLIC_`. El rate limit funciona en memoria por defecto; para varias instancias puede configurarse Upstash. `TRUST_PROXY_HEADERS` debe activarse solo detrás de un proxy confiable que sobrescriba los encabezados de IP.

`LEADS_WEBHOOK_URL` y `LEADS_WEBHOOK_SECRET` están reservadas para una integración futura y todavía no son consumidas por el endpoint.

## Supabase

La migración inicial está en [`supabase/migrations/`](./supabase/migrations/). Crea una tabla mínima de leads con RLS forzado y acceso de inserción únicamente para `service_role`; no concede acceso desde el navegador. La migración todavía no se ha aplicado y el endpoint actual tampoco guarda leads. No habilites captura real hasta publicar el aviso de privacidad, definir la retención y completar la integración del servidor.

## Estructura

- `src/app/`: página principal y endpoint `/api/leads`.
- `src/components/`: secciones de la landing y componentes interactivos.
- `src/lib/validations.ts`: esquemas Zod compartidos para formularios y calculadora.
- `src/lib/calc.ts`: lógica de proyección financiera ilustrativa.
- `src/lib/rate-limit.ts`: limitadores en memoria y Upstash.
- `src/lib/logger.ts`: logs estructurados del servidor.

## Límites conocidos

- Los leads validados se registran con datos minimizados, pero no se persisten.
- Las métricas son simuladas y no provienen de una red financiera real.
- Los indicadores de cumplimiento no deben presentarse como certificaciones reales.
- La CSP de producción aún permite scripts y estilos en línea; la migración a CSP con nonce sigue pendiente.
- No se ha realizado una certificación legal o de seguridad de la aplicación.
