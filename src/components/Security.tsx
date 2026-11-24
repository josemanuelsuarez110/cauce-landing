import { Fingerprint, Landmark, Radar } from "lucide-react";

const PILLARS = [
  {
    Icon: Landmark,
    title: "Tu dinero está separado del nuestro",
    text: "Los fondos de clientes se guardan en cuentas segregadas, aparte del dinero de la empresa, y se conciliaron a diario.",
  },
  {
    Icon: Fingerprint,
    title: "Verificamos que eres tú",
    text: "Entrar y mover dinero exige un segundo factor: app de autenticación o llave de seguridad. Sin él, no sale nada.",
  },
  {
    Icon: Radar,
    title: "Vigilamos cada movimiento",
    text: "Un sistema antifraude revisa montos, dispositivos y hábitos en tiempo real, y frena lo que no encaja contigo.",
  },
] as const;

const FLOW = [
  { title: "Confirmas tu identidad", text: "Segundo factor en tu dispositivo de confianza." },
  { title: "Revisamos el movimiento", text: "El antifraude compara la operación con tu comportamiento habitual." },
  { title: "Ves el costo final", text: "Antes de aceptar, aparece cuánto recibe la otra persona." },
  { title: "Liquidamos y te avisamos", text: "Recibes una notificación y el comprobante en tu cuenta." },
] as const;

export function Security() {
  return (
    <section id="seguridad" aria-labelledby="seg-titulo" className="border-b border-line">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <h2 id="seg-titulo" className="max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Protegemos tu dinero antes, durante y después de cada transferencia.
        </h2>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1fr]">
          <ul className="space-y-8">
            {PILLARS.map(({ Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center bg-teal text-white">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-1 max-w-md leading-relaxed text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="border border-ink bg-white p-6">
            <h3 className="text-lg font-semibold">Qué pasa cuando envías dinero</h3>
            <ol className="mt-5 space-y-5">
              {FLOW.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span aria-hidden="true" className="tabular flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-teal text-sm font-semibold text-teal">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="text-sm leading-relaxed text-muted">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
