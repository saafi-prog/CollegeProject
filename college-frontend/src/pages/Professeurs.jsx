import { useEffect, useState, useMemo } from "react";
import { professeursService, matieresService } from "../services/api";

export default function Professeurs() {
  const [professeurs, setProfesseurs] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [matieres, setMatieres] = useState([]);
  const [selectedMatiere, setSelectedMatiere] = useState("");
  const [selectedProfesseur, setSelectedProfesseur] = useState(null);
  const [professeurDetails, setProfesseurDetails] = useState(null);
  const [viewMode, setViewMode] = useState("grouped");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const viewModes = useMemo(
    () => [
      { value: "grouped", label: "Par matière"},
      { value: "list", label: "Lister les professeurs"}
    ],
    []
  );

  const refresh = async () => {
    setLoading(true);
    setError("");
    try {
      const [groupedData, matieresData, professeursData] = await Promise.all([
        professeursService.GetTeachersGroupedByMatiere(),
        matieresService.GetAllMatieres(),
        professeursService.GetAllTeachers?.() || Promise.resolve([])
      ]);
      setGrouped(groupedData);
      setMatieres(matieresData);
      setProfesseurs(professeursData);
    } catch (e) {
      setError("Erreur lors du chargement: " + e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const getFilteredData = () => {
    if (!selectedMatiere) return grouped;
    const selectedMatiereObj = matieres.find(
      m => m.id === parseInt(selectedMatiere)
    );
    if (!selectedMatiereObj) return {};
    const matiereName = selectedMatiereObj.nom;
    return grouped[matiereName] ? { [matiereName]: grouped[matiereName] } : {};
  };

  const filtered = getFilteredData();

  return (
    <div className="page">
      <h1>👨‍🏫 Professeurs</h1>
      {error && (
        <div
          style={{
            color: "white",
            background: "#e74c3c",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #c0392b"
          }}
        >
        {error}
        </div>
      )}

      {/* Affichage */}
      <div className="card" style={{ marginBottom: 20, padding: "15px" }}>
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            marginBottom: "15px"
          }}
        >
          <span style={{ fontWeight: "bold" }}>Mode d'affichage:</span>
          <button
            key={viewModes[0].value}
            className={`btn ${viewMode === viewModes[0].value ? "primary" : "secondary"}`}
            onClick={() => setViewMode(viewModes[0].value)}
            style={{
              padding: "8px 15px",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "5px"
            }}
          >
            {viewModes[0].icon} {viewModes[0].label}
          </button>
          <button
            key={viewModes[1].value}
            className={`btn ${viewMode === viewModes[1].value ? "primary" : "secondary"}`}
            onClick={() => setViewMode(viewModes[1].value)}
            style={{
              padding: "8px 15px",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "5px",
              marginLeft: "auto"
            }}
          >
            {viewModes[1].icon} {viewModes[1].label}
          </button>
        </div>

        {/* Filtre par matière */}
        {viewMode === "grouped" && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ fontWeight: "bold" }}>
              Filtrer par matière:
            </label>
            <select
              value={selectedMatiere}
              onChange={e => setSelectedMatiere(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                minWidth: "200px"
              }}
            >
              <option value="">Les matières </option>
              {matieres.map(m => (
                <option key={m.id} value={m.id}>
                  {m.nom}
                </option>
              ))}
            </select>
            {selectedMatiere && (
              <button
                className="btn secondary"
                onClick={() => setSelectedMatiere("")}
                style={{ padding: "6px 12px" }}
              >
                Réinitialiser
              </button>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "18px", color: "#7f8c8d" }}>⏳ Chargement...</div>
        </div>
      ) : (
        <>
          {/* Vue groupée */}
          {viewMode === "grouped" && (
            <div>
              {Object.keys(filtered).length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "40px" }}>
                  <div style={{ fontSize: "18px", color: "#7f8c8d" }}>
                    {" "}
                    {selectedMatiere
                      ? "Aucun professeur trouvé pour cette matière"
                      : "Aucune donnée disponible"}
                  </div>
                </div>
              ) : (
                Object.keys(filtered).map(matiere => (
                  <div
                    key={matiere}
                    className="card"
                    style={{ marginBottom: 20, padding: "20px" }}
                  >
                    <h2
                      style={{
                        color: "#2c3e50",
                        borderBottom: "2px solid #3498db",
                        paddingBottom: "10px",
                        marginBottom: "15px"
                      }}
                    >
                      {matiere} ({filtered[matiere].length} professeur
                      {filtered[matiere].length > 1 ? "s" : ""})
                    </h2>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "15px"
                      }}
                    >
                      {filtered[matiere].map(prof => (
                        <div
                          key={prof.id}
                          style={{
                            padding: "15px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            backgroundColor: "#f8f9fa"
                          }}
                        >
                          <div style={{ marginBottom: "10px" }}>
                            <strong style={{ fontSize: "16px", color: "#2c3e50" }}>
                              {prof.prenom}{" "}
                              {prof.nom}
                            </strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Vue liste */}
          {viewMode === "list" && (
            <div className="card" style={{ padding: "20px" }}>
              <h2 style={{ marginBottom: "20px", color: "#2c3e50" }}>
                Liste des professeurs
              </h2>
              {professeurs.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#7f8c8d"
                  }}
                >
                  Aucun professeur trouvé
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table
                    className="table"
                    style={{ width: "100%", borderCollapse: "collapse" }}
                  >
                    <thead>
                      <tr
                        style={{
                          backgroundColor: "#f8f9fa",
                          borderBottom: "2px solid #dee2e6"
                        }}
                      >
                        <th style={{ padding: "12px", textAlign: "left" }}>Nom</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Prénom</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Genre</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Matières</th>
                      </tr>
                    </thead>
                    <tbody>
                      {professeurs.map(prof => (
                        <tr 
                          key={prof.id} 
                          style={{ 
                            borderBottom: "1px solid #dee2e6"
                          }}
                        >
                          <td style={{ padding: "12px" }}>{prof.nom}</td>
                          <td style={{ padding: "12px" }}>{prof.prenom}</td>
                          <td style={{ padding: "12px" }}>
                             {prof.genre}
                          </td>
                          <td style={{ padding: "12px" }}>
                            {prof.matieres ? prof.matieres.join(", ") : "Non spécifiées"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal de détails */}
      {selectedProfesseur && (
        <div
          className="card"
          style={{
            marginTop: 24,
            padding: "20px",
            border: "2px solid #3498db",
            borderRadius: "8px"
          }}
        >
          <h2 style={{ color: "#2c3e50", marginBottom: "15px" }}>
            Détails du professeur
          </h2>
          {professeurDetails ? (
            <div style={{ lineHeight: "1.6" }}>
              <p>
                <strong>Nom:</strong> {professeurDetails.nom}
              </p>
              <p>
                <strong>Prénom:</strong> {professeurDetails.prenom}
              </p>
              <p>
                <strong>Genre:</strong> {professeurDetails.genre}
              </p>
              <p>
                <strong>Matières:</strong>{" "}
                {professeurDetails.matieres?.join(", ") || "Non spécifiées"}
              </p>
              {professeurDetails.classes && (
                <p>
                  <strong>🏫 Classes:</strong>{" "}
                  {professeurDetails.classes.join(", ")}
                </p>
              )}
            </div>
          ) : (
            <p style={{ color: "#7f8c8d" }}>⏳ Chargement des détails...</p>
          )}
          <button
            className="btn secondary"
            onClick={() => {
              setSelectedProfesseur(null);
              setProfesseurDetails(null);
            }}
            style={{
              marginTop: "15px",
              padding: "8px 15px",
              backgroundColor: "#95a5a6",
              color: "white",
              border: "none",
              borderRadius: "5px"
            }}
          >
            ❌ Fermer
          </button>
        </div>
      )}
    </div>
  );
}