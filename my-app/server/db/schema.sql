-- Database tables for the CRM.
-- Run automatically by server/db/setup.js the first time the server starts.

-- People on the team. Tickets are assigned to them.
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  role       TEXT NOT NULL DEFAULT 'Member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- The pipeline. Each company can add, rename, recolour and reorder these.
CREATE TABLE stages (
  id             SERIAL PRIMARY KEY,
  key            TEXT NOT NULL UNIQUE,  -- stable id used in code, e.g. 'lead'
  name           TEXT NOT NULL,         -- label shown in the app
  color          TEXT NOT NULL,         -- hex colour for tags, dots and icons
  icon           TEXT NOT NULL,         -- icon name, see src/components/Icon.jsx
  position       INT  NOT NULL,         -- order in the pipeline (lowest = first)
  summary_metric TEXT NOT NULL          -- which note the home card shows, see src/utils/stageNotes.js
);

-- The companies or people we do work for.
CREATE TABLE customers (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT,
  phone      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- A ticket is one job moving through the pipeline.
CREATE TABLE tickets (
  id                  SERIAL PRIMARY KEY,
  title               TEXT NOT NULL,
  customer_id         INT REFERENCES customers(id) ON DELETE SET NULL,
  stage_id            INT NOT NULL REFERENCES stages(id),
  assigned_to         INT REFERENCES users(id) ON DELETE SET NULL,  -- NULL = anyone can pick it up
  value               NUMERIC(10, 2),
  waiting_on_customer BOOLEAN NOT NULL DEFAULT false,
  due_date            DATE,
  completed_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Personal to-do items. Can optionally be linked to a ticket.
CREATE TABLE tasks (
  id         SERIAL PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ticket_id  INT REFERENCES tickets(id) ON DELETE SET NULL,
  title      TEXT NOT NULL,
  done       BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Calendar entries (site visits, follow-ups, install dates...).
CREATE TABLE events (
  id        SERIAL PRIMARY KEY,
  ticket_id INT REFERENCES tickets(id) ON DELETE CASCADE,
  title     TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL
);

-- Which home screen widgets each user has switched on (the Customise button).
CREATE TABLE user_widgets (
  user_id    INT  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  widget_key TEXT NOT NULL,  -- must match a key in src/widgets/index.js
  visible    BOOLEAN NOT NULL DEFAULT true,
  position   INT  NOT NULL,
  PRIMARY KEY (user_id, widget_key)
);
