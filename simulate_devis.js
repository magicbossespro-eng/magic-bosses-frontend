/**
 * simulate_devis.js — Simulation de ~30 demandes de devis Magic Bosses
 * Réparties sur ~7 jours (du 5 au 11 avril 2026)
 *
 * Usage : node simulate_devis.js
 * (Node.js 18+ requis — fetch natif)
 */

const BACKEND_URL = 'https://magic-bosses-backend-production.up.railway.app';

// ─── Données réalistes de la région (Jura, Ain, Saône-et-Loire) ───────────────

const PRENOMS = ['Thomas', 'Julien', 'Marie', 'Sophie', 'Nicolas', 'Camille',
  'Pierre', 'Laura', 'Antoine', 'Lucie', 'Romain', 'Céline', 'Florian',
  'Aurélie', 'Mathieu', 'Isabelle', 'David', 'Nathalie', 'Kevin', 'Émilie',
  'Sébastien', 'Pauline', 'Alexis', 'Marion', 'Christophe', 'Stéphanie',
  'Jonathan', 'Virginie', 'Benoît', 'Sandrine'];

const NOMS = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard',
  'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre',
  'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier',
  'Morel', 'Girard', 'André', 'Lefèvre', 'Mercier', 'Dupont', 'Lambert',
  'Bonnet', 'François', 'Martinez'];

// Adresses dans les zones couvertes : Jura (39), Ain (01), Saône-et-Loire (71)
const ADRESSES = [
  // Jura 39
  { rue: '12 Rue de la République',     cp: '39000', ville: 'Lons-le-Saunier' },
  { rue: '5 Avenue de Genève',          cp: '39000', ville: 'Lons-le-Saunier' },
  { rue: '28 Rue du Commerce',          cp: '39000', ville: 'Lons-le-Saunier' },
  { rue: '3 Chemin des Vignes',         cp: '39000', ville: 'Lons-le-Saunier' },
  { rue: '17 Route de Besançon',        cp: '39000', ville: 'Lons-le-Saunier' },
  { rue: '9 Rue Saint-Désiré',          cp: '39300', ville: 'Champagnole' },
  { rue: '14 Avenue de la Gare',        cp: '39300', ville: 'Champagnole' },
  { rue: '2 Rue des Fleurs',            cp: '39600', ville: 'Arbois' },
  { rue: '7 Place de la Liberté',       cp: '39200', ville: 'Saint-Claude' },
  { rue: '33 Route Nationale',          cp: '39570', ville: 'Montmorot' },
  { rue: '6 Impasse du Moulin',         cp: '39230', ville: 'Sellières' },
  // Ain 01
  { rue: '45 Rue Victor Hugo',          cp: '01000', ville: 'Bourg-en-Bresse' },
  { rue: '11 Allée des Champs',         cp: '01000', ville: 'Bourg-en-Bresse' },
  { rue: '22 Boulevard de la Victoire', cp: '01100', ville: 'Oyonnax' },
  { rue: '8 Rue du Bief',              cp: '01460', ville: 'Mézériat' },
  { rue: '19 Route de Lyon',            cp: '01370', ville: 'Saint-Étienne-du-Bois' },
  // Saône-et-Loire 71
  { rue: '55 Rue Carnot',              cp: '71000', ville: 'Mâcon' },
  { rue: '30 Avenue de Lattre',         cp: '71000', ville: 'Mâcon' },
  { rue: '4 Place du Marché',           cp: '71700', ville: 'Tournus' },
  { rue: '13 Rue de la Paix',           cp: '71160', ville: 'Digoin' },
  { rue: '27 Chemin Rural',             cp: '71580', ville: 'Saillenard' },
];

const TYPES_BOSSE = ['simple', 'arete', 'technique', 'grele', 'sais_pas'];

const CRENEAUX = [
  'Lundi matin', 'Lundi après-midi',
  'Mardi matin', 'Mardi après-midi',
  'Mercredi matin', 'Mercredi après-midi',
  'Jeudi matin', 'Jeudi après-midi',
  'Vendredi matin', 'Vendredi après-midi',
  'Samedi matin',
];

const NOTES = [
  'Bosse suite à un choc de portière dans un parking.',
  'Grêle la semaine dernière, plusieurs petites bosses sur le capot.',
  'Impact sur l\'aile arrière gauche, pas trop profond.',
  'Mon fils a ouvert la porte trop fort contre un poteau.',
  'Bosse sur le toit, peut-être grêle, pas sûr.',
  'Choc léger en reculant, bosse sur le pare-choc.',
  '',
  'Je peux envoyer des photos supplémentaires si besoin.',
  'Disponible rapidement, urgent pour moi.',
  'Voiture de société, besoin d\'une facture.',
  '',
  'Bosse sur la portière passager, assez visible.',
  'Plusieurs bosses de grêle réparties sur la carrosserie.',
  'Impact parking, propriétaire pas retrouvé.',
  '',
];

// ─── Utilitaires ──────────────────────────────────────────────────────────────

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN(arr, n) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function randomPhone() {
  const prefixes = ['06', '07'];
  const prefix = pick(prefixes);
  const digits = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('');
  return prefix + digits;
}

// Génère un timestamp dans une plage de jours passés (entre dayMin et dayMax jours en arrière)
function randomTimestamp(dayMin, dayMax) {
  const now = Date.now();
  const msDay = 24 * 60 * 60 * 1000;
  const offsetMs = (Math.random() * (dayMax - dayMin) + dayMin) * msDay;
  const ts = now - offsetMs;
  // Heure entre 8h et 20h
  const d = new Date(ts);
  d.setHours(8 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60), 0, 0);
  return d.toISOString();
}

function buildDevis(index) {
  const adresse = pick(ADRESSES);
  const disponibilites = pickN(CRENEAUX, 1 + Math.floor(Math.random() * 3));
  // Répartition sur 7 jours : les 30 devis couvrent de J-7 à J-1
  const dayMin = ((index / 30) * 6);       // 0 → 0j, 29 → ~6j
  const dayMax = dayMin + 1.2;

  return {
    timestamp:    randomTimestamp(dayMin, dayMax),
    client_nom:   pick(NOMS),
    client_prenom: pick(PRENOMS),
    client_telephone: randomPhone(),
    adresse:      `${adresse.rue}, ${adresse.cp} ${adresse.ville}`,
    creneau:      disponibilites.join(', '),
    type_prestation: pick(TYPES_BOSSE),
    notes:        pick(NOTES),
    photo_url:    null,
  };
}

// ─── Envoi avec délai entre chaque requête ───────────────────────────────────

async function sendDevis(devis, index) {
  const label = `[${String(index + 1).padStart(2, '0')}/30] ${devis.client_prenom} ${devis.client_nom} — ${devis.adresse.split(',')[1]?.trim()}`;
  try {
    const res = await fetch(BACKEND_URL + '/webhook/devis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(devis),
    });
    const status = res.status;
    if (status >= 200 && status < 300) {
      console.log(`✅ ${label} → ${status}`);
    } else {
      const text = await res.text().catch(() => '');
      console.warn(`⚠️  ${label} → HTTP ${status} — ${text.slice(0, 100)}`);
    }
  } catch (err) {
    console.error(`❌ ${label} → ERREUR RÉSEAU: ${err.message}`);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  Magic Bosses — Simulation de 30 demandes de devis');
  console.log(`  Backend : ${BACKEND_URL}`);
  console.log('═══════════════════════════════════════════════════════\n');

  // Génère les 30 devis triés chronologiquement (du plus ancien au plus récent)
  const devis = Array.from({ length: 30 }, (_, i) => buildDevis(i))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  console.log('Devis générés (ordre chronologique) :\n');
  devis.forEach((d, i) => {
    const date = new Date(d.timestamp).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
    console.log(`  ${String(i + 1).padStart(2, '0')}. [${date}] ${d.client_prenom} ${d.client_nom} — ${d.type_prestation} — ${d.adresse.split(',')[1]?.trim()}`);
  });

  console.log('\n────────────────────────────────────────────────────────');
  console.log('Envoi vers le backend...\n');

  for (let i = 0; i < devis.length; i++) {
    await sendDevis(devis[i], i);
    if (i < devis.length - 1) {
      await sleep(400); // 400ms entre chaque envoi pour ne pas spammer
    }
  }

  console.log('\n════════════════════════════════════════════════════════');
  console.log('  Simulation terminée — 30 devis envoyés !');
  console.log('  Vérifie ton app Magic Bosses pour voir les résultats.');
  console.log('════════════════════════════════════════════════════════');
}

main();
