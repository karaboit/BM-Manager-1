-- Seed menu templates
INSERT INTO menu_templates (name, type, items, dietary_notes, created_by) VALUES
('Standard Breakfast', 'breakfast', 
  'Eggs, Toast, Cereal, Fruit, Yogurt', 
  'Vegetarian options available', 'u9'),
('Vegetarian Breakfast', 'breakfast',
  'Oatmeal, Fresh Fruit, Yogurt, Whole Grain Toast',
  'Fully vegetarian', 'u9'),
('Standard Lunch', 'lunch',
  'Sandwiches, Salad, Soup, Fruit',
  'Vegetarian options available', 'u9'),
('Standard Dinner', 'dinner',
  'Grilled Chicken, Rice, Steamed Vegetables',
  'Vegetarian options available', 'u9')
ON CONFLICT DO NOTHING;

-- Seed meal plans
INSERT INTO meal_plans (date, meal_type, menu, expected_count, dietary_requirements, created_by) VALUES
(CURRENT_DATE, 'breakfast',
  'Eggs, Toast, Cereal, Fruit',
  150,
  '{"vegetarian": 12, "halal": 8, "gluten_free": 3}',
  'u9'),
(CURRENT_DATE, 'lunch',
  'Sandwiches, Salad, Soup',
  145,
  '{"vegetarian": 12, "halal": 8, "gluten_free": 3}',
  'u9'),
(CURRENT_DATE, 'dinner',
  'Grilled Chicken, Rice, Vegetables',
  148,
  '{"vegetarian": 12, "halal": 8, "gluten_free": 3}',
  'u9')
ON CONFLICT DO NOTHING;

-- Seed dietary requirements
INSERT INTO dietary_requirements (boarder_id, requirement_type, details, medical_note) VALUES
('u17', 'Allergy', 'Peanuts', 'Severe allergy - carries EpiPen'),
('u18', 'Dietary', 'Vegetarian', 'Personal choice'),
('u19', 'Medical', 'Diabetic', 'Needs regular meal times'),
('u20', 'Allergy', 'Shellfish', 'Mild allergy')
ON CONFLICT DO NOTHING;

-- Seed packed meals
INSERT INTO packed_meals (meal_plan_id, boarder_id, reason, status)
SELECT 
  mp.id,
  'u17',
  'Sports tournament',
  'pending'
FROM meal_plans mp
WHERE mp.meal_type = 'lunch' AND mp.date = CURRENT_DATE
ON CONFLICT DO NOTHING;