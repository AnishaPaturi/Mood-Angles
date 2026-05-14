# TODO - Fix test results fetching/saving

- [x] Update `backend/routes/results.js` to set `user` from `req.body.user` when `req.user` is missing.
- [x] Update `backend/routes/profileRoute.js` select to include `agents` field
- [x] Fix `frontend/src/pages/Profile.jsx` to access `test.agents?.agentJ?.decision` instead of `test.angelJ?.decision`
- [x] Add debug logging to profile test results fetch

## Upload Section Improvements
- [x] Backend: Add file type validation (PDF, JPG, PNG only)
- [x] Backend: Add 5MB file size limit
- [x] Backend: Fix privacy bug - GET `/api/uploads` requires `userId` parameter
- [x] Frontend: Add category selector dropdown
- [x] Frontend: Show category tags in file list
- [x] Frontend: Pass `userId` with uploads

## Document Analysis Feature
- [x] Created `backend/scripts/extract_text.py` for PDF/image text extraction
- [x] Created `backend/routes/documentAnalysis.js` API endpoint
- [x] Added Python dependencies (pdfplumber, pytesseract, python-docx)
- [x] Updated `frontend/src/pages/UploadD.jsx` with analyze button and results display
- [ ] Run backend and test document analysis flow
- [ ] Install Python dependencies: `pip install -r backend/requirements.txt`
- [ ] Install Tesseract OCR: See https://github.com/UB-Mannheim/tesseract/wiki for Windows