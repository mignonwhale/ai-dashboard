-- AI 대시보드 - Supabase RLS 정책 설정
-- 이 SQL을 Supabase 대시보드의 SQL 편집기에서 실행하세요.

-- 1. todos 테이블 RLS 정책

-- RLS 활성화
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Users can view own todos" ON todos;
DROP POLICY IF EXISTS "Users can insert own todos" ON todos;
DROP POLICY IF EXISTS "Users can update own todos" ON todos;
DROP POLICY IF EXISTS "Users can delete own todos" ON todos;

-- SELECT 정책: 사용자는 자신의 할일만 볼 수 있음
CREATE POLICY "Users can view own todos" ON todos
    FOR SELECT USING (auth.uid() = user_id);

-- INSERT 정책: 사용자는 자신의 할일만 추가할 수 있음
CREATE POLICY "Users can insert own todos" ON todos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE 정책: 사용자는 자신의 할일만 수정할 수 있음
CREATE POLICY "Users can update own todos" ON todos
    FOR UPDATE USING (auth.uid() = user_id);

-- DELETE 정책: 사용자는 자신의 할일만 삭제할 수 있음
CREATE POLICY "Users can delete own todos" ON todos
    FOR DELETE USING (auth.uid() = user_id);

-- 2. files 테이블 RLS 정책

-- RLS 활성화
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Users can view own files" ON files;
DROP POLICY IF EXISTS "Users can insert own files" ON files;
DROP POLICY IF EXISTS "Users can update own files" ON files;
DROP POLICY IF EXISTS "Users can delete own files" ON files;

-- SELECT 정책: 사용자는 자신의 파일만 볼 수 있음
CREATE POLICY "Users can view own files" ON files
    FOR SELECT USING (auth.uid() = user_id);

-- INSERT 정책: 사용자는 자신의 파일만 추가할 수 있음
CREATE POLICY "Users can insert own files" ON files
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE 정책: 사용자는 자신의 파일만 수정할 수 있음
CREATE POLICY "Users can update own files" ON files
    FOR UPDATE USING (auth.uid() = user_id);

-- DELETE 정책: 사용자는 자신의 파일만 삭제할 수 있음
CREATE POLICY "Users can delete own files" ON files
    FOR DELETE USING (auth.uid() = user_id);

-- 3. ai_chat 테이블 RLS 정책

-- RLS 활성화
ALTER TABLE ai_chat ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Users can view own chats" ON ai_chat;
DROP POLICY IF EXISTS "Users can insert own chats" ON ai_chat;
DROP POLICY IF EXISTS "Users can update own chats" ON ai_chat;
DROP POLICY IF EXISTS "Users can delete own chats" ON ai_chat;

-- SELECT 정책: 사용자는 자신의 채팅만 볼 수 있음
CREATE POLICY "Users can view own chats" ON ai_chat
    FOR SELECT USING (auth.uid() = user_id);

-- INSERT 정책: 사용자는 자신의 채팅만 추가할 수 있음
CREATE POLICY "Users can insert own chats" ON ai_chat
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE 정책: 사용자는 자신의 채팅만 수정할 수 있음
CREATE POLICY "Users can update own chats" ON ai_chat
    FOR UPDATE USING (auth.uid() = user_id);

-- DELETE 정책: 사용자는 자신의 채팅만 삭제할 수 있음
CREATE POLICY "Users can delete own chats" ON ai_chat
    FOR DELETE USING (auth.uid() = user_id);

-- 4. ai_text_gen 테이블 RLS 정책

-- RLS 활성화
ALTER TABLE ai_text_gen ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Users can view own text_gen" ON ai_text_gen;
DROP POLICY IF EXISTS "Users can insert own text_gen" ON ai_text_gen;
DROP POLICY IF EXISTS "Users can update own text_gen" ON ai_text_gen;
DROP POLICY IF EXISTS "Users can delete own text_gen" ON ai_text_gen;

-- SELECT 정책: 사용자는 자신의 텍스트 생성만 볼 수 있음
CREATE POLICY "Users can view own text_gen" ON ai_text_gen
    FOR SELECT USING (auth.uid() = user_id);

-- INSERT 정책: 사용자는 자신의 텍스트 생성만 추가할 수 있음
CREATE POLICY "Users can insert own text_gen" ON ai_text_gen
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE 정책: 사용자는 자신의 텍스트 생성만 수정할 수 있음
CREATE POLICY "Users can update own text_gen" ON ai_text_gen
    FOR UPDATE USING (auth.uid() = user_id);

-- DELETE 정책: 사용자는 자신의 텍스트 생성만 삭제할 수 있음
CREATE POLICY "Users can delete own text_gen" ON ai_text_gen
    FOR DELETE USING (auth.uid() = user_id);

-- 5. csv_analysis 테이블 RLS 정책

-- RLS 활성화
ALTER TABLE csv_analysis ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Users can view own csv_analysis" ON csv_analysis;
DROP POLICY IF EXISTS "Users can insert own csv_analysis" ON csv_analysis;
DROP POLICY IF EXISTS "Users can update own csv_analysis" ON csv_analysis;
DROP POLICY IF EXISTS "Users can delete own csv_analysis" ON csv_analysis;

-- SELECT 정책: 사용자는 자신의 CSV 분석만 볼 수 있음
CREATE POLICY "Users can view own csv_analysis" ON csv_analysis
    FOR SELECT USING (auth.uid() = user_id);

-- INSERT 정책: 사용자는 자신의 CSV 분석만 추가할 수 있음
CREATE POLICY "Users can insert own csv_analysis" ON csv_analysis
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE 정책: 사용자는 자신의 CSV 분석만 수정할 수 있음
CREATE POLICY "Users can update own csv_analysis" ON csv_analysis
    FOR UPDATE USING (auth.uid() = user_id);

-- DELETE 정책: 사용자는 자신의 CSV 분석만 삭제할 수 있음
CREATE POLICY "Users can delete own csv_analysis" ON csv_analysis
    FOR DELETE USING (auth.uid() = user_id);

-- 6. Storage 정책 (files 버킷)

-- files 버킷에 대한 정책 설정
-- 버킷이 존재하지 않으면 먼저 생성해야 합니다.

-- SELECT 정책: 사용자는 자신의 파일만 다운로드 가능
CREATE POLICY "Users can view own files" ON storage.objects
    FOR SELECT USING (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- INSERT 정책: 사용자는 자신의 폴더에만 파일 업로드 가능
CREATE POLICY "Users can insert own files" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- UPDATE 정책: 사용자는 자신의 파일만 수정 가능
CREATE POLICY "Users can update own files" ON storage.objects
    FOR UPDATE USING (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- DELETE 정책: 사용자는 자신의 파일만 삭제 가능
CREATE POLICY "Users can delete own files" ON storage.objects
    FOR DELETE USING (bucket_id = 'files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 정책 적용 완료 메시지
SELECT 'RLS policies have been successfully applied to all tables!' as status;