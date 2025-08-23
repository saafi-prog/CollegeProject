import { useEffect, useState, useMemo } from "react";
import { notesService, elevesService, matieresService, professeursService } from "../services/api";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [form, setForm] = useState({
    eleveId: "",
    matiereId: "",
    professeurId: "",
    noteValue: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMatiere, setFilterMatiere] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Données filtrées avec useMemo pour optimiser les performances
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const eleve = eleves.find(e => e.id === note.eleveId);
      const matiere = matieres.find(m => m.id === note.matiereId);
      const professeur = professeurs.find(p => p.id === note.professeurId);
      
      const matchesSearch = searchTerm === "" || 
        (eleve && `${eleve.nom} ${eleve.prenom}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (matiere && matiere.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (professeur && `${professeur.nom} ${professeur.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesMatiere = filterMatiere === "" || note.matiereId.toString() === filterMatiere;
      
      return matchesSearch && matchesMatiere;
    });
  }, [notes, eleves, matieres, professeurs, searchTerm, filterMatiere]);

  // Statistiques calculées
  const stats = useMemo(() => {
    if (filteredNotes.length === 0) return { count: 0, average: 0, min: 0, max: 0 };
    
    const values = filteredNotes.map(note => note.noteValue);
    return {
      count: filteredNotes.length,
      average: (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(2),
      min: Math.min(...values),
      max: Math.max(...values)
    };
  }, [filteredNotes]);

  // Chargement des données
  const refresh = async () => {
    setLoading(true);
    setError("");
    try {
      const [notesData, elevesData, matieresData, professeursData] = await Promise.all([
        notesService.GetAllNotes(),
        elevesService.GetAllStudents(),
        matieresService.GetAllMatieres(),
        professeursService.GetAllTeachers()
      ]);
      setNotes(Array.isArray(notesData) ? notesData : []);
      setEleves(Array.isArray(elevesData) ? elevesData : []);
      setMatieres(Array.isArray(matieresData) ? matieresData : []);
      setProfesseurs(Array.isArray(professeursData) ? professeursData : []);
    } catch (e) {
      setError("Erreur lors du chargement: " + (e.message || ""));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const resetForm = () => {
    setForm({ eleveId: "", matiereId: "", professeurId: "", noteValue: "" });
    setEditingId(null);
    setError("");
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) setError(""); // Clear error when user starts typing
  };

  const validateForm = () => {
    if (!form.eleveId || !form.matiereId || !form.professeurId || form.noteValue === "") {
      return "Tous les champs sont requis";
    }
    const noteValueNum = parseFloat(form.noteValue);
    if (isNaN(noteValueNum) || noteValueNum < 0 || noteValueNum > 20) {
      return "La note doit être un nombre entre 0 et 20";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError("");

    const formData = {
      eleveId: parseInt(form.eleveId),
      matiereId: parseInt(form.matiereId),
      professeurId: parseInt(form.professeurId),
      noteValue: parseFloat(form.noteValue)
    };

    try {
      if (editingId) {
        await notesService.UpdateNote(editingId, formData);
      } else {
        await notesService.CreateNote(formData);
      }
      resetForm();
      await refresh();
    } catch (e) {
      setError("Erreur lors de l'enregistrement: " + (e.response?.data?.message || e.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (note) => {
    setForm({
      eleveId: note.eleveId.toString(),
      matiereId: note.matiereId.toString(),
      professeurId: note.professeurId.toString(),
      noteValue: note.noteValue.toString()
    });
    setEditingId(note.id);
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette note ?")) return;
    
    try {
      await notesService.DeleteNote(id);
      await refresh();
    } catch (e) {
      setError("Erreur lors de la suppression: " + e.message);
    }
  };

  const formatGrade = (grade) => {
    return Number(grade) % 1 === 0 ? grade.toString() : grade.toFixed(2);
  };

  if (loading) {
    return (
      <div className="page">
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: "200px",
          fontSize: "18px",
          color: "#666"
        }}>
          <div>Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "24px" 
      }}>
        <h1 style={{ margin: 0 }}>📊Gestion des Notes</h1>
      </div>

      {error && (
        <div style={{
          color: "white",
          background: "#e74c3c",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <span>⚠️</span>
          {error}
        </div>
      )}

      {/* Statistiques */}
      <div className="card" style={{ marginBottom: "24px", padding: "20px" }}>
        <h3 style={{ margin: "0 0 16px 0", color: "#2c3e50" }}> Statistiques</h3>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", 
          gap: "16px",
          textAlign: "center"
        }}>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "black" }}>
              {stats.count}
            </div>
            <div style={{ fontSize: "12px", color: "#7f8c8d" }}>Notes</div>
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "black" }}>
              {stats.average}
            </div>
            <div style={{ fontSize: "12px", color: "#7f8c8d" }}>Moyenne</div>
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "black" }}>
              {stats.min}
            </div>
            <div style={{ fontSize: "12px", color: "#7f8c8d" }}>Min</div>
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "black" }}>
              {stats.max}
            </div>
            <div style={{ fontSize: "12px", color: "#7f8c8d" }}>Max</div>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card" style={{ marginBottom: "24px", padding: "20px" }}>
          <h2 style={{ margin: "0 0 20px 0", color: "#2c3e50" }}>
            {editingId ? "Modifier la note" : "Ajouter une note"}
          </h2>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px", 
            marginBottom: "20px" 
          }}>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", color: "#34495e" }}>
                Élève
              </label>
              <select
                className="input"
                name="eleveId"
                value={form.eleveId}
                onChange={handleChange}
                required
                style={{ width: "100%" }}
              >
                <option value="">Sélectionner un élève</option>
                {eleves.map(e => (
                  <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", color: "#34495e" }}>
                Matière
              </label>
              <select
                className="input"
                name="matiereId"
                value={form.matiereId}
                onChange={handleChange}
                required
                style={{ width: "100%" }}
              >
                <option value="">Sélectionner une matière</option>
                {matieres.map(m => (
                  <option key={m.id} value={m.id}>{m.nom}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", color: "#34495e" }}>
                Professeur
              </label>
              <select
                className="input"
                name="professeurId"
                value={form.professeurId}
                onChange={handleChange}
                required
                style={{ width: "100%" }}
              >
                <option value="">Sélectionner un professeur</option>
                {professeurs.map(p => (
                  <option key={p.id} value={p.id}>{p.nom} {p.prenom}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", color: "#34495e" }}>
                Note (/20)
              </label>
              <input
                className="input"
                name="noteValue"
                type="number"
                min="0"
                max="20"
                step="0.01"
                placeholder="Ex: 15.5"
                value={form.noteValue}
                onChange={handleChange}
                required
                style={{ 
                  width: "100%",
                  MozAppearance: "textfield"
                }}
                onWheel={e => e.target.blur()}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button 
              className="btn" 
              type="submit" 
              disabled={submitting}
              style={{
                backgroundColor: "#3498db",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "white"
              }}
            >
              {submitting ? "Enregistrement..." : (editingId ? "Modifier" : "Ajouter")}
            </button>
            
            <button
              className="btn"
              type="button"
              onClick={resetForm}
              style={{
                backgroundColor: "#95a5a6",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Filtres et recherche */}
      <div className="card" style={{ marginBottom: "24px", padding: "20px" }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "2fr 1fr",
          gap: "16px",
          alignItems: "end"
        }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", color: "#34495e" }}>
              Rechercher par élève
            </label>
            <select
              className="input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="">Tous les élèves</option>
              {eleves.map(e => (
                <option key={e.id} value={`${e.nom} ${e.prenom}`}>{e.nom} {e.prenom}</option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", color: "#34495e" }}>
                Filtrer par matière
              </label>
              <select
                className="input"
                value={filterMatiere}
                onChange={(e) => setFilterMatiere(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="">Toutes les matières</option>
                {matieres.map(m => (
                  <option key={m.id} value={m.id}>{m.nom}</option>
                ))}
              </select>
            </div>
            {filterMatiere && (
              <button
                className="btn"
                type="button"
                style={{
                  backgroundColor: "#3498db",
                  color: "white",
                  height: "38px",
                  marginBottom: "0"
                }}
                onClick={() => setFilterMatiere("")}
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Liste des notes */}
      <div className="card">
        <h2 style={{ margin: "0 0 20px 0", color: "#2c3e50" }}>
          Liste des notes ({filteredNotes.length})
        </h2>

        {filteredNotes.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "40px", 
            color: "#7f8c8d",
            fontSize: "16px"
          }}>
            {notes.length === 0 ? "Aucune note enregistrée" : "Aucune note ne correspond à votre recherche"}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Élève</th>
                  <th>Matière</th>
                  <th>Note</th>
                  <th>Professeur</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotes.map(note => {
                  const eleve = eleves.find(e => e.id === note.eleveId);
                  const matiere = matieres.find(m => m.id === note.matiereId);
                  const professeur = professeurs.find(p => p.id === note.professeurId);
                  
                  return (
                    <tr key={note.id}>
                      <td>
                        <strong>{eleve?.nom}</strong> {eleve?.prenom}
                      </td>
                      <td
                         style={{  
                          padding: "4px 8px", 
                          borderRadius: "4px",
                          fontSize: "16px"
                        }}>
                          {matiere?.nom}
                        
                      </td>
                      <td>
                        <span style={{ 
                          color: "black",
                          fontWeight: "bold",
                          fontSize: "16px"
                        }}>
                          {formatGrade(note.noteValue)}/20
                        </span>
                      </td>
                      <td>{professeur?.nom} {professeur?.prenom}</td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                          <button 
                            className="btn" 
                            onClick={() => handleEdit(note)}
                            style={{
                              backgroundColor: "#3498db",
                              fontSize: "12px",
                              padding: "6px 12px",
                              color: "white"
                            }}
                          >
                            Modifier
                          </button>
                          <button 
                            className="btn" 
                            onClick={() => handleDelete(note.id)}
                            style={{
                              backgroundColor: "#3498db",
                              fontSize: "12px",
                              padding: "6px 12px",
                              color: "white"
                            }}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bouton Ajout Note */}
      <div style={{ textAlign: "center", marginTop: "24px" }}>
        <button 
          className="btn"
          onClick={() => setShowForm(!showForm)}
          style={{
            backgroundColor: showForm ? "#95a5a6" : "#3498db",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "16px",
            padding: "12px 24px"
          }}
        >
          {showForm ? "Fermer" : "Ajouter une note"}
        </button>
      </div>
    </div>
  );
}