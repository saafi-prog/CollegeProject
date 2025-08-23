import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://localhost:44378/Api",
  headers: { "Content-Type": "application/json" },
});
console.log("API Base URL:", api.defaults.baseURL);
export const elevesService = {
  GetAllStudents:  () => api.get("/eleves").then(r => r.data),
  GetStudentById: (id) => api.get(`/eleves/${id}`).then(r => r.data),
  GetStudentByClasse: (classeId) => api.get(`/eleves/classe/${classeId}`).then(r => r.data),
  GetstudentNotes: (eleveId) => api.get(`/eleves/${eleveId}/notes`).then(r => r.data),
  CreateStudent: (eleve) => api.post("/eleves", eleve).then(r => r.data),
  UpdateStudent: (id, eleve) => api.put(`/eleves/${id}`, eleve),
  DeleteStudent: (id) => api.delete(`/eleves/${id}`),
};

export const notesService = {
  GetAllNotes: () => api.get("/notes").then(r => r.data),
  GetNoteById: (id) => api.get(`/notes/${id}`).then(r => r.data),
  CreateNote: (note) => api.post("/notes", note).then(r => r.data),
  UpdateNote: (id, note) => api.put(`/notes/${id}`, note),
  DeleteNote: (id) => api.delete(`/notes/${id}`),
};

export const professeursService = {
  GetAllTeachers: () => api.get("/professeurs").then(r => r.data),
  GetTeacherByMatiere: (matiereId) => api.get(`/professeurs/par-matiere/${matiereId}`).then(r => r.data),
  GetTeachersGroupedByMatiere: () => api.get("/professeurs/par-matiere").then(r => r.data),
};

export const classesService = {
  GetAllClasses: () => api.get("/classes").then(r => r.data),
  GetClasseById: (id) => api.get(`/classes/${id}`).then(r => r.data),
};

export const matieresService = {
  GetAllMatieres: () => api.get("/matieres").then(r => r.data),
  GetMatiereById: (id) => api.get(`/matieres/${id}`).then(r => r.data),
};