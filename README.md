# Cauce — Landing fintech

Landing page en español para Cauce, una propuesta fintech centrada en costos transparentes, ahorro y transferencias. Construida con Next.js App Router, React, TypeScript estricto, Tailwind CSS 4 y Zod 4.

> **Aviso:** este repositorio contiene una experiencia de demostración. Las métricas, proyecciones y descripciones de producto son ilustrativas; no representan rendimientos, certificaciones ni disponibilidad de servicios reales.

## Funcionalidades

- Calculadora interactiva de crecimiento con supuestos editables y comparación ilustrativa de comisiones.
- Formulario de lista de espera con validación compartida entre cliente y servidor.
- Endpoint de leads con comprobación de origen, limitación de solicitudes, honeypot, límites de tamaño y sanitización.
- Cabeceras de seguridad, mensajes de error genéricos y logs estructurados con datos personales minimizados.
- Diseño adaptable, controles accesibles y respeto por `prefers-reduced-motion`.

## Requisitos

- Node.js 22 o superior.
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

## Configuración

Las variables opcionales y de entorno están documentadas en [`.env.example`](./.env.example). Las credenciales de Upstash y cualquier secreto deben permanecer en el entorno del servidor; nunca deben exponerse con el prefijo `NEXT_PUBLIC_`.

El rate limiting funciona en memoria por defecto y puede usar Upstash Redis en despliegues con varias instancias. `TRUST_PROXY_HEADERS` solo debe activarse cuando el despliegue esté detrás de un proxy confiable que sobrescriba los encabezados de IP.

## Estructura

- `src/app/`: página principal y endpoint `POST /api/leads`.
- `src/components/`: secciones de la landing y componentes interactivos.
- `src/lib/validations.ts`: esquemas Zod compartidos para formularios y calculadora.
- `src/lib/calc.ts`: lógica de proyección financiera ilustrativa.
- `src/lib/rate-limit.ts`: limitadores en memoria y Upstash.
- `src/lib/logger.ts`: logs estructurados del servidor.

## Estado y límites conocidos

- Los leads se validan y registran de forma minimizada en logs; todavía no se persisten en un CRM o base de datos.
- Las cifras de actividad son simuladas y no proceden de una red financiera real.
- Los indicadores PCI-DSS e ISO 27001 son elementos visuales, no certificaciones.
- La CSP aún permite scripts y estilos en línea requeridos por el renderizado actual de Next.js. La migración a CSP con nonce está pendiente.

Las mejoras y límites relacionados con seguridad se documentan también en [`CLAUDE.md`](./CLAUDE.md).
