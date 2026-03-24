/* ========= CONFIG ÉVÉNEMENT ========= */
const EVENT = {
  title: "Webinaire : Trading & Développement Web",
  description:
    "Comprendre les bases, progresser et maîtriser les outils du futur. Session en ligne sur Google Meet.",
  // Vendredi 18 avril 2026 — 21h00 GMT+1 (Congo) => 20:00 UTC
  startISO: "2026-04-18T20:00:00Z",
  endISO:   "2026-04-18T21:30:00Z",
  location: "En ligne — Google Meet (lien envoyé après inscription)",
  // ✅ Remplace par TON numéro WhatsApp (format international sans '+')
  whatsappNumber:"242069180533"
};

/* ========= OUTILS ========= */
const $ = (sel) => document.querySelector(sel);
const byId = (id) => document.getElementById(id);
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const phoneOk = (v) => /^\+?\d{8,15}$/.test(v);

function setError(id, msg) {
  const el = document.querySelector(`.error[data-for="${id}"]`);
  if (el) el.textContent = msg || "";
}

/* ========= .ICS (ajout calendrier) ========= */
function downloadICS({ title, description, location, startISO, endISO }) {
  const dtStart = startISO.replace(/[-:]/g, "").replace(".000","");
  const dtEnd   = endISO.replace(/[-:]/g, "").replace(".000","");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Quantum Terminal//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "webinaire-trading-devweb.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ========= WhatsApp pré-rempli ========= */
function openWhatsApp({ number, name, email, phone }) {
  if (!number || !number === "242069180533") {
    alert("⚙️ Configure d’abord EVENT.whatsappNumber dans main.js (ex: 242069180533).");
    return;
  }
  const msg =
`JE M’INSCRIS — Webinaire Trading & Développement Web
Nom : ${name}
Email : ${email}
WhatsApp : ${phone}
Date : 18 avril 2026 — 21h00 (GMT+1)
Plateforme : Google Meet

Merci de me confirmer mon inscription.`;
  const url = `https://wa.me/242069180533?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}

/* ========= Formulaire ========= */
document.addEventListener("DOMContentLoaded", () => {
  const form = byId("signupForm");
  const waBtn = byId("whatsappBtn");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = byId("fullName").value.trim();
    const email    = byId("email").value.trim();
    const whatsapp = byId("whatsapp").value.trim();

    let ok = true;
    if (fullName.length < 2) { setError("fullName", "Veuillez saisir votre nom complet."); ok = false; } else setError("fullName", "");
    if (!emailOk(email))     { setError("email", "Adresse email invalide."); ok = false; } else setError("email", "");
    if (!phoneOk(whatsapp))  { setError("whatsapp", "Numéro WhatsApp invalide (ex: +242069180533)."); ok = false; } else setError("whatsapp", "");

    if (!ok) return;

    // 1) Ajout au calendrier
    downloadICS({
      title: EVENT.title,
      description: EVENT.description,
      location: EVENT.location,
      startISO: EVENT.startISO,
      endISO: EVENT.endISO
    });

    // 2) Ouverture WhatsApp pour finaliser
    openWhatsApp({
      number: EVENT.whatsappNumber,
      name: fullName,
      email,
      phone: whatsapp
    });
  });

  if (waBtn) {
    waBtn.addEventListener("click", () => {
      const fullName = (byId("fullName")?.value || "").trim() || "(Nom)";
      const email    = (byId("email")?.value || "").trim() || "(Email)";
      const whatsapp = (byId("whatsapp")?.value || "").trim() || "(Numéro)";
      openWhatsApp({
        number: EVENT.whatsappNumber,
        name: fullName,
        email,
        phone: whatsapp
      });
    });
  }
});