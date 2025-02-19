-- Insert test profiles
INSERT INTO profiles (full_name, role, status, email, phone) VALUES
('Admin User', 'System Administrator', 'Active', 'admin@example.com', '+1234567890'),
('Director Smith', 'Director', 'Active', 'director@example.com', '+1234567891'),
('Mr. James Brown', 'House Master', 'Active', 'james@example.com', '+1234567892'),
('Ms. Jane Wilson', 'Deputy House Master', 'Active', 'jane@example.com', '+1234567893'),
('Dr. Sarah Wilson', 'Medical Staff', 'Active', 'sarah@example.com', '+1234567894'),
('Chef Johnson', 'Kitchen Staff', 'Active', 'chef@example.com', '+1234567895');

-- Insert test houses
INSERT INTO houses (name, capacity, house_master_id, deputy_master_id) VALUES
('East Wing', 50, (SELECT id FROM profiles WHERE email = 'james@example.com'), (SELECT id FROM profiles WHERE email = 'jane@example.com')),
('West Wing', 50, (SELECT id FROM profiles WHERE email = 'james@example.com'), (SELECT id FROM profiles WHERE email = 'jane@example.com'));

-- Insert test rooms
INSERT INTO rooms (house_id, room_number, capacity) VALUES
((SELECT id FROM houses WHERE name = 'East Wing'), '101', 2),
((SELECT id FROM houses WHERE name = 'East Wing'), '102', 2),
((SELECT id FROM houses WHERE name = 'West Wing'), '201', 2),
((SELECT id FROM houses WHERE name = 'West Wing'), '202', 2);

-- Insert test beds
INSERT INTO beds (room_id, bed_number) VALUES
((SELECT id FROM rooms WHERE room_number = '101'), 'A'),
((SELECT id FROM rooms WHERE room_number = '101'), 'B'),
((SELECT id FROM rooms WHERE room_number = '102'), 'A'),
((SELECT id FROM rooms WHERE room_number = '102'), 'B'),
((SELECT id FROM rooms WHERE room_number = '201'), 'A'),
((SELECT id FROM rooms WHERE room_number = '201'), 'B'),
((SELECT id FROM rooms WHERE room_number = '202'), 'A'),
((SELECT id FROM rooms WHERE room_number = '202'), 'B');