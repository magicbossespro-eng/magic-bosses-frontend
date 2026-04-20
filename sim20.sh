#!/bin/bash
BACKEND="https://magic-bosses-backend-production.up.railway.app/webhook/devis"

send() {
  local NOM="$1" PRENOM="$2" TEL="$3" ADRESSE="$4" TYPE="$5" NOTES="$6" CRENEAU="$7"
  echo -n "→ $PRENOM $NOM | $ADRESSE | $TYPE ... "
  curl -s -o /dev/null -w "HTTP %{http_code}\n" \
    -X POST "$BACKEND" \
    -H "Content-Type: application/json" \
    -d "{\"client_nom\":\"$NOM\",\"client_prenom\":\"$PRENOM\",\"client_telephone\":\"$TEL\",\"adresse\":\"$ADRESSE\",\"creneau\":\"$CRENEAU\",\"type_prestation\":\"$TYPE\",\"notes\":\"$NOTES\",\"photo_url\":null}"
  sleep 0.4
}

echo ""
echo "=== MAGIC BOSSES — 20 nouveaux clients ==="
echo ""

send "Perrot"     "Théo"      "06 10 20 30 40" "7 rue des Capucines, 39000 Lons-le-Saunier"            "simple"    "Bosse portière avant droite, 3 cm, parking Leclerc"                          "Lundi matin"
send "Jacquet"    "Manon"     "07 21 31 41 51" "15 allée du Parc, 39570 Gevingey"                      "grele"     "Grêle 10 avril, capot + toit couverts, assurance Groupama"                   "Dès que possible"
send "Tissot"     "Hugo"      "06 32 42 52 62" "22 rue de la Liberté, 39100 Dole"                      "arete"     "Arête portière conducteur, choc portière voisine en parking"                 "Mardi ou mercredi"
send "Magnin"     "Lucie"     "07 43 53 63 73" "4 chemin des Prés, 39130 Orgelet"                      "simple"    "Petite bosse aile arrière, choc léger sortie de garage"                      "Jeudi après-midi"
send "Vallet"     "Tristan"   "06 54 64 74 84" "18 avenue de la Gare, 01000 Bourg-en-Bresse"           "technique"  "Grande bosse sur le montant C, impact fort, complexe"                        "Vendredi matin"
send "Berthier"   "Elisa"     "07 65 75 85 95" "9 place de la République, 39800 Poligny"               "simple"    "2 bosses portière passager, chariot de supermarché"                          "Lundi ou mardi matin"
send "Clerc"      "Nathan"    "06 76 86 96 06" "33 route de Lyon, 01480 Fareins"                       "grele"     "Véhicule grêlé lors de l'orage du 8 avril, MAIF, urgent"                    "Cette semaine"
send "Picard"     "Océane"    "07 87 97 07 17" "11 impasse des Charmes, 39230 Sellières"               "arete"     "Aile avant gauche, impact poteau parking, arête visible"                    "Mercredi matin"
send "Dupuis"     "Romain"    "06 98 08 18 28" "5 rue Saint-Nicolas, 71100 Chalon-sur-Saône"           "simple"    "Petite bosse coffre, inconnu au parking de la gare SNCF"                    "Jeudi ou vendredi"
send "Aubert"     "Clara"     "07 09 19 29 39" "27 avenue de la Victoire, 39000 Lons-le-Saunier"       "technique"  "Bosse capot suite chute branche, grande surface, 20 cm"                     "Semaine prochaine"
send "Renard"     "Dylan"     "06 20 30 40 50" "8 rue Voltaire, 01300 Belley"                          "simple"    "Bosse portière arrière droite, 4 cm, accident parking voiture voisine"      "Mardi matin"
send "Salmon"     "Pauline"   "07 31 41 51 61" "16 chemin du Bief, 39600 Arbois"                       "grele"     "Beaucoup de petites bosses sur toit et capot, tempête de grêle"             "Lundi de préférence"
send "Laurent"    "Kevin"     "06 42 52 62 72" "3 avenue Jean Moulin, 71200 Le Creusot"                "arete"     "Choc arête sur capot, impact fort, peinture intacte"                         "Vendredi ou samedi"
send "Millet"     "Sarah"     "07 53 63 73 83" "19 rue du Château, 39200 Saint-Claude"                 "simple"    "Bosse aile avant droite, choc portail de garage"                            "N'importe quand"
send "Bourgeois"  "Théodore"  "06 64 74 84 94" "6 square des Iris, 39110 Salins-les-Bains"             "simple"    "Bosse sur la porte conducteur, 2 cm, très discrète"                          "Mercredi après-midi"
send "Gros"       "Emeline"   "07 75 85 95 05" "24 route de Bresse, 71700 Tournus"                     "technique"  "Grande bosse toit panoramique après chute objet, urgent"                    "Le plus tôt possible"
send "Moulin"     "Florent"   "06 86 96 06 16" "1 rue des Artisans, 39000 Lons-le-Saunier"             "grele"     "Toiture et capot grêlés le 8 avril, assurance Allianz, franchise OK"        "Dès que possible"
send "Brun"       "Inès"      "07 97 07 17 27" "12 allée des Marronniers, 01200 Bellegarde-sur-Valserine" "simple" "Petite bosse portière arrière gauche, parking centre commercial"             "Jeudi matin"
send "Courtois"   "Loïc"      "06 08 18 28 38" "30 grande rue, 39260 Moirans-en-Montagne"              "arete"     "Arête marquée sur aile arrière droite, choc inconnu en stationnement"      "Mardi ou mercredi"
send "Delorme"    "Agathe"    "07 19 29 39 49" "14 chemin des Vignobles, 39570 Crançot"                "simple"    "Bosse portière avant gauche, 3 cm, choc ouverture porte dans garage"        "Lundi matin en priorité"

echo ""
echo "=== 20 clients envoyés — vérifier le panneau admin ==="
