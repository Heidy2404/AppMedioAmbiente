// src/components/DevTeam.jsx
const MEMBERS = [
  { name: "Heidy Javier",          matricula: "2022-0994",  phone: "8497201260", telegram: "https://t.me/HeidyJavier", photo: "/team/yo.jpg" },
  { name: "Cristian Encarnacion",  matricula: "2023-0936",  phone: "8293825764", telegram: "http://t.me/Cristiandevs", photo: "/team/cristian.jpg" },
  { name: "Luis Espinal",          matricula: "2023-1055", phone: "8299212157", telegram: "https://t.me/mrjones777", photo: "/team/luis.jpg" },
  { name: "Adrian Lorenzo Torres", matricula: "2023-1033", phone: "8295229115", telegram: "http://t.me/adrianel60", photo: "/team/adrian.jpg" },
  { name: "Rainiero Mendoza",      matricula: "2022-1079", phone: "8494528607", telegram: "http://t.me/Jesus117229", photo: "/team/rainiero.jpg" },
];

const initials = (n) => n.split(" ").filter(Boolean).slice(0,3).map(w=>w[0]?.toUpperCase()).join("");

// Teléfono: genera tel: solo si hay dígitos
const telHref = (p) => {
  const digits = String(p||"").replace(/\D/g,"");
  return digits ? `tel:${digits}` : "";
};

// --- Helpers Telegram (solo WEB) ---
const extractTgUser = (tg) => {
  if (!tg) return "";
  let v = String(tg).trim();
  // si viene como URL (t.me/usuario), extrae el segmento
  const m = v.match(/^https?:\/\/t\.me\/([^/?#]+)/i);
  if (m) v = m[1];
  // quita @ si lo tiene
  v = v.replace(/^@/, "");
  // descarta invitaciones (+hash) y valida formato de usuario
  if (/^\+/.test(v)) return "";
  return /^[a-z0-9_]{5,32}$/i.test(v) ? v : "";
};

const tgWebHref = (tg) => {
  const u = extractTgUser(tg);
  return u ? `https://web.telegram.org/k/#@${u}` : "";
};

export default function DevTeam({ members = MEMBERS }) {
  return (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((m, i) => {
        const hasPhoto = !!m.photo;
        const callLink = telHref(m.phone);
        const tgWeb = tgWebHref(m.telegram);

        return (
          <li key={i} className="bg-white border rounded-xl p-4 flex items-center gap-4 shadow-sm">
            {hasPhoto ? (
              <img src={m.photo} alt={m.name} className="w-16 h-16 rounded-full object-cover border" loading="lazy" />
            ) : (
              <div className="w-16 h-16 rounded-full border flex items-center justify-center bg-emerald-100 text-emerald-900 font-semibold">
                {initials(m.name)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold leading-tight truncate">{m.name}</h4>
              <div className="text-sm text-gray-600">Matrícula: {m.matricula}</div>

              <div className="flex flex-wrap gap-2 mt-2">
                {callLink ? (
                  <a href={callLink} className="text-sm px-3 py-1 rounded border bg-white hover:bg-emerald-50">📞 Llamar</a>
                ) : (
                  <span className="text-sm px-3 py-1 rounded border bg-gray-50 text-gray-400">📞 Agregar teléfono</span>
                )}

                {tgWeb ? (
                  <a
                    href={tgWeb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm px-3 py-1 rounded border bg-white hover:bg-emerald-50"
                    title="Abrir en Telegram Web"
                  >
                    💬 Telegram (Web)
                  </a>
                ) : (
                  <span className="text-sm px-3 py-1 rounded border bg-gray-50 text-gray-400">💬 Agregar Telegram</span>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
