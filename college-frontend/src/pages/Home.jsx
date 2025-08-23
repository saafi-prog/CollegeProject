import { useEffect, useState } from "react";
import { elevesService, professeursService, notesService, classesService } from "../services/api";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalEleves: 0,
    totalProfesseurs: 0,
    totalNotes: 0,
    totalClasses: 0,
    moyenneGenerale: 0,
    notesRecentes: []
  });

  useEffect(() => {
    async function fetchDataforStatistics() {
      try {
        setLoading(true);
        setError("");
        const [elevesData, professeursData, notesData, classesData] = await Promise.all([
          elevesService.GetAllStudents(),
          professeursService.GetAllTeachers(),
          notesService.GetAllNotes(),
          classesService.GetAllClasses(),
        ]);

        let moyenneGenerale = 0;
        if (notesData.length > 0) {
          const premierNote = notesData[0];
          const proprietessPossibles = ['noteValue', 'NoteValue', 'valeur', 'value', 'note', 'score', 'points'];
          let nomPropriete = null;
          for (const prop of proprietessPossibles) {
            if (premierNote && typeof premierNote[prop] === 'number') {
              nomPropriete = prop;
              break;
            }
          }
          if (nomPropriete) {
            const somme = notesData.reduce((sum, note) => {
              const valeurNote = parseFloat(note[nomPropriete]);
              return sum + (isNaN(valeurNote) ? 0 : valeurNote);
            }, 0);
            moyenneGenerale = (somme / notesData.length).toFixed(2);
          } else {
            moyenneGenerale = "N/A";
          }
        }

        const notesRecentes = notesData
          .sort((a, b) => {
            const dateA = new Date(a.createdAt || a.dateCreation || a.date);
            const dateB = new Date(b.createdAt || b.dateCreation || b.date);
            return dateB - dateA;
          })
          .slice(0, 5);

        setStats({
          totalEleves: elevesData.length,
          totalProfesseurs: professeursData.length,
          totalNotes: notesData.length,
          totalClasses: classesData.length,
          moyenneGenerale,
          notesRecentes
        });

      } catch (e) {
        setError("Erreur de chargement des données: " + e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDataforStatistics();
  }, []);

  if (loading) return <div style={{ color: "black" }}>Chargement ...</div>;
  if (error) return <div style={{ color: "black" }}>{error}</div>;

  return (
    <div className="page">
      <h1 style={{ color: "black" }}>🏫 Quelques Informations sur le collège</h1>
      <div style={{ display: 'grid',gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',gap: '20px', marginBottom: '30px'}}>

        <div className="card"style={{textAlign: 'center',padding: '20px'}}>
          <h3 style={{color: 'black',margin: '0 0 10px 0'}}>
            Élèves
          </h3>
          <p style={{fontSize: '2em',fontWeight: 'bold',margin: 0,color: 'black'}}>
             {stats.totalEleves}
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
          <h3 style={{ color: 'black', margin: '0 0 10px 0' }}>Professeurs</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold', margin: 0, color: 'black' }}>{stats.totalProfesseurs}</p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
          <h3 style={{ color: 'black', margin: '0 0 10px 0' }}> Classes</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold', margin: 0, color: 'black' }}>{stats.totalClasses}</p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
          <h3 style={{ color: 'black', margin: '0 0 10px 0' }}>Notes</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold', margin: 0, color: 'black' }}>{stats.totalNotes}</p>
        </div>

      </div>
      <div className="card" style={{ textAlign: 'center', padding: '30px', backgroundColor: '#f8f9fa' }}>
        <h2 style={{ color: 'black', margin: '0 0 15px 0' }}>Moyenne Générale</h2>
        <p style={{ fontSize: '3em', fontWeight: 'bold', color: 'black', margin: 0 }}>
          {stats.moyenneGenerale}/20
        </p>
      </div>

    </div>
  );
}