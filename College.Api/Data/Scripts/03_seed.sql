-------------------------------------------------
-- Insertion des matières
-------------------------------------------------
INSERT INTO matieres (nom) VALUES
('Mathématiques'),
('Français'),
('Histoire-Géographie'),
('Physiques-Chimie'),
('SVT'),
('Anglais'),
('Espagnol');

-------------------------------------------------
-- Insertion des professeurs
-------------------------------------------------
INSERT INTO professeurs (nom, prenom, genre) VALUES
('Dubois', 'Marie', 'F'),
('Martin', 'Pierre', 'M'),
('Bernard', 'Sophie', 'F'),
('Dupont', 'Jean', 'M');

-------------------------------------------------
-- Insertion des classes avec professeur principal
-------------------------------------------------
INSERT INTO classes (niveau_nom, professeur_principal_id) VALUES
('Sixième', (SELECT id FROM professeurs WHERE nom = 'Dubois' AND prenom = 'Marie')),
('Cinquième', (SELECT id FROM professeurs WHERE nom = 'Martin' AND prenom = 'Pierre')),
('Quatrième', (SELECT id FROM professeurs WHERE nom = 'Bernard' AND prenom = 'Sophie')),
('Troisième', (SELECT id FROM professeurs WHERE nom = 'Dupont' AND prenom = 'Jean'));

-------------------------------------------------
-- Association professeurs-matières
-------------------------------------------------
INSERT INTO professeur_matieres (professeur_id, matiere_id) VALUES
-- Marie Dubois - Mathématiques et Physiques-Chimie
((SELECT id FROM professeurs WHERE nom = 'Dubois' AND prenom = 'Marie'),
 (SELECT id FROM matieres WHERE nom = 'Mathématiques')),
((SELECT id FROM professeurs WHERE nom = 'Dubois' AND prenom = 'Marie'),
 (SELECT id FROM matieres WHERE nom = 'Physiques-Chimie')),

-- Pierre Martin - Français et Histoire-Géographie
((SELECT id FROM professeurs WHERE nom = 'Martin' AND prenom = 'Pierre'),
 (SELECT id FROM matieres WHERE nom = 'Français')),
((SELECT id FROM professeurs WHERE nom = 'Martin' AND prenom = 'Pierre'),
 (SELECT id FROM matieres WHERE nom = 'Histoire-Géographie')),

-- Sophie Bernard - Anglais et Espagnol
((SELECT id FROM professeurs WHERE nom = 'Bernard' AND prenom = 'Sophie'),
 (SELECT id FROM matieres WHERE nom = 'Anglais')),
((SELECT id FROM professeurs WHERE nom = 'Bernard' AND prenom = 'Sophie'),
 (SELECT id FROM matieres WHERE nom = 'Espagnol')),

 --Dupond Jean - SVT
 ((SELECT id FROM professeurs WHERE nom = 'Dupont' AND prenom = 'Jean'),
 (SELECT id FROM matieres WHERE nom = 'SVT'));


-------------------------------------------------
-- Insertion des élèves
-------------------------------------------------
INSERT INTO eleves (nom, prenom, genre, classe_id) VALUES
-- Sixième 
('Lemaire', 'Leon', 'M', (SELECT id FROM classes WHERE niveau_nom = 'Sixième')),
('Lefebvre', 'Lea', 'F', (SELECT id FROM classes WHERE niveau_nom = 'Sixième')),

-- Cinquième
('Boujar', 'Hugo', 'M', (SELECT id FROM classes WHERE niveau_nom = 'Cinquième')),
('LeBoeuf', 'Lisa', 'F', (SELECT id FROM classes WHERE niveau_nom = 'Cinquième')),

-- Quatrième
('Sabin', 'Ilias', 'M', (SELECT id FROM classes WHERE niveau_nom = 'Quatrième')),
('Legros', 'Rose', 'F', (SELECT id FROM classes WHERE niveau_nom = 'Quatrième')),

-- Troisième
('Dupont', 'Marc', 'M', (SELECT id FROM classes WHERE niveau_nom = 'Troisième')),
('Bamba', 'Celine', 'F', (SELECT id FROM classes WHERE niveau_nom = 'Troisième'));

-------------------------------------------------
-- Insertion de quelques notes
-------------------------------------------------
INSERT INTO notes (noteValue, eleve_id, matiere_id, professeur_id) VALUES
-- Notes pour Lemaire Leon
(15.50,
 (SELECT id FROM eleves WHERE nom = 'Lemaire' AND prenom = 'Leon'),
 (SELECT id FROM matieres WHERE nom = 'Mathématiques'),
 (SELECT id FROM professeurs WHERE nom = 'Dubois' AND prenom = 'Marie')),

(12.00,
 (SELECT id FROM eleves WHERE nom = 'Lemaire' AND prenom = 'Leon'),
 (SELECT id FROM matieres WHERE nom = 'Français'),
 (SELECT id FROM professeurs WHERE nom = 'Martin' AND prenom = 'Pierre'));
