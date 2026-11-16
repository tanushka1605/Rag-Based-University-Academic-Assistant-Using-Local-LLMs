##University Academic Assistant Using Local LLMs
A role-based university academic assistant prototype designed to make academic information easier to access through a conversational interface. The project presents separate dashboards for students, professors, and administrators, with a proposed Retrieval-Augmented Generation (RAG) architecture powered by locally hosted Large Language Models (LLMs).
Project status: The repository currently contains a frontend prototype built with React, TypeScript, Vite, and Tailwind CSS. The dashboards, navigation, demo sign-in, and sample chat interactions are implemented with local/mock data. A working RAG backend, local LLM connection, vector database, persistent database, and production authentication are not yet integrated. The local-LLM architecture described below represents the intended direction of the project.

Contents
- Overview
- Key Features
- User Roles
- Technology Stack
- Planned RAG Architecture
- Repository Structure
- Getting Started
- Demo Accounts
- Current Implementation and Limitations
- Roadmap
- Contributing
- License
Overview
Universities maintain academic information across syllabi, timetables, examination notices, course materials, attendance policies, question banks, and administrative documents. Finding the right information across these sources can be time-consuming.

University Academic Assistant Using Local LLMs aims to provide a single conversational interface for this information. The planned system uses RAG to retrieve relevant passages from university documents and a locally hosted LLM to generate answers grounded in those passages.

Example questions the intended assistant should support:
- When is the next examination for a particular course?
- Explain a topic from Unit 3 of the syllabus.
- What is the attendance requirement?
- Summarize a recently published academic notice.
- Which topics have been covered in a course?
- Generate quiz questions from uploaded course material.
The project is designed around privacy: the target architecture keeps document retrieval and LLM inference within a locally managed environment or university network, rather than sending university data to an external AI API.
Key Features
Available in the current frontend prototype
- Landing page introducing the project and its intended capabilities.
- Demo sign-in flow with Student, Professor, and Admin roles.
- Separate role-based dashboard interfaces.
- Student dashboard with academic overview, courses, notices, upcoming items, and an assistant chat interface.
- Professor dashboard with class/course views, syllabus coverage, student-related information, and a teaching assistant interface.
- Admin dashboard with overview information, document-management UI, user-management UI, audit-log UI, system-health UI, and an assistant interface.
- Responsive dashboard navigation and interface components.
- Sample data and predefined responses to demonstrate the user experience.
Planned capabilities
These are goals for future backend and AI integration; they should not be interpreted as completed features.
- Document ingestion for PDF, DOCX, PPT/PPTX, and CSV files.
- Text extraction, chunking, metadata tagging, and local embedding generation.
- Semantic and keyword-based retrieval from a local vector store.
- Locally hosted LLM responses using Ollama or a compatible local inference runtime.
- Source-grounded answers with document/section references.
- Role- and permission-aware retrieval.
- Persistent user, course, attendance, grade, and document records.
- Document upload, indexing, and re-indexing workflows.
- Retrieval evaluation, feedback collection, and audit controls.
User Roles
Student
The student experience is intended to help learners:
- View an academic overview and course information.
- Explore notices and upcoming academic activities.
- Ask questions about course material, examinations, and academic policies.
- Access explanations grounded in university-provided learning resources.
- Track academic progress as structured data integration is developed.
Professor
The professor experience is intended to support:
- Course and class information views.
- Syllabus coverage monitoring.
- Access to student performance and attendance summaries.
- Question and quiz generation from course documents.
- Uploading and managing teaching resources.
- Drafting academic notices and feedback.
Administrator
The administrator experience is intended to support:
- Institution-level academic overview.
- Document and knowledge-base management.
- User and role management.
- System monitoring and usage insights.
- Audit-log review.
- Institution-wide academic notices and reporting.
Technology Stack
Currently used in the repository
Area	Technology
Frontend	React 19
Language	TypeScript
Build tool and development server	Vite
Styling	Tailwind CSS 4
UI	React components and utility-based styling
Package manager	pnpm lockfile is included


Proposed for the local AI/RAG implementation
The following tools are suggested options from the project design and are not all present as dependencies in the current frontend repository.
Layer	Candidate technologies
Local LLM runtime	Ollama or LM Studio
Local language models	Llama 3.1, Mistral, or Phi-3
Embedding models	nomic-embed-text, bge-small-en, or all-MiniLM-L6-v2
Vector database	ChromaDB, FAISS, or Qdrant
Backend API	Python with FastAPI or Flask
RAG orchestration	LangChain or LlamaIndex
Document parsing	PDF, DOCX, PPT/PPTX, and CSV loaders
Structured database	PostgreSQL or SQLite
Authentication	JWT-based authentication and role-based access control
Deployment	Docker Compose for a self-hosted environment


The final backend stack and model should be selected and documented when those components are implemented.
Planned RAG Architecture
The intended question-answering workflow is:
1. Document ingestion – Administrators or authorized professors add academic documents such as syllabi, notices, timetables, policies, and course materials.
2. Text extraction and preprocessing – The backend extracts text, cleans it, and divides it into searchable chunks.
3. Metadata assignment – Chunks are tagged with relevant information such as department, semester, subject, document type, and access permissions.
4. Local embeddings – An embedding model converts chunks into vectors.
5. Vector storage – Embeddings and their metadata are stored in a locally hosted vector database.
6. Query processing – A user's question is converted into a retrieval query, with the user's role and permissions applied.
7. Context retrieval – Relevant chunks are retrieved using semantic search and, where implemented, keyword/hybrid search.
8. Local LLM generation – A locally hosted LLM generates an answer using the retrieved context.
9. Grounded response – The assistant returns the answer with source references. If the available context does not support an answer, it should clearly say that the information could not be found instead of inventing a response.
                 University Academic Documents
            (Syllabus, Notices, Timetables, Policies)
                              |
                              v
                    Document Ingestion
                              |
                              v
                Text Extraction and Chunking
                              |
                              v
                 Metadata + Access Controls
                              |
                              v
                  Local Embedding Model
                              |
                              v
                   Local Vector Database
                              ^
                              |
User Question --> Role/Permission Check
                              |
                              v
                     Relevant Retrieval
                              |
                              v
                    Context + User Query
                              |
                              v
                    Locally Hosted LLM
                              |
                              v
                 Grounded Answer + Sources
                              |
                              v
                 Student / Professor / Admin
This diagram describes the target architecture, not a currently running pipeline in this repository.
Repository Structure
University-Academic-Assistant-Using-Local-LLMs/
├── src/
│   ├── imports/
│   │   └── pasted_text/
│   │       ├── rag-academic-assistant-prompt.md
│   │       └── rag-assistant-prompt.md
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── SignIn.tsx
│   │   ├── StudentDashboard.tsx
│   │   ├── ProfessorDashboard.tsx
│   │   └── AdminDashboard.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
└── vite.config.ts
Getting Started
Prerequisites
- Node.js (a current LTS release is recommended).
- pnpm package manager.
1. Clone the repository
git clone https://github.com/<your-username>/University-Academic-Assistant-Using-Local-LLMs.git
cd University-Academic-Assistant-Using-Local-LLMs
Replace <your-username> with the GitHub account or organization that hosts the repository.
2. Install dependencies
pnpm install
3. Start the development server
pnpm dev
Open the local URL printed by Vite in your terminal (commonly http://localhost:5173).
4. Create a production build
pnpm build
5. Preview the production build
pnpm preview
Demo Accounts
The current frontend includes hard-coded demo accounts for exploring each dashboard.
Role	Email	Password
Student	student@university.edu	demo123
Professor	professor@university.edu	demo123
Admin	admin@university.edu	demo123


These credentials are for demonstration only. The current sign-in flow is not production authentication and must not be used to protect real student or university data.
Current Implementation and Limitations
To make the project's present scope clear:
- The repository is currently a frontend application; no backend service is included.
- The chat interfaces use predefined/sample response logic. They do not currently call Ollama or another LLM.
- No document ingestion or embedding pipeline is connected.
- No vector database is configured.
- Dashboard records are sample/local frontend data; persistent database integration is not included.
- The demo login checks hard-coded credentials and does not provide secure authentication or authorization.
- Privacy, offline inference, source citations, and role-restricted retrieval are design goals that require backend implementation and testing before they can be claimed as operational guarantees.
Do not upload real student records, grades, attendance data, or confidential university documents to this prototype.
Roadmap
- [ ] Define backend API and project configuration.
- [ ] Implement secure user authentication and role-based authorization.
- [ ] Add structured database models for users, courses, attendance, grades, and notices.
- [ ] Build document upload and text-extraction workflows.
- [ ] Implement chunking, metadata tagging, and local embeddings.
- [ ] Integrate a local vector database.
- [ ] Connect Ollama or another local LLM runtime.
- [ ] Implement retrieval-grounded answers and source references.
- [ ] Enforce role-based document access at the retrieval/API layer.
- [ ] Connect dashboards to persistent backend data.
- [ ] Add automated tests and RAG evaluation.
- [ ] Add local deployment instructions (for example, Docker Compose).
Contributing
Contributions and suggestions are welcome.
1. Fork the repository.
2. Create a feature branch:
   git checkout -b feature/your-feature-name
3. Make your changes and test them.
4. Commit your work:
   git commit -m "Add: describe your change"
5. Push the branch and open a Pull Request describing the change.
For major changes, open an issue first to discuss the proposed implementation.
License
No license file is currently included in the repository. Add a LICENSE file and update this section once the project owners choose a license.
