-- Mock data so the app has something to show.
-- Dates are relative to today (current_date / now()) so the dashboard always looks "live".
-- Totals this produces: 24 leads, 12 quotes, 8 in progress, 31 completed.

INSERT INTO users (name, email, role) VALUES
  ('John',        'john.appleseed@example.com', 'Admin'),
  ('Sara Khan',   'sara@example.com',   'Sales'),
  ('Dan Morris',  'dan@example.com',    'Installer'),
  ('Amy Clarke',  'amy@example.com',    'Office');

INSERT INTO stages (key, name, color, icon, position, summary_metric) VALUES
  ('lead',     'Leads',       '#3b5bdb', 'userPlus',    1, 'new_this_week'),
  ('quote',    'Quotes',      '#e8590c', 'fileText',    2, 'waiting'),
  ('progress', 'In progress', '#7048e8', 'clock',       3, 'due_this_week'),
  ('done',     'Completed',   '#2f9e44', 'checkCircle', 4, 'done_this_month');

INSERT INTO customers (name, email, phone) VALUES
  ('Patel family',  'patel@example.com',     '07700 900101'),
  ('Greenway Ltd',  'office@greenway.example', '020 7946 0102'),
  ('Hughes',        'hughes@example.com',    '07700 900103'),
  ('Okafor',        'okafor@example.com',    '07700 900104'),
  ('Taylor',        'taylor@example.com',     '07700 900105'),
  ('Brightside Cafe', 'hello@brightside.example', '020 7946 0106'),
  ('Wilson',        'wilson@example.com',    '07700 900107'),
  ('Nguyen',        'nguyen@example.com',    '07700 900108'),
  ('Oak Lane School', 'admin@oaklane.example', '020 7946 0109'),
  ('Murphy',        'murphy@example.com',    '07700 900110'),
  ('Kowalski',      'kowalski@example.com',  '07700 900111'),
  ('Evans',         'evans@example.com',     '07700 900112');

-- A few named tickets that the to-do list and calendar point at.
INSERT INTO tickets (title, customer_id, stage_id, assigned_to, value, waiting_on_customer, due_date, completed_at, created_at) VALUES
  ('Patel kitchen',         1, (SELECT id FROM stages WHERE key = 'lead'),     1,    NULL,  false, NULL,             NULL,                      now() - interval '1 day'),
  ('Loft conversion',       4, (SELECT id FROM stages WHERE key = 'lead'),     NULL, NULL,  false, NULL,             NULL,                      now() - interval '2 days'),
  ('Greenway office refit', 2, (SELECT id FROM stages WHERE key = 'quote'),    2,    18500, true,  NULL,             NULL,                      now() - interval '12 days'),
  ('Hughes extension',      3, (SELECT id FROM stages WHERE key = 'progress'), 3,    42000, false, current_date + 6, NULL,                      now() - interval '30 days'),
  ('Patel family bathroom', 1, (SELECT id FROM stages WHERE key = 'done'),     1,    9800,  false, NULL,             now() - interval '2 days', now() - interval '45 days');

-- Bulk tickets to fill out each stage.
-- generate_series(1, n) gives the numbers 1..n; we use "i" to vary title, customer, owner and dates.
-- Every third ticket is unassigned (assigned_to NULL) so there's work to pick up.

-- 22 more leads (3 of them from this week)
INSERT INTO tickets (title, customer_id, stage_id, assigned_to, created_at)
SELECT (ARRAY['Kitchen refit', 'Bathroom remodel', 'Rear extension', 'Garden office', 'Roof repair', 'Rewiring'])[1 + i % 6],
       1 + i % 12,
       (SELECT id FROM stages WHERE key = 'lead'),
       CASE WHEN i % 3 = 0 THEN NULL ELSE 1 + i % 4 END,
       CASE WHEN i <= 3 THEN now() - i * interval '1 day' ELSE now() - (7 + i) * interval '1 day' END
FROM generate_series(1, 22) AS i;

-- 11 more quotes (2 of them waiting on the customer)
INSERT INTO tickets (title, customer_id, stage_id, assigned_to, value, waiting_on_customer, created_at)
SELECT (ARRAY['Kitchen refit', 'Loft conversion', 'Driveway', 'Window replacement', 'Shop fit-out'])[1 + i % 5],
       1 + i % 12,
       (SELECT id FROM stages WHERE key = 'quote'),
       CASE WHEN i % 3 = 0 THEN NULL ELSE 1 + i % 4 END,
       3000 + i * 1250,
       i <= 2,
       now() - (10 + i) * interval '1 day'
FROM generate_series(1, 11) AS i;

-- 7 more in progress (1 of them due this week)
INSERT INTO tickets (title, customer_id, stage_id, assigned_to, value, due_date, created_at)
SELECT (ARRAY['Bathroom remodel', 'Rear extension', 'Rewiring', 'Garage conversion'])[1 + i % 4],
       1 + i % 12,
       (SELECT id FROM stages WHERE key = 'progress'),
       1 + i % 4,
       8000 + i * 2000,
       CASE WHEN i = 1 THEN current_date + 3 ELSE current_date + 10 + i * 3 END,
       now() - (20 + i) * interval '1 day'
FROM generate_series(1, 7) AS i;

-- 30 more completed, spread over the last two months
INSERT INTO tickets (title, customer_id, stage_id, assigned_to, value, completed_at, created_at)
SELECT (ARRAY['Kitchen refit', 'Bathroom remodel', 'Roof repair', 'Window replacement', 'Driveway', 'Rewiring'])[1 + i % 6],
       1 + i % 12,
       (SELECT id FROM stages WHERE key = 'done'),
       1 + i % 4,
       2500 + i * 900,
       now() - (i * 2) * interval '1 day',
       now() - (40 + i * 2) * interval '1 day'
FROM generate_series(1, 30) AS i;

-- John's to-do list
INSERT INTO tasks (user_id, ticket_id, title, done, created_at) VALUES
  (1, (SELECT id FROM tickets WHERE title = 'Loft conversion' AND customer_id = 4), 'Call back website enquiry — loft conversion', false, now() - interval '4 hours'),
  (1, (SELECT id FROM tickets WHERE title = 'Greenway office refit'),              'Send revised quote to Greenway Ltd',          false, now() - interval '3 hours'),
  (1, (SELECT id FROM tickets WHERE title = 'Hughes extension'),                   'Order materials for Hughes extension',        false, now() - interval '2 hours'),
  (1, (SELECT id FROM tickets WHERE title = 'Patel family bathroom'),              'Request review from Patel family',            true,  now() - interval '1 hour');

-- Calendar events. "current_date + 3 + time '10:30'" means 3 days from today at 10:30.
INSERT INTO events (ticket_id, title, starts_at) VALUES
  ((SELECT id FROM tickets WHERE title = 'Patel kitchen'),         'Site survey — Patel kitchen',          current_date + time '14:00'),
  ((SELECT id FROM tickets WHERE title = 'Greenway office refit'), 'Quote follow-up — Greenway Ltd',       current_date + 3 + time '10:30'),
  ((SELECT id FROM tickets WHERE title = 'Hughes extension'),      'Install start — Hughes extension',     current_date + 6 + time '08:00'),
  ((SELECT t.id FROM tickets t JOIN stages s ON s.id = t.stage_id
    WHERE s.key = 'quote' AND t.title = 'Driveway' ORDER BY t.id LIMIT 1), 'Quote follow-up — driveway', current_date + 12 + time '11:00'),
  ((SELECT id FROM tickets WHERE title = 'Patel family bathroom'), 'Handover visit — Patel family',        current_date + 18 + time '15:00');

-- Everyone starts with both home widgets switched on
INSERT INTO user_widgets (user_id, widget_key, visible, position)
SELECT u.id, w.key, true, w.position
FROM users u
CROSS JOIN (VALUES ('todo', 1), ('calendar', 2)) AS w(key, position);
