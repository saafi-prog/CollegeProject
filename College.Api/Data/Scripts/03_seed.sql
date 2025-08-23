-------------------------------------------------
-- Insertion des mati�res
-------------------------------------------------
INSERT INTO matieres (nom) VALUES
('Math�matiques'),
('Fran�ais'),
('Histoire-G�ographie'),
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
('Sixi�me', (SELECT id FROM professeurs WHERE nom = 'Dubois' AND prenom = 'Marie')),
('Cinqui�me', (SELECT id FROM professeurs WHERE nom = 'Martin' AND prenom = 'Pierre')),
('Quatri�me', (SELECT id FROM professeurs WHERE nom = 'Bernard' AND prenom = 'Sophie')),
('Troisi�me', (SELECT id FROM professeurs WHERE nom = 'Dupont' AND prenom = 'Jean'));

-------------------------------------------------
-- Association professeurs-mati�res
-------------------------------------------------
INSERT INTO professeur_matieres (professeur_id, matiere_id) VALUES
-- Marie Dubois - Math�matiques et Physiques-Chimie
((SELECT id FROM professeurs WHERE nom = 'Dubois' AND prenom = 'Marie'),
 (SELECT id FROM matieres WHERE nom = 'Math�matiques')),
((SELECT id FROM professeurs WHERE nom = 'Dubois' AND prenom = 'Marie'),
 (SELECT id FROM matieres WHERE nom = 'Physiques-Chimie')),

-- Pierre Martin - Fran�ais et Histoire-G�ographie
((SELECT id FROM professeurs WHERE nom = 'Martin' AND prenom = 'Pierre'),
 (SELECT id FROM matieres WHERE nom = 'Fran�ais')),
((SELECT id FROM professeurs WHERE nom = 'Martin' AND prenom = 'Pierre'),
 (SELECT id FROM matieres WHERE nom = 'Histoire-G�ographie')),

-- Sophie Bernard - Anglais et Espagnol
((SELECT id FROM professeurs WHERE nom = 'Bernard' AND prenom = 'Sophie'),
 (SELECT id FROM matieres WHERE nom = 'Anglais')),
((SELECT id FROM professeurs WHERE nom = 'Bernard' AND prenom = 'Sophie'),
 (SELECT id FROM matieres WHERE nom = 'Espagnol')),

 --Dupond Jean - SVT
 ((SELECT id FROM professeurs WHERE nom = 'Dupont' AND prenom = 'Jean'),
 (SELECT id FROM matieres WHERE nom = 'SVT'));


-------------------------------------------------
-- Insertion des �l�ves
-------------------------------------------------
INSERT INTO eleves (nom, prenom, genre, classe_id) VALUES
-- Sixi�me 
('Lemaire', 'Leon', 'M', (SELECT id FROM classes WHERE niveau_nom = 'Sixi�me')),
('Lefebvre', 'Lea', 'F', (SELECT id FROM classes WHERE niveau_nom = 'Sixi�me')),

-- Cinqui�me
('Boujar', 'Hugo', 'M', (SELECT id FROM classes WHERE niveau_nom = 'Cinqui�me')),
('LeBoeuf', 'Lisa', 'F', (SELECT id FROM classes WHERE niveau_nom = 'Cinqui�me')),

-- Quatri�me
('Sabin', 'Ilias', 'M', (SELECT id FROM classes WHERE niveau_nom = 'Quatri�me')),
('Legros', 'Rose', 'F', (SELECT id FROM classes WHERE niveau_nom = 'Quatri�me')),

-- Troisi�me
('Dupont', 'Marc', 'M', (SELECT id FROM classes WHERE niveau_nom = 'Troisi�me')),
('Bamba', 'Celine', 'F', (SELECT id FROM classes WHERE niveau_nom = 'Troisi�me'));

-------------------------------------------------
-- Insertion de quelques notes
-------------------------------------------------
INSERT INTO notes (noteValue, eleve_id, matiere_id, professeur_id) VALUES
-- Notes pour Lemaire Leon
(15.50,
 (SELECT id FROM eleves WHERE nom = 'Lemaire' AND prenom = 'Leon'),
 (SELECT id FROM matieres WHERE nom = 'Math�matiques'),
 (SELECT id FROM professeurs WHERE nom = 'Dubois' AND prenom = 'Marie')),

(12.00,
 (SELECT id FROM eleves WHERE nom = 'Lemaire' AND prenom = 'Leon'),
 (SELECT id FROM matieres WHERE nom = 'Fran�ais'),
 (SELECT id FROM professeurs WHERE nom = 'Martin' AND prenom = 'Pierre'));
