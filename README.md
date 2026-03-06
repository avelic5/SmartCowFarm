# OIS – Pametna Farma Krava

Moderna web aplikacija za upravljanje farmom krava bazirana na AI tehnologiji. Aplikacija je u potpunosti prevedena na bosanski jezik i koristi React, TypeScript, Tailwind CSS i React Router.

## 🚀 Karakteristike

- ✅ **Kompletno na bosanskom jeziku** - Cijela aplikacija i UI preveden na bosanski
- ✅ **Tailwind CSS** - Moderna i responzivna stilizacija
- ✅ **React Router** - Puno funkcionalno rutiranje između stranica
- ✅ **TypeScript** - Type-safe kod sa boljom podrškom za razvoj
- ✅ **Funkcionalni state management** - Context API za upravljanje podacima
- ✅ **Responsivni dizajn** - Radi na svim uređajima

## 📋 Dostupne stranice

- **Prijava** - `/prijava` - Ekran za prijavljivanje korisnika
- **Kontrolna tabla** - `/kontrolna-tabla` - Dashboard sa pregledom farme
- **Krave** - `/krave` - Lista svih krava u stadu
  - `/krave/nova` - Dodavanje nove krave
  - `/krave/:id` - Detalji pojedinačne krave
  - `/krave/:id/uredi` - Uređivanje krave
- **Proizvodnja mlijeka** - `/proizvodnja-mlijeka` - Evidencija proizvodnje
- **Zdravlje i reprodukcija** - `/zdravlje-reprodukcija` - Praćenje zdravlja
- **Senzori i okolina** - `/senzori-okolina` - Praćenje uslova u staji
- **Zadaci** - `/zadaci` - Upravljanje dnevnim zadacima
- **Upozorenja** - `/upozorenja` - Sistemska upozorenja i notifikacije
- **Izvještaji** - `/izvjestaji` - Generisanje izvještaja
- **Korisnici i uloge** - `/korisnici-uloge` - Upravljanje korisnicima
- **Postavke** - `/postavke` - Sistemske postavke

## 🛠️ Tehnologije

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool i development server
- **React Router v7** - Rutiranje
- **Tailwind CSS** - Styling framework
- **Recharts** - Grafikoni i vizualizacija podataka
- **Lucide React** - Ikone
- **Radix UI** - Pristupačne UI komponente

## 📦 Instalacija

1. Klonirajte repozitorij
```bash
git clone <repository-url>
cd SmartCowFarm
```

2. Instalirajte zavisnosti
```bash
npm install
```

3. Pokrenite development server
```bash
npm run dev
```

4. Otvorite aplikaciju u browseru
```
http://localhost:3001
```

## 🏗️ Build za produkciju

```bash
npm run build
```

Build fajlovi će biti kreirani u `build/` direktoriju.

## 📁 Struktura projekta

```
SmartCowFarm/
├── src/
│   ├── components/          # Reusable komponente
│   │   ├── NavigacijskaSideBar.tsx
│   │   └── Zaglavlje.tsx
│   ├── context/            # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── DataContext.tsx
│   ├── pages/              # Stranice aplikacije
│   │   ├── EkranPrijave.tsx
│   │   ├── KontrolnaTabla.tsx
│   │   ├── ListaKrava.tsx
│   │   ├── DetaljiKrave.tsx
│   │   ├── FormaKrave.tsx
│   │   ├── Zadaci.tsx
│   │   ├── Upozorenja.tsx
│   │   └── ...
│   ├── types/              # TypeScript type definicije
│   │   └── index.ts
│   ├── App.tsx             # Glavna aplikacija sa rutama
│   ├── main.tsx            # Entry point
│   └── index.css           # Tailwind CSS i globalni stilovi
├── package.json
└── vite.config.ts
```

## 💾 Data Management

Aplikacija koristi React Context API za upravljanje podacima:

- **AuthContext** - Autentifikacija i korisničke informacije
- **DataContext** - Podaci o kravama, proizvodnji, zadacima, upozorenjima

### Mock podaci

Aplikacija trenutno koristi mock podatke za demonstraciju. U produkciji, ovi podaci bi bili zamijenjeni sa API pozivima ka backend servisu.

## 🎨 Komponente

### Navigacija
- `NavigacijskaSideBar` - Bočna navigaciona traka
- `Zaglavlje` - Gornja traka sa pretragom i korisničkim informacijama

### Stranice
- `EkranPrijave` - Login screen
- `KontrolnaTabla` - Dashboard sa KPI karticama i grafikonima
- `ListaKrava` - Tabela sa filtiranjem i pretragom
- `DetaljiKrave` - Detaljni prikaz pojedinačne krave
- `FormaKrave` - Forma za dodavanje/uređivanje krave
- `Zadaci` - Lista zadataka sa statusima
- `Upozorenja` - Sistemska upozorenja

## 🔐 Autentifikacija

Trenutno implementirana je mock autentifikacija. Možete se prijaviti sa bilo kojom email adresom i lozinkom.

Za produkcijsku upotrebu, integrišite sa pravim backend API-jem za autentifikaciju.

## 📱 Responzivnost

Aplikacija je u potpunosti responzivna i radi na:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (< 768px)

## 🌐 Lokalizacija

Aplikacija je u potpunosti na bosanskom jeziku:
- UI elementi
- Poruke
- Datumi (format: DD.MM.YYYY)
- Nazivi stranica i komponenti

## 🚧 Stranice u izradi

Sljedeće stranice su djelimično implementirane i zahtijevaju dodatni razvoj:
- Proizvodnja mlijeka
- Zdravlje i reprodukcija
- Senzori i okolina
- Izvještaji
- Korisnici i uloge
- Postavke

## 🤝 Doprinos

Ova aplikacija je spremna za dalji razvoj. Možete dodati:
- Backend integraciju (REST API ili GraphQL)
- Bazu podataka
- Autentifikaciju sa JWT
- Real-time updates (WebSocket)
- Export u PDF/Excel
- Email notifikacije
- Mobile aplikaciju

## 📄 Licenca

Copyright © 2025 OIS Pametna Farma Krava. Sva prava zadržana.

---

**Razvijeno sa ❤️ za modernu poljoprivredu u Bosni i Hercegovini**

