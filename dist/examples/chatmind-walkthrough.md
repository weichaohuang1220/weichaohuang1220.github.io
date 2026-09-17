# ChatMind: answer a question from an uploaded guide

This is a source-checked walkthrough for a configured ChatMind installation.
The sample answer is an acceptance criterion, not a recorded model response.
The full backend/LLM flow has not been run as part of this portfolio update.

Reviewed commit: 2e144959e33b8978c71a77c2cd82ac4317acd8a5
Repository: https://github.com/weichaohuang1220/chatmind

## Prerequisites

Use a working installation with its database schema initialized, PostgreSQL
with pgvector, Ollama serving bge-m3 at localhost:11434, and the backend and UI
running. A working DeepSeek API key is required for this example, including
the reranking step. Follow the repository setup instructions and supply your
own local configuration. This guide does not provision those services.

The reviewed repository contains V3/V4 SQL files but no complete base-schema
bootstrap. An empty database plus those two files is not a complete setup.

## 1. Add the test document

Download room-guide.md from this website. Create a knowledge base named
Room Guide in ChatMind and upload the Markdown file to it.

The upload endpoint is POST /api/documents/upload with multipart fields
kbId and file. POST /api/documents only creates a metadata record; use the
upload endpoint or the UI's file-upload control to index the actual content.

DocumentFacadeServiceImpl splits the Markdown at headings and embeds the
section titles using bge-m3. Keep the descriptive headings in this sample.
If indexing fails, fix the embedding service and reprocess the document.
An upload response alone does not prove indexing succeeded: indexing errors
are logged without failing the upload response in the reviewed implementation.

## 2. Configure the agent

Create an agent named Room Guide Assistant, select deepseek-chat, and attach
the Room Guide knowledge base in its knowledge-base settings (allowedKbs).
No optional tools are needed; KnowledgeTool is registered as a fixed tool.

Use this system prompt:

    Answer in English. Use KnowledgeTool to consult the attached Room Guide
    knowledge base before answering room-policy questions. Base your answer
    on the retrieved text. Name the relevant section in your answer. If the
    guide does not contain the answer, say so. Do not make a reservation.

## 3. Ask the question

    Can I book Cedar for 90 minutes? What should I do instead?

The agent can plan, call KnowledgeTool with the attached knowledge-base ID
and a query such as "Cedar meeting room booking policy", and use the returned
text to answer. The exact plan and tool arguments depend on the model.

KnowledgeTools requests up to five nearest candidates, then asks DeepSeek
to rerank them and keeps up to three. On reranking failure it falls back to
the original candidate order. This small fixture can return fewer than five.

## 4. Check the result

A correct answer should say that 90 minutes exceeds the guide's 60-minute
limit and suggest selecting an available slot of 60 minutes or less in the
room calendar. It should identify "Cedar meeting room booking policy" as
its source. Wording may vary; it must not claim to have booked a room.

Example expected answer:

    No. The Cedar meeting room booking policy limits each booking to
    60 minutes. Choose an available slot of 60 minutes or less in the room
    calendar and submit the booking yourself.

The UI receives SSE messages through /sse/connect/{sessionId}, including
AI_PLANNING, AI_THINKING, AI_EXECUTING, AI_GENERATED_CONTENT, and AI_DONE as
the applicable stages run. Plans, tool calls and replies can vary between runs.

## Source references

- chatmind/src/main/java/com/kama/chatmind/controller/DocumentController.java
- chatmind/src/main/java/com/kama/chatmind/service/impl/DocumentFacadeServiceImpl.java
- chatmind/src/main/java/com/kama/chatmind/agent/tools/KnowledgeTools.java
- chatmind/src/main/java/com/kama/chatmind/agent/ChatMindFactory.java
- chatmind/src/main/java/com/kama/chatmind/message/SseMessage.java
