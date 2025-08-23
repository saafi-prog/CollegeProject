import { useEffect, useState, useMemo } from "react";
import { classesService, elevesService, notesService, professeursService } from "../services/api";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [selectedClasse, setSelectedClasse] = useState(null);
  const [eleves, setEleves] = useState([]);
  const [infoClasse, setInfoClasse] = useState(null);
  const [viewMode, setViewMode] = useState("overview"); // "overview", "students", "stats"
  const [loading, setLoading] = useState(true);
  const [loadingEleves, setLoadingEleves] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [error, setError] = useState("");
  const [classStats, setClassStats] = useState({});

  const viewModes = useMemo(() => [
    { value: "students", label: " Élèves", icon: "👨‍🎓" },
    { value: "stats", label: " Statistiques", icon: "📊" }
  ], []);

  const refresh = async () => {
    setLoading(true);
    setError("");
    try {
      const classesData = await classesService.GetAllClasses();
      console.log("Classes reçues:", classesData);
      setClasses(classesData);
    } catch (e) {
      console.error("Erreur refresh classes:", e);
      setError("Erreur lors du chargement des classes: " + e.message);
    }
    setLoading(false);
  };

  useEffect(() => { 
    refresh(); 
  }, []);

  const selectClasse = async (classe) => {
    console.log(" Sélection classe:", classe);
    setSelectedClasse(classe);
    setEleves([]);
    setInfoClasse(null);
    setClassStats({});
    
    if (classe) {
      await Promise.all([
        loadStudents(classe.id),
        loadClasseInfo(classe.id)
      ]);
    }
  };

  const loadStudents = async (classeId) => {
    setLoadingEleves(true);
    try {
      const data = await elevesService.GetStudentByClasse(classeId);
      console.log(" Élèves reçus:", data);
      setEleves(data);
    } catch (e) {
      console.error(" Erreur chargement élèves:", e);
      setError("Erreur lors du chargement des élèves: " + e.message);
    }
    setLoadingEleves(false);
  };

  const loadClasseInfo = async (classeId) => {
    setLoadingInfo(true);
    try {
      // Récupérer les élèves de la classe
      const elevesClasse = await elevesService.GetStudentByClasse(classeId);
      const eleveIds = elevesClasse.map(e => e.id);

      if (eleveIds.length === 0) {
        setInfoClasse({
          profPrincipal: "Aucun Professeur",
          moyenne: "N/A",
          totalEleves: 0,
          totalNotes: 0
        });
        setLoadingInfo(false);
        return;
      }

      // Récupérer toutes les notes et professeurs
      const [notes, professeurs] = await Promise.all([
        notesService.GetAllNotes(),
        professeursService.GetAllTeachers()
      ]);

      // Filtrer les notes des élèves de cette classe
      const notesClasse = notes.filter(n => eleveIds.includes(n.eleveId));
      
      // Calculer la moyenne
      let moyenne = "";
      if (notesClasse.length > 0) {
        const noteValues = notesClasse.map(n => parseFloat(n.noteValue)).filter(v => !isNaN(v));
        if (noteValues.length > 0) {
          const sum = noteValues.reduce((acc, n) => acc + n, 0);
          const moy = sum / noteValues.length;
          moyenne = Number.isInteger(moy) ? moy.toString() : moy.toFixed(2);
        }
      }

      // Déterminer le professeur principal (celui qui a le plus de notes dans cette classe)
      let profPrincipal = "Non défini";
      if (notesClasse.length > 0) {
        const profCounts = {};
        notesClasse.forEach(note => {
          profCounts[note.professeurId] = (profCounts[note.professeurId] || 0) + 1;
        });
        
        const principalProfId = Object.keys(profCounts).reduce((a, b) => 
          profCounts[a] > profCounts[b] ? a : b
        );
        
        const prof = professeurs.find(p => p.id === parseInt(principalProfId));
        if (prof) {
          profPrincipal = `${prof.prenom} ${prof.nom}`;
        }
      }

      // Calculer les statistiques détaillées
      const stats = calculateClassStats(notesClasse, elevesClasse, professeurs);
      
      setInfoClasse({
        profPrincipal,
        moyenne,
        totalEleves: elevesClasse.length,
        totalNotes: notesClasse.length,
        repartitionGenre: {
          masculin: elevesClasse.filter(e => e.genre === 'M').length,
          feminin: elevesClasse.filter(e => e.genre === 'F').length
        }
      });

      setClassStats(stats);

    } catch (e) {
      console.error(" Erreur chargement info classe:", e);
      setError("Erreur lors du chargement des informations: " + e.message);
    }
    setLoadingInfo(false);
  };

  const calculateClassStats = (notesClasse, elevesClasse, professeurs) => {
    if (notesClasse.length === 0) return {};

    const noteValues = notesClasse.map(n => parseFloat(n.noteValue)).filter(v => !isNaN(v));
  
    // Top élèves
    const elevesMoyennes = elevesClasse.map(eleve => {
      const notesEleve = notesClasse.filter(n => n.eleveId === eleve.id);
      const valeurs = notesEleve.map(n => parseFloat(n.noteValue)).filter(v => !isNaN(v));
      const moyenne = valeurs.length > 0 ? valeurs.reduce((a, b) => a + b, 0) / valeurs.length : 0;
      
      return {
        ...eleve,
        moyenne: moyenne,
        nombreNotes: notesEleve.length
      };
    }).sort((a, b) => b.moyenne - a.moyenne);

    // Professeurs actifs dans la classe
    const profsActifs = {};
    notesClasse.forEach(note => {
      const prof = professeurs.find(p => p.id === note.professeurId);
      if (prof) {
        if (!profsActifs[note.professeurId]) {
          profsActifs[note.professeurId] = {
            nom: `${prof.prenom} ${prof.nom}`,
            nombreNotes: 1
          };
        } else {
          profsActifs[note.professeurId].nombreNotes++;
        }
      }
    });

    return {
      topEleves: elevesMoyennes.slice(0, 5),
      worstEleves: elevesMoyennes.slice(-3).reverse(),
      professeurs: Object.values(profsActifs).sort((a, b) => b.nombreNotes - a.nombreNotes),
      maxNote: noteValues.length > 0 ? Math.max(...noteValues) : 0,
      minNote: noteValues.length > 0 ? Math.min(...noteValues) : 0
    };
  };

  const getClasseDisplayName = (classe) => {
    return classe?.niveauNom || classe?.nom || `Classe ${classe?.id}`;
  };

  return (
    <div className="page">
      <h1>🏫 Classes</h1>
      
      {error && (
        <div style={{ 
          color: "white", 
          background: "#e74c3c", 
          padding: "15px", 
          borderRadius: "8px", 
          marginBottom: "20px",
          border: "1px solid #c0392b"
        }}>
           {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px", marginBottom: "20px" }}>
        
        {/* Liste des classes */}
        <div className="card" style={{ padding: "20px", height: "fit-content" }}>
          <h2 style={{ marginBottom: "20px", color: "#2c3e50" }}> Liste des classes</h2>
          
          {loading ? (
            <div style={{ textAlign: "center", padding: "20px", color: "#7f8c8d" }}>
               Chargement...
            </div>
          ) : classes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px", color: "#7f8c8d" }}>
               Aucune classe trouvée
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {classes.map(classe => (
                <div 
                  key={classe.id} 
                  style={{
                    padding: "15px",
                    border: selectedClasse?.id === classe.id ? "2px solid #3498db" : "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: selectedClasse?.id === classe.id ? "#e8f4fd" : "#f8f9fa",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                  onClick={() => selectClasse(classe)}
                  onMouseEnter={e => {
                    if (selectedClasse?.id !== classe.id) {
                      e.target.style.backgroundColor = "#e9ecef";
                    }
                  }}
                  onMouseLeave={e => {
                    if (selectedClasse?.id !== classe.id) {
                      e.target.style.backgroundColor = "#f8f9fa";
                    }
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: "16px", color: "#2c3e50" }}>
                       {getClasseDisplayName(classe)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informations de la classe sélectionnée */}
        <div className="card" style={{ padding: "20px" }}>
          {!selectedClasse ? (
            <div style={{ 
              textAlign: "center", 
              padding: "60px 20px", 
              color: "#7f8c8d",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              border: "2px dashed #ddd"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "20px" }}>🏫</div>
              <div style={{ fontSize: "18px", marginBottom: "10px" }}>Sélectionnez une classe</div>
              <div style={{ fontSize: "14px" }}>Cliquez sur une classe dans la liste pour voir ses informations</div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ color: "#2c3e50", margin: 0 }}>
                   {getClasseDisplayName(selectedClasse)}
                </h2>
                
                <div style={{ display: "flex", gap: "8px" }}>
                  {viewModes.map(mode => (
                    <button
                      key={mode.value}
                      className={`btn ${viewMode === mode.value ? 'primary' : 'secondary'}`}
                      onClick={() => setViewMode(mode.value)}
                      style={{ 
                        padding: "6px 12px",
                        backgroundColor: viewMode === mode.value ? "#3498db" : "#95a5a6",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "12px"
                      }}
                    >
                      {mode.value === "students" ? "Lister les élèves" : mode.value === "stats" ? "Statistiques" : mode.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vue générale */}
              {viewMode === "overview" && (
                <div>
                  {loadingInfo ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#7f8c8d" }}>
                       Chargement...
                    </div>
                  ) : infoClasse ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
                      <div style={{ 
                        padding: "20px", 
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        backgroundColor: "#f8f9fa",
                        textAlign: "center"
                      }}>
                        <div style={{ fontSize: "24px", fontWeight: "bold", color: "black" }}>
                          {infoClasse.totalEleves}
                        </div>
                        <div style={{ fontSize: "14px", color: "#2c3e50" }}>Élèves</div>
                      </div>

                      <div style={{ 
                        padding: "20px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        backgroundColor: "#f8f9fa",
                        textAlign: "center"
                      }}>
                        <div style={{ fontSize: "24px", fontWeight: "bold", color: "black" }}>
                          {infoClasse.moyenne}/20
                        </div>
                        <div style={{ fontSize: "14px", color: "#2c3e50" }}>Moyenne</div>
                      </div>

                      <div style={{ 
                        padding: "20px",
                        borderRadius: "8px",
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #ddd",
                        textAlign: "center"
                      }}>
                        <div style={{ fontSize: "24px", fontWeight: "bold", color: "black" }}>
                          {infoClasse.totalNotes}
                        </div>
                        <div style={{ fontSize: "14px", color: "#2c3e50" }}>Notes</div>
                      </div>

                      {infoClasse.repartitionGenre && (
                        <div style={{ 
                          padding: "20px", 
                          borderRadius: "8px",
                          backgroundColor: "#f8f9fa",
                          border: "1px solid #ddd",
                          textAlign: "center"
                        }}>
                          <div style={{ fontSize: "16px", fontWeight: "bold", color: "#9b59b6" }}>
                            👨 {infoClasse.repartitionGenre.masculin} | 👩 {infoClasse.repartitionGenre.feminin}
                          </div>
                          <div style={{ fontSize: "14px", color: "#2c3e50" }}>⚥ Répartition</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "40px", color: "#7f8c8d" }}>
                       Aucune information disponible
                    </div>
                  )}

                  {/* Informations détaillées */}
                  {infoClasse && (
                    <div style={{ 
                      marginTop: "20px", 
                      padding: "20px", 
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                      border: "1px solid #ddd"
                    }}>
                      <h3 style={{ marginBottom: "15px", color: "#2c3e50" }}> Informations détaillées</h3>
                      <div style={{ lineHeight: "1.8" }}>
                        <p><strong> Professeur principal:</strong> {infoClasse.profPrincipal}</p>
                        <p><strong> Moyenne de classe:</strong> 
                          <span style={{ 
                            marginLeft: "5px",
                            fontWeight: "bold",
                            color: "black"
                          }}>
                            {infoClasse.moyenne}/20
                          </span>
                        </p>
                        <p><strong> Effectif total:</strong> <span style={{color: "black", fontWeight: "bold"}}>{infoClasse.totalEleves}</span> élève{infoClasse.totalEleves > 1 ? 's' : ''}</p>
                        <p><strong> Total des notes:</strong> <span style={{color: "black", fontWeight: "bold"}}>{infoClasse.totalNotes}</span> note{infoClasse.totalNotes > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Composant élèves */}
              {viewMode === "students" && (
                <div>
                  {loadingEleves ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#7f8c8d" }}>
                       Chargement...
                    </div>
                  ) : eleves.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#7f8c8d" }}>
                       Aucun élève dans cette classe
                    </div>
                  ) : (
                    <div>
                      <h3 style={{ marginBottom: "15px", color: "#2c3e50" }}>
                         Élèves ({eleves.length})
                      </h3>
                      <div style={{ 
                        display: "grid", 
                        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", 
                        gap: "15px" 
                      }}>
                        {eleves.map(eleve => (
                          <div key={eleve.id} style={{
                            padding: "15px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            backgroundColor: "#f8f9fa",
                            transition: "transform 0.2s ease"
                          }}
                          onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
                          onMouseLeave={e => e.target.style.transform = "translateY(0)"}
                          >
                            <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                              <div>
                                  <div style={{ fontWeight: "bold", color: "#2c3e50" }}>
                                    {eleve.prenom} {eleve.nom}
                                  </div>
                                </div>
                              </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Composant statistiques */}
              {viewMode === "stats" && (
                <div>
                  {loadingInfo ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#7f8c8d" }}>
                       Chargement...
                    </div>
                  ) : Object.keys(classStats).length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#7f8c8d" }}>
                       Aucune statistique disponible
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      
                      {/* Classement des élèves */}
                      {classStats.topEleves && classStats.topEleves.length > 0 && (
                        <div style={{ 
                          padding: "20px", 
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                          backgroundColor: "#f8f9fa",
                        }}>
                          <h3 style={{ marginBottom: "15px", color: "#2c3e50" }}> Classement des élèves</h3>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {classStats.topEleves.slice(0, 3).map((eleve, index) => (
                              <div key={eleve.id} style={{ 
                                display: "flex", 
                                justifyContent: "space-between", 
                                alignItems: "center",
                                padding: "10px",
                                backgroundColor: "white",
                                borderRadius: "5px"
                              }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <span style={{ fontSize: "18px" }}>
                                    {index === 0 ? '1' : index === 1 ? '2' : '3'}
                                  </span>
                                  <span>{eleve.prenom} {eleve.nom}</span>
                                </div>
                                <div style={{ 
                                  fontWeight: "bold", 
                                  color: "black",
                                  fontSize: "16px"
                                }}>
                                  {eleve.moyenne.toFixed(2)}/20
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}