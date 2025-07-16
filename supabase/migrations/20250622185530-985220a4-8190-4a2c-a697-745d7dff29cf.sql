
-- Remove unused indexes identified by the performance advisor
DROP INDEX IF EXISTS idx_bundle_items_bundle_id;
DROP INDEX IF EXISTS idx_cart_items_user_id;
DROP INDEX IF EXISTS idx_group_cart_items_group_session_id;
DROP INDEX IF EXISTS idx_group_cart_items_user_id;
DROP INDEX IF EXISTS idx_group_member_payments_user_id;
DROP INDEX IF EXISTS idx_group_member_payments_group_session_id;
DROP INDEX IF EXISTS idx_group_members_user_id;
DROP INDEX IF EXISTS idx_group_members_group_session_id;
DROP INDEX IF EXISTS idx_group_sessions_leader_id;
DROP INDEX IF EXISTS idx_orders_user_id;
DROP INDEX IF EXISTS idx_user_discounts_user_id;
DROP INDEX IF EXISTS idx_cart_items_user_product;
DROP INDEX IF EXISTS idx_group_cart_items_session_user;
DROP INDEX IF EXISTS idx_orders_user_status;
DROP INDEX IF EXISTS idx_user_discounts_user_active;
