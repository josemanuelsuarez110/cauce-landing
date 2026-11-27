# CAUCE — Plan de transformación premium

**Rama de trabajo:** `feat/cauce-premium-transformation`  
**Rama base:** `main`  
**Estado:** planificación aprobada; implementación aislada.  
**Restricciones:** no modificar `main`, no desplegar a producción, no conectar servicios externos ni habilitar movimientos de fondos sin aprobación expresa.

## Objetivo

Evolucionar CAUCE desde una landing conceptual hacia una experiencia fintech profesional, accesible, verificable y preparada para crecer, conservando la infraestructura actual (Next.js, Vercel y la integración prevista con Supabase).

La identidad visual aprobada es **premium institucional**: azul noche, verde esmeralda, superficies claras, tipografía sobria, jerarquía editorial y visualización financiera precisa.

## Principios no negociables

1. No presentar métricas simuladas como actividad real.
2. No afirmar licencias, alianzas, certificaciones o controles no verificados.
3. No prometer rendimientos ni presentar simulaciones como productos financieros disponibles.
4. No aceptar datos de clientes si no existe persistencia, política de privacidad y consentimiento adecuados.
5. No almacenar ni procesar fondos, credenciales bancarias ni instrucciones de transferencia.
6. Mantener cambios pequeños, revisables y reversibles; preservar `main`.
7. No publicar ni desplegar cambios sin aprobación expresa del propietario.

## Diagnóstico inicial del repositorio

- Next.js, React, TypeScript y Tailwind CSS ya están instalados.
- La landing se compone de Navbar, Hero, calculadora, sección de seguridad, formulario y Footer.
- La API de leads valida entradas y aplica controles básicos, pero actualmente no persiste registros; la respuesta exitosa puede inducir al visitante a creer que se guardó una solicitud.
- El rate limiter depende de cabeceras proxy solo cuando se habilita explícitamente; en otro caso usa la clave `unknown`. En producción serverless, el limitador en memoria tampoco ofrece una cuota global.
- La CSP permite `unsafe-inline`; endurecerla requiere validar compatibilidad con Next.js y los recursos realmente utilizados.
- La calculadora aplica una comisión anual supuesta de 1,8 puntos porcentuales al escenario comparativo. Debe explicarse como hipótesis y validar casos límite, aportes, tasas inferiores a la comisión y precisión monetaria.
- Las métricas animadas son simuladas y deben sustituirse por contenido demostrativo estático y claramente etiquetado.
- El pipeline actual comprueba lint, TypeScript, build y auditoría de dependencias; falta cobertura automatizada de lógica financiera, API y flujos de interfaz.

## Fases de implementación

### Fase 0 — Línea base y salvaguardas
- Confirmar árbol, scripts, dependencias y estado de CI.
- Mantener esta rama como único destino de cambios.
- Documentar cualquier limitación de pruebas locales o de integración.

**Aceptación:** cambios aislados de `main`; sin secretos ni credenciales añadidos; plan versionado.

### Fase 1 — Sistema visual premium
- Definir tokens de color, tipografía, espaciado, bordes, sombras y estados de foco.
- Rediseñar navegación, hero, calculadora, sección de seguridad, formulario y footer.
- Mejorar responsive, navegación por teclado, contraste y movimiento reducido.
- Sustituir métricas animadas por indicadores estáticos de demostración, rotulados sin ambigüedad.

**Aceptación:** experiencia consistente en móvil, tableta y escritorio; controles accesibles; ninguna cifra ficticia presentada como operación real.

### Fase 2 — Correcciones funcionales y privacidad
- Corregir el comportamiento del formulario para que nunca confirme una inscripción no persistida.
- Elegir y configurar persistencia Supabase solo después de revisar el esquema, RLS, variables de entorno y política de privacidad.
- Si la integración no está configurada, mostrar un estado honesto y no almacenar datos.
- Revisar origen, validación, honeypot, rate limiting y manejo de errores.
- Definir estrategia de IP confiable para el entorno Vercel; evitar asumir que memoria local ofrece protección distribuida.

**Aceptación:** respuestas de API coherentes con el resultado real; pruebas de abuso y validación; RLS verificada antes de almacenar PII.

### Fase 3 — Motor financiero
- Añadir pruebas deterministas de interés compuesto, aportes mensuales, tasa cero, tasa negativa efectiva por comisión, límites y entradas extremas.
- Distinguir capital aportado, rendimiento nominal, comisiones e impacto inflacionario cuando se disponga de un supuesto explícito.
- Documentar periodicidad y momento de aportes.
- Usar aritmética y redondeo coherentes con DOP y evitar afirmar rentabilidades reales.

**Aceptación:** resultados reproducibles, supuestos visibles y casos de prueba revisados.

### Fase 4 — Seguridad y calidad
- Añadir pruebas unitarias, integración y E2E (Playwright) adecuadas al proyecto.
- Revisar CSP y cabeceras con pruebas de regresión; no endurecer políticas a ciegas.
- Revisar dependencias, secretos, autorización, RLS, logging y exposición de PII.
- Mantener el CI y ampliar las verificaciones.

**Aceptación:** lint, typecheck, build, tests y auditoría sin fallos críticos; hallazgos residuales documentados.

### Fase 5 — Preparación para revisión
- Entregar resumen de cambios, riesgos pendientes, evidencias de pruebas y capturas/preview si se autoriza.
- Preparar pull request hacia `main` como borrador o revisión, únicamente cuando el propietario lo solicite.
- No hacer merge ni desplegar a producción sin aprobación expresa.

## Riesgos y decisiones pendientes

- La operación de ahorro, inversión, custodia o transferencias puede activar obligaciones regulatorias en República Dominicana. La plataforma permanecerá como demostración informativa hasta contar con asesoría legal y socios/entidades autorizados.
- La persistencia de datos personales requiere definir responsable, finalidad, retención, derechos, seguridad y consentimiento.
- No se debe conectar Supabase con datos reales hasta comprobar las políticas RLS y las credenciales de servidor.
- Una CSP con nonce puede afectar renderizado, caché y comportamiento de Next.js; se aplicará solo tras pruebas.
- No se cambiarán proveedores, dominios, secretos, variables de producción ni configuración de Vercel en esta fase.

## Definición de terminado

CAUCE estará listo para revisión técnica cuando la experiencia visual sea consistente, las interacciones reflejen su estado real, las proyecciones sean reproducibles, el tratamiento de datos sea explícito, las pruebas pasen y todos los límites regulatorios estén comunicados. Esto no equivale a autorización para operar servicios financieros ni a aprobación para producción.
