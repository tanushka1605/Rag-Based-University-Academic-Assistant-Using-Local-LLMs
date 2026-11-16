Project Prompt: RAG-Based University Academic Assistant Using Local LLMs
Master Prompt (use this to brief an AI tool, guide your team, or write your proposal)

Build a RAG-Based University Academic Assistant that runs entirely on local, self-hosted LLMs (no external API calls, ensuring data privacy for student/university records). The system should combine a Retrieval-Augmented Generation (RAG) pipeline over university documents (syllabi, timetables, notices, question banks, academic policies, faculty details, research papers, etc.) with role-based dashboards for Students, Teachers, and Admins, plus a shared conversational assistant accessible from every role.

The assistant must answer natural-language questions ("When is my next Data Structures exam?", "What is the attendance policy for backlog students?", "Summarize Unit 3 of the Operating Systems syllabus") by retrieving relevant chunks from a local vector database and generating grounded answers with a locally hosted LLM (e.g., via Ollama running Llama 3, Mistral, or Phi-3).

1. Project Objective

To design and develop an offline-capable, privacy-preserving academic assistant that uses RAG + local LLMs to help students, teachers, and administrators interact with university data conversationally, while also providing structured dashboards for day-to-day academic management.

2. Core Technology Stack (suggested)
Layer	Suggested Tools
Local LLM	Ollama (Llama 3.1 / Mistral 7B / Phi-3) or LM Studio
Embeddings	nomic-embed-text, bge-small-en, or sentence-transformers/all-MiniLM-L6-v2
Vector Database	ChromaDB / FAISS / Qdrant (local instance)
Backend	FastAPI or Flask (Python)
Frontend	React.js / Next.js + Tailwind CSS
Database (structured data)	PostgreSQL / SQLite
Auth	JWT-based role authentication (Student / Teacher / Admin)
Document Parsing	LangChain / LlamaIndex loaders (PDF, DOCX, PPT, CSV)
Orchestration	LangChain or LlamaIndex for the RAG pipeline
Deployment	Docker Compose (fully local/offline setup)
3. RAG Pipeline Requirements
Ingest documents: syllabi, timetables, circulars, exam schedules, previous question papers, faculty profiles, library records, placement data.
Chunking strategy: semantic or recursive chunking with metadata tagging (subject, semester, department, document type).
Local embedding generation and storage in a vector DB.
Hybrid retrieval (keyword + semantic) for better accuracy on academic queries.
Source citation: every AI answer should show which document/section it was derived from.
Re-ranking step (optional) to improve top-k retrieval quality before sending context to the LLM.
Guardrails: if the answer isn't found in the retrieved context, the assistant should say so instead of hallucinating.
4. Role-Based Dashboards
A. Student Dashboard
Conversational assistant (ask about courses, deadlines, exam dates, syllabus topics, grading policy).
Personal academic overview: attendance %, GPA/CGPA tracker, upcoming assignments/exams.
Course materials hub (search syllabus/notes via RAG chatbot).
Timetable and calendar view with reminders/notifications.
Doubt-solving assistant per subject (RAG grounded in course notes/textbooks).
Progress analytics: performance trend charts across semesters.
Notice board with AI-summarized announcements ("What changed this week?").
B. Teacher Dashboard
Assistant for quick access to syllabus coverage, question bank generation, and student performance queries.
Auto-generate quizzes/question papers from uploaded course material (RAG + LLM).
Attendance and grade management panel.
Class-wise performance analytics (weak topics, average scores, attendance trends).
Upload/manage course documents that feed into the RAG knowledge base.
Assignment/exam scheduling with automatic notice generation.
AI-assisted feedback drafting for student submissions.
C. Combined / Admin Dashboard
Unified analytics view across departments: enrollment stats, attendance heatmaps, exam performance, faculty workload.
Document/knowledge-base management (add/update/remove source documents feeding the RAG system).
User & role management (students, teachers, permissions).
System health monitoring: LLM response time, retrieval accuracy logs, query volume.
Institution-wide notice broadcasting with AI-generated summaries.
Audit log of chatbot queries (for academic integrity / usage insights) with privacy safeguards.
Cross-role reporting: combined view of student engagement vs. teacher content coverage.
5. Additional Features I'd Recommend Adding
Multi-modal input – allow students/teachers to upload images of handwritten notes or scanned question papers for OCR + RAG retrieval.
Voice interface – speech-to-text query input and text-to-speech responses for accessibility.
Multilingual support – regional language Q&A (useful for diverse Indian university campuses).
Personalized study planner – AI generates a revision schedule based on syllabus + exam dates + student's weak areas.
Plagiarism/AI-content flagging for teacher-uploaded assignments (optional add-on).
Feedback loop – thumbs up/down on AI answers to fine-tune retrieval ranking over time.
Offline-first PWA – so students can access cached dashboards/timetables without constant connectivity.
Role-based query restriction – e.g., students can't query other students' grades; enforced at the retrieval layer, not just UI.
Explainability panel – show retrieved chunks + confidence score alongside every AI answer.
Chat history & bookmarking – students can save important AI answers (e.g., exam syllabus breakdowns).
6. Non-Functional Requirements
Fully local/offline inference (no data leaves the campus network) — key selling point for privacy.
Response latency target (e.g., <5s for typical queries) — mention hardware constraints (GPU/CPU-only local LLM).
Scalability to handle multiple departments/courses.
Data security: encrypted storage for student records, role-based access control.
Modular architecture so the LLM/vector DB can be swapped later.
7. Suggested Deliverables for Your Report/Demo
System architecture diagram (RAG pipeline + dashboards + local LLM serving).
ER diagram for structured data (users, courses, attendance, grades).
Working prototype with at least one fully functional dashboard (start with Student).
Evaluation metrics: retrieval precision/recall, answer relevance (can use RAGAS framework), latency benchmarks.
Comparison table: local LLM (privacy, cost) vs. cloud LLM (speed, capability) — good for your project justification section.
How to Use This Prompt

Paste the Master Prompt section (top) into an AI coding assistant (e.g., Claude Code, Cursor, ChatGPT) along with the tech stack and dashboard requirements to scaffold the project. Expand each dashboard section into its own sprint/milestone for a semester-long build.