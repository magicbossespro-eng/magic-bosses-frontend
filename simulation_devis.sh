#!/bin/bash
# ================================================
# MAGIC BOSSES — Simulation 30 demandes de devis
# ================================================
# Envoie 30 fausses demandes au backend Railway
# pour tester le panneau admin.
# Usage : bash simulation_devis.sh

BACKEND="https://magic-bosses-backend-production.up.railway.app/webhook/devis"

send() {
  local NOM="$1" PRENOM="$2" TEL="$3" ADRESSE="$4" TYPE="$5" NOTES="$6" CRENEAU="$7"
  echo "→ Envoi devis : $PRENOM $NOM ($TYPE)..."
  curl -s -o /dev/null -w "  HTTP %{http_code}\n" \
    -X POST "$BACKEND" \
    -H "Content-Type: application/json" \
    -d "{
      \"client_nom\":       \"$NOM\",
      \"client_prenom\":    \"$PRENOM\",
      \"client_telephone\": \"$TEL\",
      \"adresse\":          \"$ADRESSE\",
      \"creneau\":          \"$CRENEAU\",
      \"type_prestation\":  \"$TYPE\",
      \"notes\":            \"$NOTES\",
      \"photo_url\":        null
    }"
  sleep 0.5
}

echo ""
echo "=== MAGIC BOSSES — Lancement simulation 30 devis ==="
echo ""

# ---- JOUR 1 (semaine passée) ----
echo "--- Semaine J-7 ---"
send "Martin"    "Lucas"    "06 12 34 56 78" "14 rue de la Paix, 39000 Lons-le-Saunier"          "simple"    "Bosse portière avant droite, taille bille de golf, choc parking"           "Lundi matin, Mercredi après-midi"
send "Bernard"   "Sophie"   "07 23 45 67 89" "3 allée des Acacias, 39570 Gevingey"                "arete"     "Bosse sur l'aile avant, impact avec poteau, arête bien marquée"             "Mardi matin"
send "Dupont"    "Pierre"   "06 34 56 78 90" "8 rue Gambetta, 39100 Dole"                         "technique"  "Grande bosse capot suite chute objet, 15 cm environ, urgent"               "Jeudi, Vendredi"
send "Leclerc"   "Marie"    "07 45 67 89 01" "22 avenue de la République, 01000 Bourg-en-Bresse"  "grele"     "Tempête du 3 avril, nombreuses bosses sur le toit et capot"                 "Dès que possible"
send "Moreau"    "Jean"     "06 56 78 90 12" "5 impasse du Moulin, 39200 Saint-Claude"            "simple"    "Petite bosse coffre côté passager, parking supermarché"                    "Mercredi après-midi, Jeudi matin"

sleep 1

# ---- JOUR 2 ----
echo ""
echo "--- Semaine J-5 ---"
send "Girard"    "Isabelle" "07 67 89 01 23" "17 route de Bresse, 71100 Chalon-sur-Saône"        "simple"    "Bosse sur portière arrière gauche, 3 cm, aucune peinture touchée"          "Lundi matin"
send "Robert"    "Thomas"   "06 78 90 12 34" "9 rue Victor Hugo, 39300 Champagnole"               "arete"     "Aile avant droite choquée, bosse sur arête avec légère marque"             "Mardi, Jeudi"
send "Petit"     "Camille"  "07 89 01 23 45" "31 avenue Jean Jaurès, 39000 Lons-le-Saunier"      "grele"     "Grêle il y a 2 semaines, je suis assuré tous risques, urgent"              "N'importe quel jour"
send "Dumont"    "Nicolas"  "06 90 12 34 56" "12 rue du Bief, 01340 Montrevel-en-Bresse"         "simple"    "Choc léger au parking, bosse portière conducteur"                         "Vendredi matin"
send "Fontaine"  "Aurélie"  "07 01 23 45 67" "6 chemin des Vignes, 39570 Crançot"                "technique"  "Bosse complexe sur le montant B, difficile à voir mais ça se sent"         "Mercredi"

sleep 1

# ---- JOUR 3 ----
echo ""
echo "--- Semaine J-4 ---"
send "Marchand"  "Antoine"  "06 11 22 33 44" "28 rue de la Mairie, 39120 Chaussin"               "simple"    "Petite bosse portière arrière droite, 2 cm, stationnement rue étroite"     "Lundi, Mardi"
send "Lambert"   "Julie"    "07 22 33 44 55" "4 avenue Aristide Briand, 39000 Lons-le-Saunier"   "grele"     "Ma voiture a pris la grêle début avril, beaucoup de marques sur le capot" "Dès que possible, urgent"
send "Simon"     "Alexandre" "06 33 44 55 66" "19 route Nationale, 01300 Belley"                 "arete"     "Impact portière conducteur avec arête, peinture intacte"                  "Jeudi après-midi"
send "Michel"    "Laura"    "07 44 55 66 77" "7 place du Marché, 39600 Arbois"                   "simple"    "Bosse coffre suite recul dans parking couvert"                             "Mardi matin, Mercredi matin"
send "Leroy"     "Sébastien" "06 55 66 77 88" "52 rue des Jardins, 71200 Le Creusot"              "technique"  "Grande bosse sur le toit, impacte sur toute la surface"                   "Semaine prochaine"

sleep 1

# ---- JOUR 4 ----
echo ""
echo "--- Semaine J-2 ---"
send "Roux"      "Céline"   "07 66 77 88 99" "11 impasse des Fleurs, 39130 Clairvaux-les-Lacs"   "simple"    "Bosse sur l'aile arrière gauche, choc léger voiture voisine"               "Vendredi ou samedi"
send "Blanc"     "Maxime"   "06 77 88 99 00" "3 rue du Commerce, 39000 Lons-le-Saunier"          "arete"     "Bosse + arête sur capot, impact branche tombée pendant la tempête"        "Lundi matin en priorité"
send "Gauthier"  "Emilie"   "07 88 99 00 11" "16 voie des Combes, 39100 Dole"                    "simple"    "Petite bosse porte conducteur, choc de chariot supermarché"               "Jeudi matin"
send "Morin"     "Julien"   "06 99 00 11 22" "42 avenue de Genève, 01200 Bellegarde-sur-Valserine" "grele"  "Véhicule grêlé mi-mars, assurance AXA, besoin devis rapide"               "Dès que possible"
send "Lefebvre"  "Nathalie" "07 00 11 22 33" "8 rue Saint-Désiré, 39200 Saint-Claude"            "simple"    "Petite bosse coffre, impact inconnu au parking de la gare"                "Mercredi ou jeudi"

sleep 1

# ---- JOUR 5 (cette semaine) ----
echo ""
echo "--- Cette semaine ---"
send "Rousseau"  "Bastien"  "06 11 33 55 77" "25 avenue Léon Blum, 71000 Mâcon"                 "technique"  "Grande bosse portière avant droite après accrochage, très profonde"        "Le plus tôt possible"
send "Chevalier" "Laure"    "07 22 44 66 88" "13 rue des Tilleuls, 39230 Sellières"              "simple"    "Bosse discrète sur la porte arrière, 2 cm, choc parking"                  "Lundi ou mardi"
send "Faure"     "Renaud"   "06 33 55 77 99" "6 grande rue, 01260 Relevant"                     "arete"     "Choc arête aile avant après accrochage avec borne parking"                "Vendredi"
send "André"     "Virginie" "07 44 66 88 00" "20 chemin du Château, 39130 Orgelet"               "simple"    "2 petites bosses portière arrière gauche, impact voiture en stationnement" "Mardi après-midi, Jeudi matin"
send "Mercier"   "Florian"  "06 55 77 99 11" "9 place de la Bascule, 71120 Charolles"            "grele"     "Grêle 8 avril, toiture et capot très touchés, contrat Maif"               "Urgent — semaine prochaine max"

sleep 1

# ---- JOUR 6 (aujourd'hui / hier) ----
echo ""
echo "--- Aujourd'hui / Hier ---"
send "Bonnet"    "Alexis"   "07 66 88 00 22" "14 rue des Ecoles, 39000 Lons-le-Saunier"          "simple"    "Bosse portière passager, 3 cm, aucun dommage peinture, urgent"            "Cette semaine"
send "Perrin"    "Charlotte" "06 77 99 11 33" "5 allée des Pins, 39800 Poligny"                  "arete"     "Arête marquée sur le capot après choc branches lors tempête"              "Dès que possible"
send "Colin"     "Marc"     "07 88 00 22 44" "3 square des Roses, 01000 Bourg-en-Bresse"         "grele"     "Grêle hier soir, voiture couverte de petites bosses, assurance MAAF"       "Demain si possible !"
send "Garnier"   "Estelle"  "06 99 11 33 55" "21 rue Pasteur, 71700 Tournus"                     "technique"  "Grande bosse toit pano suite chute objet, complexe à traiter je pense"    "Vendredi ou la semaine prochaine"
send "Henry"     "Baptiste" "07 00 22 44 66" "11 route des Lacs, 39130 Clairvaux-les-Lacs"       "simple"    "Petite bosse coffre en bas à droite, très discrète, quasiment rien"       "Semaine prochaine, matin"

echo ""
echo "=== Simulation terminée : 30 devis envoyés ==="
echo "Ouvre le panneau admin sur le site pour vérifier."
echo ""
