# 🎓 RAG-Based University Academic Assistant Using Local LLMs
Deploy link - https://university-academic-assistant-using.vercel.app/

An intelligent, privacy-focused academic assistant that helps university students access information from academic documents, university regulations, course materials, notes, and PDFs using **Retrieval-Augmented Generation (RAG)** and locally running Large Language Models (LLMs).

The system retrieves relevant information from uploaded university documents and generates accurate, context-aware responses without relying on external cloud-based AI APIs.

## 🚀 Project Overview

The RAG-Based University Academic Assistant is designed to simplify access to university-related academic information. Students can ask questions in natural language and receive relevant answers based on university-provided documents.

By combining semantic search, vector databases, and local LLMs, the application reduces manual document searching while maintaining data privacy.

## ✨ Key Features

- **Document Upload:** Upload university PDFs, academic notes, syllabus documents, and other study materials.
- **Retrieval-Augmented Generation:** Retrieves relevant information from documents before generating answers.
- **Local LLM Integration:** Uses locally hosted language models to generate responses.
- **Semantic Search:** Understands the meaning and context of user queries rather than relying only on keywords.
- **Context-Aware Responses:** Generates answers grounded in retrieved university documents.
- **Privacy-Focused:** Keeps document processing and AI inference local.
- **Academic Query Support:** Answers questions about syllabus, examinations, attendance policies, academic regulations, and course materials.
- **Source-Based Answers:** Provides document references or relevant text snippets to improve answer transparency.

## 🏗️ System Architecture

The application follows a Retrieval-Augmented Generation pipeline:

1. **Document Ingestion:** Upload and load university academic documents.
2. **Text Extraction:** Extract textual content from PDF and other supported documents.
3. **Text Chunking:** Divide documents into smaller, manageable text segments.
4. **Embedding Generation:** Convert text chunks into vector embeddings.
5. **Vector Storage:** Store embeddings in a vector database for efficient retrieval.
6. **Query Processing:** Convert student questions into embeddings.
7. **Similarity Search:** Retrieve the most relevant document chunks.
8. **LLM Response Generation:** Pass retrieved context and the question to a locally running LLM.
9. **Answer Generation:** Return a context-aware response with relevant source references.

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Programming Language | Python |
| AI Architecture | Retrieval-Augmented Generation (RAG) |
| LLM Runtime | Ollama |
| Language Models | Llama / Mistral |
| Embedding Models | Sentence Transformers |
| Vector Database | ChromaDB |
| Document Processing | PyPDF |
| Backend | Python |
| Framework | LangChain |
| Interface | Streamlit |
| Version Control | Git & GitHub |

*Note: The technology stack represents the proposed implementation and should be updated to match the actual tools used.*

## 📂 Project Structure

```text
RAG-University-Academic-Assistant/
│
├── data/
│   └── university_documents/
│
├── embeddings/
│
├── vectorstore/
│
├── src/
│   ├── document_loader.py
│   ├── text_splitter.py
│   ├── embedding_model.py
│   ├── vector_database.py
│   ├── retriever.py
│   └── llm_handler.py
│
├── app.py
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/AnujS394/RAG-University-Academic-Assistant.git

cd RAG-University-Academic-Assistant
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

Activate the environment:

**Windows:**
```bash
venv\Scripts\activate
```

**Linux / macOS:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Install and Configure Ollama

Download Ollama from:

https://ollama.com/

Pull a supported local language model:

```bash
ollama pull llama3
```

### 5. Run the Application

```bash
streamlit run app.py
```

Open the local application in your browser using the URL provided by Streamlit.

## 💡 Example Use Cases

- Ask questions about university examination guidelines.
- Find information about attendance requirements.
- Understand subject-wise syllabus topics.
- Retrieve information from academic notes and PDFs.
- Ask questions about university rules and regulations.
- Get explanations based on uploaded study materials.

## 🔒 Privacy and Security

- Local LLM inference reduces dependence on external AI APIs.
- University documents can remain within the local environment.
- No external cloud-based LLM is required for the proposed workflow.
- Access to academic documents can be controlled by the application.

## 🔮 Future Enhancements

- Multi-language academic query support.
- Voice-based question answering.
- Conversation history and contextual memory.
- Support for additional document formats.
- Role-based access for students, faculty, and administrators.
- Advanced document citations and page-level references.
- Improved retrieval accuracy through hybrid search and reranking.

## 🎯 Project Objective

The primary objective is to develop a scalable, intelligent, and privacy-focused academic information retrieval system that makes university knowledge easily accessible through natural language interaction.

## Team:
Tanushka Tomar - BETN1AI23028
Anuj Sharma - BETN1AI23003


B.Tech Computer Science Engineering (AI & ML)  
ITM University, Gwalior

- GitHub: https://github.com/AnujS394 (Anuj)
- Github: https://github.com/tanushka1605 (Tanushka)
  
---

⭐ If you find this project useful, consider giving the repository a star!
