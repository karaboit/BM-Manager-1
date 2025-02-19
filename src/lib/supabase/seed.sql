-- Seed data for core tables

-- Insert houses
INSERT INTO houses (id, name) VALUES
('h1', 'East Wing'),
('h2', 'West Wing'),
('h3', 'North Wing')
ON CONFLICT (id) DO NOTHING;

-- Insert profiles (users)
INSERT INTO profiles (id, email, full_name, role, house_id) VALUES
-- System Administrators
('u1', 'admin@example.com', 'Admin User', 'System Administrator', null),

-- Directors
('u2', 'director@example.com', 'Director Smith', 'Director', null),

-- House Masters
('u3', 'james@example.com', 'Mr. James Brown', 'House Master', 'h1'),
('u4', 'sarah@example.com', 'Ms. Sarah Wilson', 'House Master', 'h2'),

-- Deputy House Masters
('u5', 'deputy1@example.com', 'John Deputy', 'Deputy House Master', 'h1'),
('u6', 'deputy2@example.com', 'Jane Deputy', 'Deputy House Master', 'h2'),

-- Medical Staff
('u7', 'nurse@example.com', 'Nurse Johnson', 'Medical Staff', null),
('u8', 'doctor@example.com', 'Dr. Wilson', 'Medical Staff', null),

-- Kitchen Staff
('u9', 'chef@example.com', 'Chef Anderson', 'Kitchen Staff', null),
('u10', 'kitchen@example.com', 'Kitchen Staff 1', 'Kitchen Staff', null),

-- Support Staff
('u11', 'support1@example.com', 'Support Staff 1', 'Support Staff', null),
('u12', 'support2@example.com', 'Support Staff 2', 'Support Staff', null),

-- Prefects
('u13', 'prefect1@example.com', 'Head Prefect', 'Prefect', 'h1'),
('u14', 'prefect2@example.com', 'Deputy Prefect', 'Prefect', 'h2'),

-- Parents
('u15', 'parent1@example.com', 'Mr. Smith', 'Boarder Parent', null),
('u16', 'parent2@example.com', 'Mrs. Jones', 'Boarder Parent', null),

-- Boarders
('u17', 'student1@example.com', 'John Smith', 'Boarder', 'h1'),
('u18', 'student2@example.com', 'Jane Doe', 'Boarder', 'h1'),
('u19', 'student3@example.com', 'Bob Wilson', 'Boarder', 'h2'),
('u20', 'student4@example.com', 'Alice Brown', 'Boarder', 'h2')
ON CONFLICT (id) DO NOTHING;

-- Insert parent-student relationships
INSERT INTO parent_student_relationships (parent_id, student_id) VALUES
('u15', 'u17'), -- Mr. Smith is John Smith's parent
('u15', 'u18'), -- Mr. Smith is also Jane Doe's parent
('u16', 'u19'), -- Mrs. Jones is Bob Wilson's parent
('u16', 'u20')  -- Mrs. Jones is also Alice Brown's parent
ON CONFLICT (parent_id, student_id) DO NOTHING;

-- Insert rooms
INSERT INTO rooms (id, house_id, name, floor) VALUES
('r1', 'h1', '101', 1),
('r2', 'h1', '102', 1),
('r3', 'h1', '103', 1),
('r4', 'h2', '201', 2),
('r5', 'h2', '202', 2),
('r6', 'h2', '203', 2)
ON CONFLICT (id) DO NOTHING;

-- Insert beds
INSERT INTO beds (id, room_id, name, student_id) VALUES
('b1', 'r1', 'A', 'u17'),
('b2', 'r1', 'B', 'u18'),
('b3', 'r2', 'A', null),
('b4', 'r2', 'B', null),
('b5', 'r3', 'A', 'u19'),
('b6', 'r3', 'B', 'u20')
ON CONFLICT (id) DO NOTHING;

-- Insert permissions and roles
INSERT INTO permission_categories (id, name, description) VALUES
('pc1', 'User Management', 'User and role management permissions'),
('pc2', 'Medical', 'Medical records and clinic access'),
('pc3', 'Kitchen', 'Kitchen and meal management'),
('pc4', 'Boarding', 'Boarding house management'),
('pc5', 'System', 'System configuration and maintenance')
ON CONFLICT (id) DO NOTHING;

-- Insert basic permissions
INSERT INTO permissions (id, category_id, name, description) VALUES
('p1', 'pc1', 'manage_users', 'Create and manage user accounts'),
('p2', 'pc1', 'view_users', 'View user profiles'),
('p3', 'pc2', 'manage_medical', 'Manage medical records'),
('p4', 'pc2', 'view_medical', 'View medical records'),
('p5', 'pc3', 'manage_kitchen', 'Manage kitchen operations'),
('p6', 'pc4', 'manage_boarding', 'Manage boarding houses'),
('p7', 'pc5', 'manage_system', 'Manage system settings')
ON CONFLICT (id) DO NOTHING;

-- Insert role permissions
INSERT INTO role_permissions (role, permission_id) VALUES
('System Administrator', 'p1'),
('System Administrator', 'p2'),
('System Administrator', 'p3'),
('System Administrator', 'p4'),
('System Administrator', 'p5'),
('System Administrator', 'p6'),
('System Administrator', 'p7'),
('Director', 'p1'),
('Director', 'p2'),
('Director', 'p4'),
('Director', 'p6'),
('House Master', 'p2'),
('House Master', 'p4'),
('House Master', 'p6'),
('Medical Staff', 'p3'),
('Medical Staff', 'p4'),
('Kitchen Staff', 'p5')
ON CONFLICT (role, permission_id) DO NOTHING;