-- Migration: Add CSRF token to sessions table
-- Created: 2025-12-26
-- Purpose: Implement CSRF protection for all state-changing operations

ALTER TABLE sessions ADD COLUMN csrf_token VARCHAR(64);

-- Create index for faster token lookups
CREATE INDEX idx_sessions_csrf_token ON sessions(csrf_token);

-- Existing sessions will have NULL csrf_token
-- They will get a token on their next authenticated request
