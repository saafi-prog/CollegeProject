-------------------------------------------------
-- Table des professeurs
-------------------------------------------------
CREATE TABLE professeurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    genre VARCHAR(10) CHECK (genre IN ('M', 'F')) NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-------------------------------------------------
-- Table des classes
-------------------------------------------------
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    niveau_nom VARCHAR(100) NOT NULL,
    professeur_principal_id INTEGER NOT NULL REFERENCES professeurs(id),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-------------------------------------------------
-- Table des matières
-------------------------------------------------
CREATE TABLE matieres (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-------------------------------------------------
-- Table des élèves
-------------------------------------------------
CREATE TABLE eleves (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    genre VARCHAR(10) CHECK (genre IN ('M', 'F')) NOT NULL,
    classe_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-------------------------------------------------
-- Table de relation professeur-matière (many-to-many)
-------------------------------------------------
CREATE TABLE professeur_matieres (
    professeur_id INTEGER NOT NULL REFERENCES professeurs(id) ON DELETE CASCADE,
    matiere_id INTEGER NOT NULL REFERENCES matieres(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (professeur_id, matiere_id)
);

-------------------------------------------------
-- Table des notes
-------------------------------------------------
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    notevalue DECIMAL(4,2) NOT NULL CHECK (notevalue >= 0 AND notevalue <= 20),
    eleve_id INTEGER NOT NULL REFERENCES eleves(id) ON DELETE CASCADE,
    matiere_id INTEGER NOT NULL REFERENCES matieres(id) ON DELETE CASCADE,
    professeur_id INTEGER NOT NULL REFERENCES professeurs(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    CONSTRAINT fk_prof_matiere FOREIGN KEY (professeur_id, matiere_id)
        REFERENCES professeur_matieres(professeur_id, matiere_id)
);

-------------------------------------------------
-- Trigger pour mettre à jour updated_at automatiquement
-------------------------------------------------
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_professeurs
BEFORE UPDATE ON professeurs
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_update_classes
BEFORE UPDATE ON classes
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_update_matieres
BEFORE UPDATE ON matieres
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_update_eleves
BEFORE UPDATE ON eleves
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_update_professeur_matieres
BEFORE UPDATE ON professeur_matieres
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_update_notes
BEFORE UPDATE ON notes
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-------------------------------------------------
-- Index pour optimiser les recherches
-------------------------------------------------
CREATE INDEX idx_eleves_classe ON eleves(classe_id);
CREATE INDEX idx_notes_eleve ON notes(eleve_id);
CREATE INDEX idx_notes_matiere ON notes(matiere_id);
CREATE INDEX idx_professeur_matieres_professeur ON professeur_matieres(professeur_id);

