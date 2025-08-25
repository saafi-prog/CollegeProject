import { useEffect, useState, useMemo } from "react";
import { elevesService, classesService } from "../services/api";

export default function Eleves() {
  const [eleves, setEleves] = useState([]);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ nom: "", prenom: "", genre: "M", classeId: "" });
  const [editingId, setEditingId] = useState(null);
  const [selectedEleve, setSelectedEleve] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const genres = useMemo(() => [
    { value: "M", label: "Masculin" },
    { value: "F", label: "Féminin" }
  ], []);

  const refresh = async () => {
    setLoading(true);
    try {
      const [elevesData, classesData] = await Promise.all([
        elevesService.GetAllStudents(),
        classesService.GetAllClasses()
      ]);
      
      console.log("Classes reçues:", classesData);
      console.log("Première classe:", classesData[0]);
      
      setEleves(elevesData);
      setClasses(classesData);
    } catch (e) {
      console.error("Erreur refresh:", e);
      setError("Erreur lors du chargement: " + e.message);
    }
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    
    // Conversion spéciale pour classeId
    const finalValue = name === 'classeId' ? parseInt(value) || "" : value;
    
    console.log(`Changement ${name}:`, value, "→", finalValue);
    
    setForm({ ...form, [name]: finalValue });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Validation côté client
    if (!form.nom.trim() || !form.prenom.trim() || !form.classeId) {
      setError("Tous les champs sont requis");
      return;
    }
    
    // Préparation des données
    const formData = {
      nom: form.nom.trim(),
      prenom: form.prenom.trim(),
      genre: form.genre,
      classeId: parseInt(form.classeId) // Assurer que c'est un nombre
    };
    
    console.log("Données envoyées:", formData);
    
    try {
      setError("");
      
      if (editingId) {
        await elevesService.UpdateStudent(editingId, formData);
        console.log("Élève modifié");
      } else {
        const result = await elevesService.CreateStudent(formData);
        console.log("Élève créé:", result);
      }
      
      setForm({ nom: "", prenom: "", genre: "M", classeId: "" });
      setEditingId(null);
      refresh();
      
    } catch (e) {
      console.error("Erreur soumission:", e);
      console.error("Réponse serveur:", e.response?.data);
      
      const errorMessage = e.response?.data?.message || 
                          e.response?.data || 
                          e.message || 
                          "Erreur inconnue";
      
      setError("Erreur lors de l'enregistrement: " + errorMessage);
    }
  };

  const handleEdit = eleve => {
    console.log("Édition élève:", eleve);
    
    setForm({
      nom: eleve.nom,
      prenom: eleve.prenom,
      genre: eleve.genre,
      classeId: eleve.classeId 
    });
    setEditingId(eleve.id);
  };

  const handleDelete = async id => {
    if (window.confirm("Supprimer cet élève ?")) {
      try {
        await elevesService.DeleteStudent(id);
        refresh();
      } catch (e) {
        console.error("Erreur suppression:", e);
        setError("Erreur lors de la suppression: " + e.message);
      }
    }
  };

  const showNotes = async (eleveId) => {
    setSelectedEleve( eleves.find(e => e.id === eleveId) ? `${eleves.find(e => e.id === eleveId).prenom} ${eleves.find(e => e.id === eleveId).nom}` : "Inconnu");
    try {
      const data = await elevesService.GetstudentNotes(eleveId);
      setNotes(data);
    } catch (e) {
      console.error("Erreur notes:", e);
      setError("Erreur lors du chargement des notes: " + e.message);
    }
  };

  return (
    <div className="page">
      <h1>👨‍🎓 Élèves</h1>
      
      {error && (
        <div style={{ 
          color: "white", 
          background: "#e74c3c", 
          padding: "10px", 
          borderRadius: "5px", 
          marginBottom: "20px" 
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 24 }}>
        <h2>{editingId ? "Modifier un élève" : "Ajouter un élève"}</h2>
        
        <div style={{ display: "grid", gap: "15px" }}>
          <input
            className="input"
            name="nom"
            placeholder="Nom"
            value={form.nom}
            onChange={handleChange}
            required
          />
          
          <input
            className="input"
            name="prenom"
            placeholder="Prénom"
            value={form.prenom}
            onChange={handleChange}
            required
          />
          
          <select
            className="input"
            name="genre"
            value={form.genre}
            onChange={handleChange}
            required
          >
            {genres.map(g => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
          
          <select
            className="input"
            name="classeId"
            placeholder="Choisir une classe"
            value={form.classeId}
            onChange={handleChange}
            required
          >
            <option value=""> Choisir une classe </option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>
                {c.niveauNom || c.niveau || c.nom || `Classe ${c.id}`}
              </option>
            ))}
          </select>
        </div>
        
        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <button className="btn" type="submit">
            {editingId ? "Modifier" : "Ajouter"}
          </button>
          
          {editingId && (
            <button
              className="btn danger"
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ nom: "", prenom: "", genre: "M", classeId: "" });
                setError("");
              }}
            >
              Annuler
            </button>
          )}
        </div>
      </form>
      
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <div className="card">
          <h2>Liste des élèves</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Genre</th>
                <th>Classe</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {eleves.map(eleve => (
                <tr key={eleve.id}>
                  <td>{eleve.nom}</td>
                  <td>{eleve.prenom}</td>
                  <td>{eleve.genre}</td>
                  <td>{classes.find(c => c.id === eleve.classeId)?.niveauNom || eleve.classeId}</td>
                  <td>
                    <button
                      className="btn"
                      style={{ marginRight: "8px", backgroundColor: "#3498db", color: "white" }}
                      onClick={() => handleEdit(eleve)}
                    >
                      Modifier
                    </button>
                    <button
                      className="btn"
                      style={{ marginRight: "8px", backgroundColor: "#3498db", color: "white" }}
                      onClick={() => handleDelete(eleve.id)}
                    >
                      Supprimer
                    </button>
                    <button
                      className="btn"
                      style={{ backgroundColor: "#3498db", color: "white" }}
                      onClick={() => showNotes(eleve.id)}
                    >
                      Voir notes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {selectedEleve && (
        <div className="card" style={{ marginTop: 24 }}>
          <h2>Notes de l'élève {selectedEleve}</h2>
          {notes.length === 0 ? (
            <p>Aucune note trouvée.</p>
          ) : (
            <ul>
              {notes.map(n => (
                <li key={n.id}>
                  <strong>{n.matiereNom}:</strong> {n.noteValue}/20
                </li>
              ))}
            </ul>
          )}
          <button className="btn" onClick={() => setSelectedEleve(null)}>
            Fermer
          </button>
        </div>
      )}
    </div>
  );
}