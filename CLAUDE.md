# Cauce — Landing Fintech (Security by Design)

Landing de nivel empresarial. Next.js (App Router) + TypeScript estricto + Tailwind CSS 4 + Zod 4 + Lucide React.

## Comandos
- `npm run dev` — desarrollo
- `npm run lint` — ESLint (debe pasar con 0 errores y 0 warnings)
- `npm run typecheck` — TypeScript estricto
- `npm run build` — build de producción (obligatorio antes de entregar cambios)
- `npm run audit:deps` — auditoría de dependencias de producción

## Arquitectura
- `src/app/` — rutas. `src/app/api/leads/route.ts` es el único endpoint de escritura.
- `src/components/` — secciones modulares: Navbar, Hero, LiveMetrics, Calculator, Security, LeadForm, Footer.
- `src/lib/validations.ts` — ÚNICA fuente de esquemas Zod (leads y calculadora). Cliente y servidor comparten esquema.
- `src/lib/rate-limit.ts` — limitador por IP (memoria; interfaz lista para Upstash Redis).
- `src/lib/logger.ts` — único lugar donde se permite `console.*`; logs JSON estructurados.
- `src/lib/calc.ts` — lógica pura de la calculadora. `src/lib/metrics.ts` — datos tipados simulados.
- Componentes de servidor por defecto; `"use client"` solo donde hay estado o efectos.

## Reglas de seguridad (NO negociables)
1. Prohibido `dangerouslySetInnerHTML`, `eval()`, `new Function()` y strings en `setTimeout/setInterval`. ESLint lo bloquea.
2. Prohibido `localStorage`/`sessionStorage` (ESLint lo bloquea). Nunca guardar datos sensibles en el navegador.
3. Toda entrada externa se valida con Zod en el servidor, aunque ya se valide en el cliente. Esquemas `strict` (se rechazan claves extra).
4. Texto libre: se eliminan caracteres de control y HTML antes de almacenar (`sanitizeText`).
5. `/api/leads`: comprobar Origin, Content-Type, tamaño de cuerpo, rate limit, honeypot (`website`) → 200 falso silencioso, validación, y errores genéricos al cliente.
6. Nunca devolver stack traces ni mensajes internos. Registrar en servidor con `logger` y un `requestId`. No registrar PII completa (el email se enmascara).
7. Secretos solo en variables de servidor. Nunca usar el prefijo `NEXT_PUBLIC_` para claves privadas. Documentar toda variable nueva en `.env.example`.
8. Cabeceras de seguridad en `next.config.ts` (CSP sin `unsafe-eval` en producción, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy). Cualquier recurso externo nuevo exige actualizar la CSP explícitamente.
9. No añadir dependencias sin revisar necesidad y ejecutar `npm run audit:deps`.
10. Los badges de cumplimiento (PCI-DSS, ISO 27001) son marcadores de diseño: solo mostrarlos como certificados cuando exista la certificación real.

## Accesibilidad y diseño
- WCAG AA: contraste, foco visible, etiquetas en todos los campos, `aria-live` en estados de formularios, `prefers-reduced-motion` respetado.
- Todo texto visible en español, tono claro y directo; los errores explican qué corregir.
- Cifras de la calculadora y métricas son ilustrativas; mantener los avisos de riesgo visibles.

## Pendientes conocidos
- CSP con nonce (eliminar `unsafe-inline` de scripts) vía `src/proxy.ts`.
- Persistir leads (CRM/BD) en `src/app/api/leads/route.ts` (hoy solo se registran en log).
- Rate limit distribuido con Upstash para despliegues multi-instancia.
