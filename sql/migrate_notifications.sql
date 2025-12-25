-- Migration: Add notifications_enabled column to users table (if not already exists)
-- This is a compatibility migration since the schema already has 'receive_notifications'
-- We'll add 'notifications_enabled' as an alias and deprecate the old column

DO $$ 
BEGIN
    -- Check if notifications_enabled column exists, add it if not
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='notifications_enabled') THEN
        ALTER TABLE users ADD COLUMN notifications_enabled BOOLEAN DEFAULT TRUE;
        
        -- Copy data from receive_notifications if it exists
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='receive_notifications') THEN
            UPDATE users SET notifications_enabled = receive_notifications;
        END IF;
        
        RAISE NOTICE 'Added notifications_enabled column to users table';
    ELSE
        RAISE NOTICE 'notifications_enabled column already exists';
    END IF;
END $$;
