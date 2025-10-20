# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-10-20

### Added
- ✅ Complete authentication system (JWT)
- ✅ AI chat widget with customizable appearance
- ✅ RAG system with semantic search
- ✅ Training materials management (Files, Links, Text)
- ✅ Usage tracking with monthly limits
- ✅ Conversations history
- ✅ Container-aware widget (Appearance/Try/Real)
- ✅ OpenAI embeddings integration (optional)
- ✅ DeepSeek AI integration
- ✅ Railway deployment ready
- ✅ MongoDB integration
- ✅ Rate limiting
- ✅ User isolation for SaaS

### Features

**Widget:**
- Ask-bar with auto-expand textarea
- Modal with smooth animations
- Date dividers (Today, Yesterday)
- Source chips
- Typing indicator
- Suggested questions
- Focus management
- RGB glow effect (optional)

**RAG:**
- Improved chunking (800 chars + 200 overlap)
- Semantic search with cosine similarity
- Fallback to keyword-based search
- Automatic indexing
- Top-3 results with re-ranking

**Usage Tracking:**
- Messages per month limit
- Tokens per month limit
- Auto-reset monthly
- Usage stats API
- Plan-based limits (Free/Pro/Enterprise)

### Technical
- TypeScript throughout
- React Query for data fetching
- TailwindCSS for styling
- Express backend
- MongoDB with Mongoose
- Vite for building

### Security
- JWT authentication
- bcrypt password hashing
- Rate limiting (100 req/15min)
- User isolation
- Trust proxy for Railway
- Input validation

### Performance
- MongoDB indexes
- Embeddings caching
- Static file serving
- React lazy loading
- Optimized animations

---

## Future Releases

### [1.1.0] - Planned
- [ ] Usage dashboard in frontend
- [ ] Plan upgrade UI
- [ ] Conversation search
- [ ] Export conversations (PDF/Markdown)
- [ ] Reset to defaults button

### [1.2.0] - Planned
- [ ] Vector database (Pinecone/Weaviate)
- [ ] Re-ranking for better results
- [ ] Multi-language support
- [ ] Team features
- [ ] Analytics dashboard

### [2.0.0] - Future
- [ ] Public API
- [ ] Webhooks
- [ ] Custom domains
- [ ] White-label option
- [ ] Advanced analytics

---

**Version Format:** [Major.Minor.Patch]
- **Major:** Breaking changes
- **Minor:** New features
- **Patch:** Bug fixes
