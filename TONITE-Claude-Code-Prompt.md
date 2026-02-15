# TONITE — Claude Code Build Prompt

> **Lies dieses Dokument komplett bevor du anfängst zu coden.**
> Dies ist die vollständige Spezifikation für TONITE — ein Last-Minute-Erlebnis-Marktplatz.
> Baue die Anwendung Schritt für Schritt. Frage bei Unklarheiten nach.

---

## 1. WAS IST TONITE?

TONITE ist ein Last-Minute-Erlebnis-Marktplatz — "TooGoodToGo für Live-Entertainment." Venues (Theater, Varietés, Clubs) stellen ihre unverkauften Plätze 3-5 Tage vor Showtime auf TONITE ein und verkaufen sie an spontane Erlebnissuchende. Der Kunde bucht entweder sofort zum Flash-Preis oder verhandelt mit einem KI-Bot über "Mach dein Angebot".

TONITE ist eine **eigenständige Consumer-Brand**. Sie darf niemals mit dem B2B-Ticketing-System "tixu" assoziiert werden. Reguläre Ticketkäufer sollen nie erfahren, dass TONITE existiert.

---

## 2. ARCHITEKTUR-ENTSCHEIDUNG: WEB-FIRST

### Stack

```
┌─────────────────────────────────────────────┐
│  FRONTEND: Next.js 14+ (App Router)         │
│  • Consumer Web-App (Mobile-First PWA)      │
│  • Venue Portal                             │
│  • Admin Dashboard                          │
│  • Door Check-in (/scan)                    │
│  Hosting: Vercel oder Railway               │
├─────────────────────────────────────────────┤
│  BACKEND: Supabase (Managed)                │
│  • PostgreSQL Database                      │
│  • Auth (Email, Magic Link, OAuth)          │
│  • Storage (Bilder, Videos, Ticket-PDFs)    │
│  • Edge Functions (Deno/TypeScript)         │
│  • Realtime (Live-Counter, Crew-Lobby)      │
│  • Row Level Security (RLS)                 │
├─────────────────────────────────────────────┤
│  WORKERS: Railway (Background Jobs)         │
│  • tixu API Sync (Cron)                    │
│  • Google Ads Campaign Management           │
│  • Offer Expiration (Cron)                  │
│  • Event Auto-Publish (Cron)                │
│  • Weekly Venue Reports                     │
├─────────────────────────────────────────────┤
│  EXTERNE SERVICES                           │
│  • Stripe Connect (Zahlungen)               │
│  • Google Ads API (Kampagnen)               │
│  • Claude API (Verhandlungs-Bot, Ad Copy)   │
│  • OpenWeatherMap (Wetter-Kontext für Ads)  │
│  • tixu REST API (Verfügbarkeits-Sync)      │
└─────────────────────────────────────────────┘
```

### Warum Web-First statt React Native

- Schnellerer MVP — ein Codebase für alles
- Mobile-First PWA mit "Zum Homescreen hinzufügen" fühlt sich wie native App an
- Web Push Notifications funktionieren auf iOS seit 2023
- SEO-Landing-Pages für Google Ads direkt eingebaut
- Später: Business-Logik 1:1 in React Native App übertragbar (gleiche API, gleiche Supabase-Anbindung)

### Projektstruktur

```
tonite/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (consumer)/         # Consumer-Routen (Route Group)
│   │   │   ├── page.tsx        # Home / Event-Übersicht
│   │   │   ├── event/[slug]/   # Event-Detailseite
│   │   │   ├── checkout/       # Stripe Checkout
│   │   │   ├── tickets/        # Meine Tickets
│   │   │   ├── crew/[code]/    # Crew-Lobby
│   │   │   ├── rewards/        # Streak & Rewards
│   │   │   └── profile/        # Profil & Einstellungen
│   │   ├── (venue)/            # Venue-Portal
│   │   │   ├── dashboard/      # Venue-Dashboard
│   │   │   ├── events/         # Event-Verwaltung
│   │   │   ├── series/         # Event-Serien
│   │   │   └── settings/       # Venue-Einstellungen
│   │   ├── (admin)/            # Admin-Dashboard
│   │   │   ├── dashboard/      # Übersicht
│   │   │   ├── venues/         # Venue-Management
│   │   │   ├── campaigns/      # Google Ads Genehmigungen
│   │   │   └── bookings/       # Transaktions-Log
│   │   ├── scan/               # Door Check-in (QR)
│   │   ├── api/                # API Routes
│   │   │   ├── checkout/       # Stripe Checkout Session
│   │   │   ├── webhook/        # Stripe Webhook
│   │   │   ├── offer/          # Make-an-Offer
│   │   │   ├── crew/           # Crew-Aktionen
│   │   │   └── tixu/           # tixu Sync
│   │   └── layout.tsx          # Root Layout
│   ├── components/
│   │   ├── ui/                 # Design System (Buttons, Cards, Inputs...)
│   │   ├── consumer/           # Consumer-Komponenten
│   │   ├── venue/              # Venue-Portal-Komponenten
│   │   └── admin/              # Admin-Komponenten
│   ├── lib/
│   │   ├── supabase/           # Supabase Client & Helpers
│   │   ├── stripe/             # Stripe Integration
│   │   ├── ai/                 # Claude API Wrapper
│   │   └── utils/              # Hilfsfunktionen
│   ├── hooks/                  # Custom React Hooks
│   ├── styles/                 # Global Styles, Theme Tokens
│   └── types/                  # TypeScript Types
├── supabase/
│   ├── migrations/             # SQL Migrations
│   ├── functions/              # Edge Functions
│   └── seed.sql                # Test-Daten
├── workers/                    # Railway Background Workers
│   ├── tixu-sync.ts
│   ├── ads-manager.ts
│   ├── offer-expiry.ts
│   └── event-publisher.ts
├── public/
│   ├── manifest.json           # PWA Manifest
│   └── sw.js                   # Service Worker
└── package.json
```

---

## 3. SPRACHE

**KRITISCH: Die gesamte App ist auf Deutsch (de-DE).**

- Alle UI-Texte, Labels, Buttons, Fehlermeldungen, Legal-Texte → Deutsch
- AI-Chatbot (Make-an-Offer) → Deutsch
- Google Ads Copy → Deutsch
- E-Mails, Push-Notifications → Deutsch
- **Kein** englischer Fallback in der UI

Verwende ein i18n-System (z.B. `next-intl`) damit später Englisch hinzugefügt werden kann. Aber v1 ist 100% Deutsch.

Code-Kommentare, Variablennamen, technische Dokumentation → Englisch ist OK.

---

## 4. DESIGN SYSTEM — PREMIUM DARK GLASSMORPHISM

### Design-Philosophie

**Die App muss sich premium, kuratiert und aufregend anfühlen — NICHT wie eine Discount-Plattform oder eine generische AI-generierte App.**

### Farbpalette

```css
:root {
  /* Hintergründe */
  --bg-primary: #0A0A0F;        /* Tiefstes Schwarz */
  --bg-secondary: #12121A;      /* Karten-Hintergrund */
  --bg-elevated: #1A1A2E;       /* Erhöhte Elemente */
  --bg-glass: rgba(255, 255, 255, 0.03);  /* Glassmorphism */
  --bg-glass-hover: rgba(255, 255, 255, 0.06);
  
  /* Glassmorphism */
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-blur: 20px;
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  
  /* Text */
  --text-primary: #F5F5F7;      /* Haupttext — fast weiß */
  --text-secondary: #8E8E93;    /* Sekundärtext */
  --text-tertiary: #48484A;     /* Deaktivierter Text */
  
  /* Akzentfarben — Neon/Nightlife-Feel */
  --accent-primary: #6C5CE7;    /* Violett — Haupt-CTA */
  --accent-gradient: linear-gradient(135deg, #6C5CE7, #A855F7);
  --accent-glow: 0 0 20px rgba(108, 92, 231, 0.3);
  
  /* Status */
  --success: #34C759;
  --warning: #FF9F0A;
  --danger: #FF453A;
  --info: #5AC8FA;
  
  /* Scarcity-Farben */
  --scarcity-available: #34C759;     /* 20+ Tickets */
  --scarcity-selling: #FF9F0A;      /* 10-20 Tickets */
  --scarcity-few: #FF6B35;          /* 5-10 Tickets */
  --scarcity-last: #FF453A;         /* <5 Tickets, mit Puls */
}
```

### Glassmorphism-Komponenten

```css
.glass-card {
  background: var(--bg-glass);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: var(--glass-shadow);
}

.glass-card:hover {
  background: var(--bg-glass-hover);
  border-color: rgba(255, 255, 255, 0.12);
}

/* Premium Button mit Gradient */
.btn-primary {
  background: var(--accent-gradient);
  border: none;
  border-radius: 12px;
  padding: 14px 28px;
  color: white;
  font-weight: 600;
  box-shadow: var(--accent-glow);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(108, 92, 231, 0.5);
}
```

### Typographie

```css
/* System-Fonts — SF Pro auf iOS/Mac, Inter als Fallback */
--font-primary: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
--font-mono: 'SF Mono', 'Fira Code', monospace;

/* Größen */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 2rem;      /* 32px */
--text-4xl: 2.5rem;    /* 40px — Hero Headlines */
```

### Animationen

```css
/* Smooth Transitions überall */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Page Transitions */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scarcity Pulse */
@keyframes pulse-scarcity {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* Skeleton Loading — kein Spinner! */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-elevated) 50%, var(--bg-secondary) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}
```

### UI-Regeln (STRIKT EINHALTEN)

1. **Nur Dark Mode** — kein Light Mode in v1
2. **Keine Emojis in der UI** — Emojis nur im Chat-Bot und Notifications
3. **Keine roten Durchstreich-Preise** — wir sind KEINE Discount-Plattform
4. **Keine "SALE"-Badges** — wir sind eine Premium-Erlebnis-Plattform
5. **Keine weißen Hintergründe** — nirgendwo
6. **Keine generischen Material-Design-Komponenten** — alles custom
7. **Keine Bootstrap-Ästhetik** — keine abgerundeten bunten Buttons
8. **Skeleton Screens statt Spinner** — überall
9. **Max 2-3 Elemente pro Screen** — Content atmen lassen
10. **Bilder müssen cinematisch wirken** — Event-Cards wie Film-Poster, nicht wie Datenbank-Einträge
11. **Glassmorphism überall** — Cards, Modals, Navigation, Bottom-Bar
12. **Gradient-Akzente auf CTAs** — keine flachen Farben für Buttons
13. **Smooth Transitions** — Page-Transitions, Card-Reveals, Counter-Updates müssen flüssig sein
14. **Großzügiges Spacing** — nie eng, immer atmen lassen

### Event-Card Komponente (Referenz-Implementierung)

```tsx
// So soll eine Event-Card aussehen — als Referenz für den Design-Standard
function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/event/${event.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl glass-card">
        {/* Hero-Bild — volle Breite, cinematic */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={event.coverImage}
            alt={event.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Gradient-Overlay von unten */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent" />
          
          {/* Scarcity Badge — oben rechts */}
          <ScarcityBadge remaining={event.contingentRemaining} />
          
          {/* Countdown — oben links */}
          <CountdownBadge datetime={event.datetime} />
        </div>
        
        {/* Content */}
        <div className="p-5 space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-[--text-primary] line-clamp-1">
              {event.name}
            </h3>
            <p className="text-sm text-[--text-secondary]">
              {event.venueName} · {formatDate(event.datetime)}
            </p>
          </div>
          
          {/* Preis — prominent, kein Durchstreichen */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold bg-gradient-to-r from-[#6C5CE7] to-[#A855F7] bg-clip-text text-transparent">
              ab {formatPrice(event.flashPrice)}
            </span>
            <span className="text-xs text-[--text-tertiary] uppercase tracking-wider">
              Flash-Preis
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
```

---

## 5. GESCHÄFTSMODELL

### Handelsvertreter (§84 HGB)

- Kaufvertrag besteht zwischen **Kunde und Venue** — TONITE vermittelt nur
- TONITE fasst kein Geld an — Zahlung geht direkt an Venue via Stripe Connect
- TONITE erhält 15-20% Provision als Stripe Application Fee
- Kein ZAG-Risiko (Zahlungsdienstaufsicht)
- Venue ist verantwortlich für Stornierung und Erstattung

### Release-Window (HART)

- Events gehen **frühestens 5 Tage** und **spätestens 72h (3 Tage)** vor Showtime live
- Das ist eine Plattform-Regel, keine Empfehlung
- Feld `release_days_before` pro Event-Serie (min 3, max 5, default 5)
- Events die weniger als 72h entfernt sind und nie veröffentlicht wurden → erscheinen nicht

---

## 6. DREI INTERFACES

### 6.1 Consumer Web-App (Hauptprodukt)

**Routen:**

| Route | Beschreibung |
|-------|-------------|
| `/` | Home — heutige/kommende Events, Hero-Featured |
| `/event/[slug]` | Event-Detail mit Flash-Preis, Make-an-Offer, Crew |
| `/checkout` | Stripe Checkout |
| `/checkout/success` | Bestätigung mit Konfetti-Animation |
| `/tickets` | Meine Tickets (aktive + vergangene, QR-Codes) |
| `/crew/[code]` | Crew-Lobby (Share, Mitglieder, Discount-Fortschritt) |
| `/rewards` | Streak & Rewards (Tier, Sterne, Streak-Flamme) |
| `/profile` | Profil (Zahlungsmethoden, Notifications, Stadt) |
| `/auth/login` | Login (Email Magic Link + Google OAuth) |

#### Home-Screen

- **Hero-Sektion**: Featured Event mit Vollbild-Image, Name, Venue, Uhrzeit, Preis
- **Darunter**: Scrollbare Grid/Liste der verfügbaren Events
- Jede Event-Card: Hero-Image, Name, Venue, Datum/Uhrzeit, Flash-Preis, Scarcity-Indikator
- **Keine Kategorien/Filter im MVP** — einfach chronologisch nach Datum
- **Stadt-Selector** oben (zunächst nur Essen + Bonn)

#### Scarcity & Urgency (KRITISCH für Conversion)

Authentisch, nicht spammy:

| Tickets übrig | Badge | Farbe | Animation |
|--------------|-------|-------|-----------|
| 20+ | "Verfügbar" | Grün, dezent | Keine |
| 10-20 | "Geht schnell weg" | Amber | Keine |
| 5-10 | "Nur noch X" | Orange | Keine |
| <5 | "Letzte X!" | Rot | Subtiler Puls |

Zusätzlich:
- **Countdown-Timer** auf jeder Event-Card: "Show in 4h 23m"
- **Live-Aktivität**: "X Personen sehen sich das gerade an" (via Supabase Realtime Presence)
- **Buchungs-Toast** (dezent, unten): "Sarah hat gerade 2 Tickets gebucht"
- **Preis-Eskalations-Hinweis** (wenn zutreffend): "Preis kann näher am Showtime steigen"

#### Event-Detailseite

Vollbild Hero-Image/Video oben. Darunter:

```
┌──────────────────────────────────────┐
│  [Vollbild Event-Bild/Video]         │
│                                      │
│  IGNITE — Die Varieté-Show            │
│  GOP Varieté Essen · Fr, 21. Feb 19:30│
│  Nur noch 12 Plätze!                 │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  ⚡ FLASH-PREIS               │    │
│  │  49 € pro Ticket             │    │
│  │  [Jetzt buchen]              │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  💬 MACH DEIN ANGEBOT         │    │
│  │  Nenn deinen Preis           │    │
│  │  [Verhandlung starten]       │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  👥 CREW STARTEN              │    │
│  │  Mehr Leute = mehr Rabatt    │    │
│  │  [Crew erstellen]            │    │
│  └──────────────────────────────┘    │
│                                      │
│  Kein Sitzplatz-Auswahl —           │
│  Dein Platz wird dir am Eingang     │
│  zugewiesen (Überraschungs-Platz!)  │
│                                      │
│  📍 GOP Varieté-Theater Essen       │
│  Rottstr. 30, 45127 Essen          │
│  [Karte anzeigen]                   │
└──────────────────────────────────────┘
```

#### Flash-Preis Buchung (Ziel: unter 30 Sekunden)

1. Tap "Jetzt buchen"
2. Ticket-Anzahl wählen (1-6)
3. Namen eingeben (personalisierte Tickets)
4. Zahlung: Stripe Checkout mit Apple Pay / Google Pay / gespeicherter Karte
5. Bestätigungs-Screen mit Konfetti-Animation 🎉
6. Ticket: QR-Code in-app + PDF per E-Mail
7. "Zum Kalender hinzufügen"-Option

Für wiederkehrende Kunden mit gespeicherten Zahlungsmethoden: 2-3 Taps.

#### Make-an-Offer (Verhandlungs-Chat)

In-App Chat-Interface. **Gesamte Konversation auf Deutsch.**

Regeln für den AI-Bot:
- Max **3 Angebote** pro Kunde pro Event
- **Hard Floor**: Venue setzt Mindestpreis — unter diesem Preis kein Deal
- Bot respektiert auch die **maximale Rabatt-Prozent** des Venues
- Bot kann **Value-Adds** anbieten um Deal zu schließen (nur wenn vom Venue konfiguriert und verfügbar)
- **Jeder Value-Add wird als Gutschein erfasst** (VAT-Compliance, Details unten)
- Nach Akzeptanz: Weiterleitung zu Stripe Checkout, 15-Minuten Timer
- Nach 3 Ablehnungen: "Heute passt es leider nicht — soll ich dich benachrichtigen wenn ein Deal in deiner Preisklasse kommt?"

**Beispiel-Konversation:**
```
Kunde: "Ich hätte gerne 2 Tickets für je 30 Euro"

TONITE: "€30 ist leider unter unserem Minimum für heute Abend.
         Wie wär's mit €42 pro Ticket inklusive Welcome-Drink an der Bar?"

Kunde: "€38?"

TONITE: "Deal! 2x IGNITE für je €38. Das sind €76 gesamt.
         Schließ die Buchung in den nächsten 15 Minuten ab:
         [Jetzt bezahlen]"
```

**Claude API System-Prompt für den Bot:**

```
Du bist der TONITE Verhandlungs-Bot. Du verhandelst freundlich, charmant 
und auf Deutsch über Ticket-Preise. 

Regeln:
- Mindestpreis für dieses Event: {{offer_min_price}} €
- Maximaler Rabatt: {{offer_max_discount_pct}}% vom Flash-Preis ({{flash_price}} €)
- Verfügbare Value-Adds: {{available_value_adds}}
- Der Kunde hat Angebot Nr. {{attempt_number}} von 3

Verhalte dich wie ein charmanter Concierge, nicht wie ein Roboter.
Sei kreativ mit Value-Adds um Deals zu schließen.
Antworte immer auf Deutsch. Maximal 3 Sätze pro Antwort.
Wenn der Preis akzeptabel ist, bestätige sofort mit Zusammenfassung.
```

#### Ticket

Nach Kauf:
- In-App QR-Code Ansicht
- E-Mail mit PDF-Ticket (Supabase Storage)
- Ticket enthält: Kundenname, Event-Name, Venue, Datum/Uhrzeit, QR-Code, Buchungsreferenz
- **Personalisiert** — Name auf Ticket, Ausweis-Kontrolle am Eingang möglich
- QR-Code validiert gegen Supabase-Datenbank

#### Crew Mode (Gruppen-Rabatte)

Viral-Growth-Mechanismus mit eskalierenden Rabatten:

| Crew-Größe | Rabatt |
|------------|--------|
| 1 Person | 0% (normaler Flash-Preis) |
| 2 Personen | 10% |
| 3-4 Personen | 20% |
| 5-6 Personen | 30% |
| 7+ Personen | 35% (Maximum) |

**Flow:**
1. Kunde tippt "Crew starten" → bekommt einzigartigen Share-Link
2. Crew-Seite zeigt: aktuelle Größe, aktueller Rabatt, nächste Schwelle ("Lade 1 weitere Person ein für 20%!"), Countdown
3. Freunde öffnen Link → sehen Event + Crew-Deal → treten bei → zahlen zum aktuellen Rabatt-Preis
4. Wenn Crew wächst: frühere Mitglieder die mehr gezahlt haben bekommen Differenz gutgeschrieben
5. 2h vor Event: Crew wird gesperrt, finale Preise bestätigt

**Regeln:**
- Rabatt auf TONITE Flash-Preis, nicht auf Original-Venue-Preis
- Venue-Mindestpreis gilt weiterhin, auch bei maximalem Crew-Rabatt
- Jedes Crew-Mitglied bucht und zahlt individuell
- Crew-Ersteller bekommt einzigartigen Share-Link

**UI:**
- Crew-Seite fühlt sich an wie eine Gruppen-Lobby
- Echtzeit-Updates via Supabase Realtime
- Prominenter Share-Button (WhatsApp, Link kopieren)
- Progress-Bar zur nächsten Rabatt-Stufe

#### Streak & Rewards (Loyalty)

| Tier | Anforderung | Perks |
|------|-------------|-------|
| **Explorer** | 0 Buchungen | Basis-Zugang |
| **Regular** | 3 Buchungen | Early Access (15 Min Vorsprung), 5% Crew-Bonus |
| **VIP** | 8 Buchungen | + Großzügigerer Offer-Bot, Seat-Upgrade wenn verfügbar, VIP-only Flash-Drops |
| **Legend** | 20 Buchungen | + WhatsApp-Concierge, First Access, Überraschungs-Perks |

**Punkte:**
- 1 Buchung = 1 Stern (unabhängig von Ticket-Anzahl)
- Bonus: Neues Venue +1, Wochentag +1, Crew-Ersteller +2, Referral +3

**Streak:**
- Aufeinanderfolgende Wochen buchen → Streak aufbauen
- 3 Wochen = Überraschungs-Perk
- 5 Wochen = Bonus-Rabatt
- 10 Wochen = Legend Fast-Track
- Woche verpassen → Streak reset (nicht Tier)

**UI:**
- Profil zeigt: Tier-Badge, Sterne, Streak-Flamme, Progress-Bar
- Tier-Badge auf Buchungsbestätigung und Ticket
- Push: "Noch 1 Buchung bis VIP!"

---

### 6.2 Venue-Portal

**Routen:**

| Route | Beschreibung |
|-------|-------------|
| `/venue/register` | Registrierung + Onboarding |
| `/venue/dashboard` | Dashboard mit Umsatz, Events |
| `/venue/events` | Events verwalten |
| `/venue/events/new` | Neues Event erstellen |
| `/venue/series` | Event-Serien verwalten |
| `/venue/series/new` | Neue Serie erstellen |
| `/venue/settings` | Einstellungen |

#### Registrierung & Onboarding

4 Schritte:

1. **Firmendaten**: Name, Adresse, USt-IdNr, Ansprechpartner
2. **Vermittlungsvertrag** digital unterschreiben — bestätigt:
   - TONITE agiert als Handelsvertreter, nicht als Verkäufer
   - Venue bestätigt Durchführung der Events
   - Venue ist verantwortlich für Stornierungen/Erstattungen
   - TONITE erhält X% Provision
3. **Google Ads Vollmacht** — einmalig, erlaubt TONITE im Namen des Venues Google Ads zu schalten. TONITE trägt 100% der Werbekosten.
4. **Stripe Connect Onboarding** — Venue verbindet oder erstellt Stripe-Konto

#### Event-Erstellung

**A) Einzelnes Event:**
- Name, Beschreibung, Datum, Uhrzeit, Location
- Bilder/Video hochladen (Supabase Storage)
- TONITE-Kontingent (Anzahl freizugebender Tickets)
- Mindestpreis (Preisuntergrenze)
- Release-Zeitplan: wie viele Tage vorher live (min 3, max 5)
- Make-an-Offer aktivieren (ja/nein)
- **Verhandlungs-Einstellungen** (wenn Make-an-Offer aktiv):
  - Maximaler Rabatt-Prozent (z.B. "bis 30% Rabatt")
  - Mindest-Angebotspreis (Hard Floor)
- **Value-Adds für Verhandlung:**
  - Venue definiert verfügbare Value-Adds: "Welcome Drink", "Garderobe gratis", etc.
  - Je Value-Add: Name, Beschreibung, Warenwert (€), MwSt-Satz (7% oder 19%), Menge pro Event
- Bestätigungs-Checkbox: "Ich bestätige, dass dieses Event wie gelistet stattfindet."

**B) Event-Serie (MUSS gut designt sein!):**
- Serienname (z.B. "IGNITE")
- Wiederholungsmuster: Wochentage + Uhrzeit (z.B. Mi-So um 19:30)
- Datumsbereich: Start- bis Enddatum
- **Bestimmte Daten ausschließen** (Feiertage, private Events)
- Standard-Kontingent und -Mindestpreis für alle Termine
- **Wochentag-Override** (z.B. Samstag Mindestpreis €42 statt €35)
- **Einzeldatum-Override** (z.B. Valentinstag Sonderpreis)
- Standard-Verhandlungseinstellungen (vererbbar, pro Event überschreibbar)
- Standard-Value-Adds (vererbbar, pro Event überschreibbar)
- **Kalender-Ansicht** mit allen generierten Terminen und deren Einstellungen
- **Auto-Release**: TONITE veröffentlicht Events automatisch 3-5 Tage vorher ODER manuelle Bestätigung jede Woche
- Bei Auto-Release ON: Venue bekommt wöchentliche Zusammenfassung ("Nächste Woche: 5 Shows, je 30 Plätze, ab €35. Antwort nur bei Änderungen.")

#### Venue-Dashboard
- Übersicht: TONITE-Gesamtumsatz, verkaufte Tickets, kommende Events
- Pro-Event Status: Restkontingent, verkauft, aktueller Preis, Offer-Aktivität
- Verkaufshistorie mit Export (CSV)
- Einstellungen: Preise ändern, Kontingent anpassen, TONITE pausieren

---

### 6.3 Admin-Dashboard

**Routen:**

| Route | Beschreibung |
|-------|-------------|
| `/admin/dashboard` | Übersicht (Sales, Events, Venues, Revenue) |
| `/admin/venues` | Venue-Management |
| `/admin/campaigns` | Google Ads Genehmigungen |
| `/admin/bookings` | Transaktions-Log |
| `/admin/events` | Event-Import von tixu |

#### Features

- **Übersicht**: Heutige Sales, aktive Events, Live-Venues, Umsatz
- **Venue-Management**: Hinzufügen/Bearbeiten/Deaktivieren, Stripe & Google Ads Status
- **Event-Import von tixu API**: tixu Events durchsuchen, auswählen, Kontingent/Mindestpreis setzen
- **Manuelles Event erstellen** für Nicht-tixu-Venues
- **Kampagnen-Genehmigung** (KRITISCH — siehe Abschnitt 9):
  - Pending-Queue sortiert nach Dringlichkeit
  - Je Kampagne: Event, Venue, Datum, Budget, 3 Ad-Varianten, Targeting, geschätzte Reichweite
  - **Ein-Klick genehmigen** → sofort live auf Google Ads
  - **Bearbeiten & genehmigen** → Anpassungen vor Launch
  - **Ablehnen** → mit Notiz
  - Ziel: 5-10 Kampagnen in unter 2 Minuten genehmigen
- **Buchungs-/Transaktions-Log**: Alle Sales mit Kunde, Event, Preis, Kanal
- **Performance pro Venue**: Umsatz, Tickets, Durchschnittspreis, Conversion

---

## 7. DATENMODELL (Supabase/PostgreSQL)

### SQL-Migration

```sql
-- =============================================
-- TONITE Database Schema
-- =============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUM Types
CREATE TYPE venue_status AS ENUM ('pending_onboarding', 'active', 'paused', 'deactivated');
CREATE TYPE event_status AS ENUM ('draft', 'scheduled', 'live', 'sold_out', 'past', 'cancelled');
CREATE TYPE series_status AS ENUM ('active', 'paused', 'ended');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'refunded');
CREATE TYPE booking_channel AS ENUM ('flash', 'offer', 'crew');
CREATE TYPE offer_status AS ENUM ('pending', 'countered', 'accepted', 'rejected', 'expired');
CREATE TYPE voucher_status AS ENUM ('issued', 'redeemed', 'expired', 'cancelled');
CREATE TYPE vat_category AS ENUM ('cultural_7pct', 'food_drink_19pct', 'merchandise_19pct', 'service_19pct');
CREATE TYPE campaign_status AS ENUM ('pending_approval', 'approved', 'active', 'paused', 'completed', 'rejected');
CREATE TYPE crew_status AS ENUM ('open', 'locked', 'completed', 'expired');
CREATE TYPE crew_member_status AS ENUM ('joined', 'paid', 'dropped');
CREATE TYPE reward_tier AS ENUM ('explorer', 'regular', 'vip', 'legend');
CREATE TYPE reward_event_type AS ENUM ('booking', 'new_venue', 'weekday_bonus', 'crew_creator', 'referral', 'streak_bonus');

-- =============================================
-- VENUES
-- =============================================
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  stripe_account_id TEXT,
  commission_rate DECIMAL(4,3) NOT NULL DEFAULT 0.15,
  google_ads_authorized BOOLEAN DEFAULT FALSE,
  google_ads_authorized_at TIMESTAMPTZ,
  contract_signed BOOLEAN DEFAULT FALSE,
  contract_signed_at TIMESTAMPTZ,
  logo_url TEXT,
  cover_image_url TEXT,
  status venue_status NOT NULL DEFAULT 'pending_onboarding',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- VALUE-ADDS (pro Venue definiert)
-- =============================================
CREATE TABLE venue_value_adds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  retail_value DECIMAL(8,2) NOT NULL,
  vat_rate DECIMAL(4,3) NOT NULL,
  vat_category vat_category NOT NULL,
  available_per_event INTEGER,  -- NULL = unbegrenzt
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- EVENT-SERIEN
-- =============================================
CREATE TABLE event_series (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  recurrence_days INTEGER[] NOT NULL,  -- 0=Mo, 6=So
  default_time TIME NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  excluded_dates DATE[] DEFAULT '{}',
  default_contingent INTEGER NOT NULL,
  default_min_price DECIMAL(8,2) NOT NULL,
  weekday_overrides JSONB DEFAULT '{}',
  make_offer_enabled BOOLEAN DEFAULT TRUE,
  offer_max_discount_pct DECIMAL(4,3) DEFAULT 0.30,
  offer_min_price DECIMAL(8,2),
  release_days_before INTEGER NOT NULL DEFAULT 5 CHECK (release_days_before >= 3 AND release_days_before <= 5),
  ads_days_before INTEGER DEFAULT 3,
  auto_release BOOLEAN DEFAULT TRUE,
  status series_status NOT NULL DEFAULT 'active',
  tixu_series_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- EVENTS
-- =============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  series_id UUID REFERENCES event_series(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  datetime TIMESTAMPTZ NOT NULL,
  contingent_total INTEGER NOT NULL,
  contingent_sold INTEGER NOT NULL DEFAULT 0,
  min_price DECIMAL(8,2) NOT NULL,
  flash_price DECIMAL(8,2) NOT NULL,
  make_offer_enabled BOOLEAN DEFAULT TRUE,
  offer_max_discount_pct DECIMAL(4,3),
  offer_min_price DECIMAL(8,2),
  cover_image_url TEXT,
  video_url TEXT,
  tixu_event_id TEXT,
  tixu_total_capacity INTEGER,
  tixu_total_sold INTEGER,
  status event_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Computed column for remaining
CREATE OR REPLACE FUNCTION event_contingent_remaining(events)
RETURNS INTEGER AS $$
  SELECT $1.contingent_total - $1.contingent_sold;
$$ LANGUAGE SQL STABLE;

-- =============================================
-- EVENT VALUE-ADDS (welche Value-Adds pro Event verfügbar)
-- =============================================
CREATE TABLE event_value_adds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  venue_value_add_id UUID NOT NULL REFERENCES venue_value_adds(id) ON DELETE CASCADE,
  quantity_available INTEGER,
  quantity_used INTEGER NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(event_id, venue_value_add_id)
);

-- =============================================
-- CUSTOMERS (nutzt Supabase Auth für Login)
-- =============================================
CREATE TABLE customers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  phone TEXT,
  first_name TEXT,
  last_name TEXT,
  stripe_customer_id TEXT,
  city TEXT,
  preferred_locale TEXT DEFAULT 'de-DE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- BOOKINGS
-- =============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  event_id UUID NOT NULL REFERENCES events(id),
  ticket_count INTEGER NOT NULL,
  price_per_ticket DECIMAL(8,2) NOT NULL,
  total_price DECIMAL(8,2) NOT NULL,
  commission_amount DECIMAL(8,2) NOT NULL,
  venue_payout_amount DECIMAL(8,2) NOT NULL,
  booking_channel booking_channel NOT NULL,
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  status booking_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TICKETS
-- =============================================
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  guest_name TEXT NOT NULL,
  qr_code_data TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  qr_code_url TEXT,
  pdf_url TEXT,
  checked_in BOOLEAN NOT NULL DEFAULT FALSE,
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- OFFERS (Make-an-Offer Verhandlungen)
-- =============================================
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  event_id UUID NOT NULL REFERENCES events(id),
  ticket_count INTEGER NOT NULL DEFAULT 2,
  offered_price DECIMAL(8,2) NOT NULL,
  counter_price DECIMAL(8,2),
  counter_value_adds JSONB DEFAULT '[]',
  attempt_number INTEGER NOT NULL CHECK (attempt_number >= 1 AND attempt_number <= 3),
  status offer_status NOT NULL DEFAULT 'pending',
  ai_response TEXT,
  booking_id UUID REFERENCES bookings(id),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- BOOKING VOUCHERS (Gutscheine für Value-Adds — Steuer-Compliance)
-- =============================================
CREATE TABLE booking_vouchers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  venue_value_add_id UUID NOT NULL REFERENCES venue_value_adds(id),
  voucher_code TEXT UNIQUE NOT NULL DEFAULT upper(encode(gen_random_bytes(4), 'hex')),
  retail_value DECIMAL(8,2) NOT NULL,
  vat_rate DECIMAL(4,3) NOT NULL,
  vat_amount DECIMAL(8,2) NOT NULL,  -- = retail_value * vat_rate / (1 + vat_rate)
  status voucher_status NOT NULL DEFAULT 'issued',
  redeemed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- CAMPAIGNS (Google Ads)
-- =============================================
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id),
  venue_id UUID NOT NULL REFERENCES venues(id),
  google_campaign_id TEXT,
  ad_variants JSONB NOT NULL DEFAULT '[]',  -- [{headline, description, cta, display_url}]
  target_radius_km INTEGER DEFAULT 30,
  target_age_min INTEGER DEFAULT 25,
  target_age_max INTEGER DEFAULT 55,
  target_interests JSONB DEFAULT '[]',
  budget_daily DECIMAL(8,2),
  budget_total DECIMAL(8,2),
  budget_spent DECIMAL(8,2) DEFAULT 0,
  weather_context JSONB,
  status campaign_status NOT NULL DEFAULT 'pending_approval',
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  rejection_note TEXT,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- CAMPAIGN RESULTS (Lern-Loop)
-- =============================================
CREATE TABLE campaign_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id),
  event_id UUID NOT NULL REFERENCES events(id),
  venue_id UUID NOT NULL REFERENCES venues(id),
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  spend DECIMAL(8,2) DEFAULT 0,
  cpa DECIMAL(8,2),
  roas DECIMAL(8,4),
  best_ad_variant_index INTEGER,
  best_headline TEXT,
  best_audience_segment TEXT,
  weather_conditions TEXT,
  ai_learnings TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- CREWS (Gruppen-Rabatte)
-- =============================================
CREATE TABLE crews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id),
  creator_customer_id UUID NOT NULL REFERENCES customers(id),
  invite_code TEXT UNIQUE NOT NULL DEFAULT lower(encode(gen_random_bytes(4), 'hex')),
  max_discount_pct DECIMAL(4,3) DEFAULT 0.35,
  status crew_status NOT NULL DEFAULT 'open',
  locked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE crew_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crew_id UUID NOT NULL REFERENCES crews(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id),
  status crew_member_status NOT NULL DEFAULT 'joined',
  discount_applied DECIMAL(4,3) DEFAULT 0,
  booking_id UUID REFERENCES bookings(id),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

-- =============================================
-- REWARDS (Loyalty / Streaks)
-- =============================================
CREATE TABLE customer_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID UNIQUE NOT NULL REFERENCES customers(id),
  total_stars INTEGER NOT NULL DEFAULT 0,
  current_tier reward_tier NOT NULL DEFAULT 'explorer',
  tier_updated_at TIMESTAMPTZ DEFAULT NOW(),
  current_streak_weeks INTEGER NOT NULL DEFAULT 0,
  longest_streak_weeks INTEGER NOT NULL DEFAULT 0,
  last_booking_week DATE,
  unique_venues_visited INTEGER NOT NULL DEFAULT 0,
  referral_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reward_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  event_type reward_event_type NOT NULL,
  stars_earned INTEGER NOT NULL,
  related_booking_id UUID REFERENCES bookings(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_events_venue ON events(venue_id);
CREATE INDEX idx_events_datetime ON events(datetime);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_event ON bookings(event_id);
CREATE INDEX idx_tickets_qr ON tickets(qr_code_data);
CREATE INDEX idx_tickets_booking ON tickets(booking_id);
CREATE INDEX idx_offers_customer_event ON offers(customer_id, event_id);
CREATE INDEX idx_crews_invite ON crews(invite_code);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_vouchers_code ON booking_vouchers(voucher_code);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Events: Live Events sind öffentlich lesbar
CREATE POLICY "Live events sind öffentlich" ON events
  FOR SELECT USING (status IN ('live', 'sold_out'));

-- Venues: Öffentliche Daten lesbar
CREATE POLICY "Aktive Venues sind öffentlich" ON venues
  FOR SELECT USING (status = 'active');

-- Bookings: Kunden sehen nur eigene
CREATE POLICY "Eigene Buchungen" ON bookings
  FOR SELECT USING (customer_id = auth.uid());

-- Tickets: Kunden sehen nur eigene + QR-Validierung
CREATE POLICY "Eigene Tickets" ON tickets
  FOR SELECT USING (customer_id = auth.uid());

-- Customers: Nur eigenes Profil
CREATE POLICY "Eigenes Profil" ON customers
  FOR ALL USING (id = auth.uid());
```

### Supabase Storage Buckets

```
venue-assets/     — Logos, Cover-Images, Promo-Videos
event-images/     — Event Cover-Images, Galerie
tickets/          — Generierte QR-Codes und PDF-Tickets
contracts/        — Unterschriebene Verträge, Vollmachten
```

### Supabase Realtime

Nutze Realtime Subscriptions für:
- Live Verfügbarkeits-Counter auf Event-Seiten
- "X Personen sehen sich das gerade an" (Presence)
- Crew-Lobby Echtzeit-Updates
- Admin-Dashboard Live-Metriken

---

## 8. API-ENDPUNKTE

### Booking Flow

**POST `/api/checkout`** — Erstellt Stripe Checkout Session
- Input: event_id, ticket_count, guest_names[], price_per_ticket, value_add_ids[] (optional)
- Erstellt Stripe Session mit Connected Account
- Commission als Application Fee
- Separate Line Items für Value-Adds mit korrekten MwSt-Sätzen
- Return: Stripe Checkout URL

**POST `/api/webhook/stripe`** — Empfängt Stripe Webhook
- Bestätigt Booking
- Generiert Ticket QR-Codes + PDF
- Erstellt Voucher-Records für Value-Adds
- Sendet Bestätigungs-E-Mail mit Ticket + Gutschein-Codes
- Dekrementiert Kontingent
- Synct zu tixu API

**GET `/api/ticket/validate?code=XXX`** — QR-Code Validierung
- Return: Valid/Invalid, Gastname, Event, Check-in Status
- Markiert als eingecheckt

**POST `/api/voucher/redeem`** — Gutschein einlösen
- Input: voucher_code
- Markiert als eingelöst (für Venue-Personal)

### Make-an-Offer

**POST `/api/offer/submit`** — Angebot einreichen
- Input: event_id, ticket_count, offered_price
- Validiert gegen Venue-Einstellungen (Versuche, Floor, Max-Rabatt)
- Prüft Value-Add Verfügbarkeit
- Ruft Claude API auf für Verhandlungsantwort
- Return: AI-Antwort mit optionalem Value-Add Bundle

**POST `/api/offer/accept`** — Angebot annehmen
- Erstellt 15-Min Reservierung
- Generiert Checkout mit Ticket + Voucher Line Items
- Return: Stripe Checkout URL

**Cron: Offer Expiry** — Läuft alle 5 Min
- Expired alle nicht-akzeptierten Offers nach 15 Min

### tixu Sync

**Cron: `/api/tixu/sync`** — Periodischer Verfügbarkeits-Sync
**POST `/api/tixu/report-sale`** — Nach bestätigter Buchung an tixu melden

### Event Automation

**Cron: Auto-Publish** — Prüft Event-Serien, veröffentlicht Events im 3-5 Tage Fenster
**Cron: Weekly Summary** — Generiert Venue-Report

---

## 9. AI MARKETING AGENT (GOOGLE ADS)

### Automatische Kampagnen-Generierung

Wenn ein Event X Tage entfernt ist (konfigurierbar, default 3):

1. Lies Kampagnen-Historie des Venues
2. Claude API generiert 3 Ad-Copy Varianten (deutsch), optimiert aus Learnings
3. Budget dynamisch setzen (Restkontingent, Tage bis Event, historischer CPA)
4. Targeting: 30km Radius, Alter 25-55, Interest-Segmente
5. Kampagne in `pending_approval` Status erstellen, Admin benachrichtigen

### Admin-Genehmigung

- Pending-Queue sortiert nach Event-Datum (dringendste zuerst)
- Ein-Klick genehmigen → sofort live auf Google Ads
- Ziel: 5-10 Kampagnen in <2 Minuten genehmigen

### Performance Learning Loop

Nach jedem Event:
1. Google Ads Metriken ziehen
2. Conversions mit TONITE-Buchungen matchen
3. CPA und ROAS berechnen
4. AI-Learning-Summary generieren
5. In campaign_results speichern → nächste Kampagne auto-optimiert

---

## 10. VENUE DOOR CHECK-IN

Route: `/scan`

- Venue-Personal öffnet auf Handy/Tablet
- Kamera scannt QR-Code
- Zeigt: ✅ Gültig (grün) mit Gastname, Event, Ticket-Anzahl ODER ❌ Ungültig/Bereits verwendet (rot)
- Markiert Ticket als eingecheckt
- Kein App-Download nötig — einfach eine Webseite

---

## 11. GESCHÄFTSREGELN (HART)

1. **Keine Sitzplatz-Auswahl** — Überraschungs-Platz wie TooGoodToGo
2. **Release-Fenster 3-5 Tage** vor Showtime (harte Plattform-Constraint)
3. **Mindestpreis ist Hard Floor** — kein Sale/Angebot darunter
4. **Make-an-Offer: max 3 Versuche** pro Kunde pro Event
5. **Value-Adds als Gutscheine** mit korrekter MwSt (7% Kultur, 19% F&B)
6. **Personalisierte Tickets** (Name, Ausweis-Kontrolle möglich)
7. **Stripe Connect Direct Charge** — TONITE hält nie Kundengelder
8. **tixu ist Read-Only** — TONITE managed eigenes Ticketing
9. **Auto-Publish** basierend auf Serien-Regeln (im 3-5 Tage Fenster)
10. **Venue verantwortlich für Stornierungen** (TONITE facilitiert Refund)
11. **Alles auf Deutsch** (UI, AI, Ads, E-Mails, Push)
12. **Crew-Rabatt auf TONITE Flash-Preis** — Venue-Mindestpreis gilt weiterhin

---

## 12. PWA-KONFIGURATION

```json
// public/manifest.json
{
  "name": "TONITE",
  "short_name": "TONITE",
  "description": "Last-Minute Erlebnisse in deiner Stadt",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0A0A0F",
  "theme_color": "#6C5CE7",
  "orientation": "portrait",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

## 13. ENVIRONMENT VARIABLES

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Claude API
ANTHROPIC_API_KEY=

# Google Ads
GOOGLE_ADS_CLIENT_ID=
GOOGLE_ADS_CLIENT_SECRET=
GOOGLE_ADS_DEVELOPER_TOKEN=
GOOGLE_ADS_MCC_ID=

# tixu
TIXU_API_URL=
TIXU_API_KEY=

# OpenWeatherMap
OPENWEATHERMAP_API_KEY=

# App
NEXT_PUBLIC_APP_URL=https://tonite.app
```

---

## 14. BUILD-REIHENFOLGE (SCHRITT FÜR SCHRITT)

### Phase 1: Foundation (Tag 1-3)
1. Next.js Projekt setup mit TypeScript, Tailwind CSS
2. Design System: Theme Tokens, Glass-Komponenten, Dark Mode
3. Supabase Projekt erstellen, Migration ausführen
4. Auth (Supabase Auth mit Magic Link + Google)
5. Basis-Layout: Navigation, Bottom-Bar (Mobile), Glassmorphism

### Phase 2: Consumer Core (Tag 4-8)
6. Home-Seite: Event-Liste mit Glass-Cards, Scarcity-Badges
7. Event-Detailseite: Hero-Image, Flash-Preis CTA, Countdown
8. Stripe Connect Integration + Checkout-Flow
9. Ticket-Generierung (QR + PDF) nach Zahlung
10. "Meine Tickets"-Seite mit QR-Codes

### Phase 3: Make-an-Offer (Tag 9-11)
11. Chat-UI Komponente (Glassmorphism, Premium-Feel)
12. Claude API Integration für Verhandlungs-Bot
13. Offer-Logik: 3 Versuche, Floor-Preis, Value-Add Bundles
14. Voucher-Erstellung bei Value-Add Deals

### Phase 4: Venue-Portal (Tag 12-15)
15. Venue-Registrierung + Onboarding Flow
16. Event-Erstellung (Einzel + Serie)
17. Verhandlungs-Konfiguration (Max-Rabatt, Value-Adds)
18. Venue-Dashboard mit Umsatz und Event-Status

### Phase 5: Admin + Door (Tag 16-18)
19. Admin-Dashboard: Übersicht, Venue-Management
20. Event-Import von tixu API
21. Door Check-in Seite (/scan) mit QR-Scanner

### Phase 6: Growth Features (Tag 19-22)
22. Crew Mode: Erstellen, Share-Link, Lobby, Rabatt-Eskalation
23. Streak & Rewards: Tiers, Sterne, Streak-Flamme
24. Scarcity-Elemente: Live-Viewer, Buchungs-Toasts, Countdown

### Phase 7: Marketing (Tag 23-25)
25. Google Ads Campaign-Generator mit Claude API
26. Admin Kampagnen-Genehmigung (Ein-Klick)
27. Performance Learning Loop

### Phase 8: Polish (Tag 26-28)
28. PWA-Konfiguration (manifest.json, Service Worker)
29. E-Mail Templates (Buchungsbestätigung, Venue-Report)
30. SEO-Optimierung der Event-Landing-Pages
31. Performance-Optimierung (Image Caching, Skeleton Screens)
32. Testen: Checkout-Flow, Offer-Flow, Crew-Flow, QR-Scan

---

## 15. ERFOLGSMETRIKEN MVP

- 50-100 Tickets verkauft in 4 Wochen
- 2 GOP-Venues live (Essen + Bonn)
- Checkout-Conversion > 15%
- Make-an-Offer Nutzung > 20% der Besucher
- Durchschnittliche Buchungszeit < 60 Sek (Flash)
- ≥5 Crews erstellt in 4 Wochen
- Google Ads ROAS > 5x
- Null Zahlungs-/Ticketing-Fehler
- App Store Rating Ziel: 4.5+ (wenn native App kommt)

---

## WICHTIG: DAS IST KEIN DISCOUNT-PORTAL

TONITE ist eine **Premium-Erlebnis-Plattform**. Das Design, der Ton, die Sprache — alles muss sich anfühlen wie eine exklusive Einladung zu einem besonderen Abend, nicht wie ein Schnäppchen-Portal. Die Glass-Effekte, das dunkle Theme, die cinematischen Event-Bilder — das alles kommuniziert: "Das hier ist besonders."
