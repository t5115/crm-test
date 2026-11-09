// A pretend API that runs in the browser, for the static GitHub Pages build.
// GitHub Pages can't run our Express + Postgres server, so when the app is built
// with `--mode mock` (see .env.mock), client.js sends requests here instead.
//
// The data below mirrors server/db/seed.sql, and the route handlers mirror
// server/routes/*.js. If you change the seed or a route, update this file too.
//
// Changes (new tasks, ticking things off, new leads...) are kept in sessionStorage,
// so they survive a page reload but start fresh in a new tab.

import { CURRENT_USER_ID } from '../../server/currentUser.js'

const STORAGE_KEY = 'crm-mock-db-v1'
const DAY = 24 * 60 * 60 * 1000

// ---------- Seed data (same as server/db/seed.sql) ----------

function buildSeed() {
  const now = new Date()
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)

  const daysAgo = (n) => new Date(now.getTime() - n * DAY).toISOString()
  const hoursAgo = (n) => new Date(now.getTime() - n * 60 * 60 * 1000).toISOString()
  // "current_date + n" as a plain date
  const dayFromToday = (n) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + n)
  const dateOnly = (n) => dayFromToday(n).toISOString()
  // "current_date + n + time 'HH:MM'"
  const at = (n, hours, minutes) => {
    const date = dayFromToday(n)
    date.setHours(hours, minutes, 0, 0)
    return date.toISOString()
  }

  const users = [
    { id: 1, name: 'John',       email: 'john.appleseed@example.com', role: 'Admin' },
    { id: 2, name: 'Sara Khan',  email: 'sara@example.com',           role: 'Sales' },
    { id: 3, name: 'Dan Morris', email: 'dan@example.com',            role: 'Installer' },
    { id: 4, name: 'Amy Clarke', email: 'amy@example.com',            role: 'Office' },
  ]

  const stages = [
    { id: 1, key: 'lead',     name: 'Leads',       color: '#3b5bdb', icon: 'userPlus',    position: 1, summary_metric: 'new_this_week' },
    { id: 2, key: 'quote',    name: 'Quotes',      color: '#e8590c', icon: 'fileText',    position: 2, summary_metric: 'waiting' },
    { id: 3, key: 'progress', name: 'In progress', color: '#7048e8', icon: 'clock',       position: 3, summary_metric: 'due_this_week' },
    { id: 4, key: 'done',     name: 'Completed',   color: '#2f9e44', icon: 'checkCircle', position: 4, summary_metric: 'done_this_month' },
  ]

  const customers = [
    'Patel family', 'Greenway Ltd', 'Hughes', 'Okafor', 'Taylor', 'Brightside Cafe',
    'Wilson', 'Nguyen', 'Oak Lane School', 'Murphy', 'Kowalski', 'Evans',
  ].map((name, i) => ({ id: i + 1, name }))

  const tickets = []
  const addTicket = (fields) => {
    const ticket = {
      id: tickets.length + 1,
      title: '',
      customer_id: null,
      stage_id: 1,
      assigned_to: null,
      value: null,
      waiting_on_customer: false,
      due_date: null,
      completed_at: null,
      created_at: now.toISOString(),
      ...fields,
    }
    tickets.push(ticket)
    return ticket
  }

  // The named tickets that the to-do list and calendar point at
  addTicket({ title: 'Patel kitchen', customer_id: 1, stage_id: 1, assigned_to: 1, created_at: daysAgo(1) })
  addTicket({ title: 'Loft conversion', customer_id: 4, stage_id: 1, created_at: daysAgo(2) })
  addTicket({ title: 'Greenway office refit', customer_id: 2, stage_id: 2, assigned_to: 2, value: 18500, waiting_on_customer: true, created_at: daysAgo(12) })
  addTicket({ title: 'Hughes extension', customer_id: 3, stage_id: 3, assigned_to: 3, value: 42000, due_date: dateOnly(6), created_at: daysAgo(30) })
  addTicket({ title: 'Patel family bathroom', customer_id: 1, stage_id: 4, assigned_to: 1, value: 9800, completed_at: daysAgo(2), created_at: daysAgo(45) })

  // Bulk tickets, same formulas as the generate_series() inserts.
  // Every third lead/quote is unassigned so there's work to pick up.
  const assignee = (i) => (i % 3 === 0 ? null : 1 + (i % 4))

  // 22 more leads (3 of them from this week)
  const leadTitles = ['Kitchen refit', 'Bathroom remodel', 'Rear extension', 'Garden office', 'Roof repair', 'Rewiring']
  for (let i = 1; i <= 22; i++) {
    addTicket({
      title: leadTitles[i % 6], customer_id: 1 + (i % 12), stage_id: 1, assigned_to: assignee(i),
      created_at: i <= 3 ? daysAgo(i) : daysAgo(7 + i),
    })
  }

  // 11 more quotes (2 of them waiting on the customer)
  const quoteTitles = ['Kitchen refit', 'Loft conversion', 'Driveway', 'Window replacement', 'Shop fit-out']
  let firstDrivewayQuote = null
  for (let i = 1; i <= 11; i++) {
    const ticket = addTicket({
      title: quoteTitles[i % 5], customer_id: 1 + (i % 12), stage_id: 2, assigned_to: assignee(i),
      value: 3000 + i * 1250, waiting_on_customer: i <= 2, created_at: daysAgo(10 + i),
    })
    if (ticket.title === 'Driveway' && !firstDrivewayQuote) firstDrivewayQuote = ticket
  }

  // 7 more in progress (1 of them due this week)
  const progressTitles = ['Bathroom remodel', 'Rear extension', 'Rewiring', 'Garage conversion']
  for (let i = 1; i <= 7; i++) {
    addTicket({
      title: progressTitles[i % 4], customer_id: 1 + (i % 12), stage_id: 3, assigned_to: 1 + (i % 4),
      value: 8000 + i * 2000, due_date: dateOnly(i === 1 ? 3 : 10 + i * 3), created_at: daysAgo(20 + i),
    })
  }

  // 30 more completed, spread over the last two months
  const doneTitles = ['Kitchen refit', 'Bathroom remodel', 'Roof repair', 'Window replacement', 'Driveway', 'Rewiring']
  for (let i = 1; i <= 30; i++) {
    addTicket({
      title: doneTitles[i % 6], customer_id: 1 + (i % 12), stage_id: 4, assigned_to: 1 + (i % 4),
      value: 2500 + i * 900, completed_at: daysAgo(i * 2), created_at: daysAgo(40 + i * 2),
    })
  }

  // John's to-do list
  const tasks = [
    { id: 1, user_id: 1, ticket_id: 2, title: 'Call back website enquiry — loft conversion', done: false, created_at: hoursAgo(4) },
    { id: 2, user_id: 1, ticket_id: 3, title: 'Send revised quote to Greenway Ltd',          done: false, created_at: hoursAgo(3) },
    { id: 3, user_id: 1, ticket_id: 4, title: 'Order materials for Hughes extension',        done: false, created_at: hoursAgo(2) },
    { id: 4, user_id: 1, ticket_id: 5, title: 'Request review from Patel family',            done: true,  created_at: hoursAgo(1) },
  ]

  const events = [
    { id: 1, ticket_id: 1, title: 'Site survey — Patel kitchen',      starts_at: at(0, 14, 0) },
    { id: 2, ticket_id: 3, title: 'Quote follow-up — Greenway Ltd',   starts_at: at(3, 10, 30) },
    { id: 3, ticket_id: 4, title: 'Install start — Hughes extension', starts_at: at(6, 8, 0) },
    { id: 4, ticket_id: firstDrivewayQuote.id, title: 'Quote follow-up — driveway', starts_at: at(12, 11, 0) },
    { id: 5, ticket_id: 5, title: 'Handover visit — Patel family',    starts_at: at(18, 15, 0) },
  ]

  // Everyone starts with both home widgets switched on
  const userWidgets = users.flatMap((user) => [
    { user_id: user.id, widget_key: 'todo', visible: true, position: 1 },
    { user_id: user.id, widget_key: 'calendar', visible: true, position: 2 },
  ])

  return { users, stages, customers, tickets, tasks, events, userWidgets }
}

// ---------- Storage ----------

function loadDb() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {
    // Storage blocked (private mode etc.) — just use fresh data
  }
  return buildSeed()
}

const db = loadDb()

function saveDb() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  } catch {
    // Not fatal: changes just won't survive a reload
  }
}

const nextId = (rows) => Math.max(0, ...rows.map((row) => row.id)) + 1
const time = (value) => new Date(value).getTime()

// ---------- Routes (same as server/routes/*.js) ----------

// Adds the stage name/colour of the linked ticket, like the LEFT JOINs in the SQL
function withStage(row) {
  const ticket = db.tickets.find((t) => t.id === row.ticket_id)
  const stage = ticket && db.stages.find((s) => s.id === ticket.stage_id)
  return { stage_name: stage?.name ?? null, stage_color: stage?.color ?? null }
}

const toEvent = (event) => ({ id: event.id, title: event.title, starts_at: event.starts_at, ...withStage(event) })
const toTask = (task) => ({ id: task.id, title: task.title, done: task.done, ...withStage(task) })
const toUser = ({ id, name, email, role }) => ({ id, name, email, role })

function getStages() {
  const now = Date.now()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weekFromToday = today.getTime() + 7 * DAY
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).getTime()

  return [...db.stages]
    .sort((a, b) => a.position - b.position)
    .map((stage) => {
      const tickets = db.tickets.filter((t) => t.stage_id === stage.id)
      const countWhere = (test) => tickets.filter(test).length
      return {
        id: stage.id, key: stage.key, name: stage.name, color: stage.color,
        icon: stage.icon, summary_metric: stage.summary_metric,
        count: tickets.length,
        new_this_week: countWhere((t) => time(t.created_at) >= now - 7 * DAY),
        waiting: countWhere((t) => t.waiting_on_customer),
        due_this_week: countWhere((t) => t.due_date && time(t.due_date) >= today.getTime() && time(t.due_date) <= weekFromToday),
        done_this_month: countWhere((t) => t.completed_at && time(t.completed_at) >= monthStart),
      }
    })
}

function getEvents(query) {
  const from = time(query.get('from'))
  const to = time(query.get('to'))
  return db.events
    .filter((e) => time(e.starts_at) >= from && time(e.starts_at) < to)
    .sort((a, b) => time(a.starts_at) - time(b.starts_at))
    .map(toEvent)
}

function getUpcomingEvents(query) {
  const from = time(query.get('from'))
  return db.events
    .filter((e) => time(e.starts_at) >= from)
    .sort((a, b) => time(a.starts_at) - time(b.starts_at))
    .slice(0, 3)
    .map(toEvent)
}

function getTasks() {
  return db.tasks
    .filter((t) => t.user_id === CURRENT_USER_ID)
    .sort((a, b) => Number(a.done) - Number(b.done) || time(a.created_at) - time(b.created_at))
    .map(toTask)
}

function createTask(body) {
  const title = body?.title?.trim()
  if (!title) throw new MockError(400, 'Title is required')
  db.tasks.push({
    id: nextId(db.tasks), user_id: CURRENT_USER_ID, ticket_id: null,
    title, done: false, created_at: new Date().toISOString(),
  })
  return null
}

function findOwnTask(id) {
  return db.tasks.find((t) => t.id === Number(id) && t.user_id === CURRENT_USER_ID)
}

function updateTask(id, body) {
  const task = findOwnTask(id)
  if (task) task.done = Boolean(body?.done)
  return null
}

function deleteTask(id) {
  const task = findOwnTask(id)
  if (task) db.tasks.splice(db.tasks.indexOf(task), 1)
  return null
}

function createTicket(body) {
  const title = body?.title?.trim()
  const customerName = body?.customerName?.trim() ?? ''
  if (!title) throw new MockError(400, 'Title is required')

  let customerId = null
  if (customerName) {
    customerId = nextId(db.customers)
    db.customers.push({ id: customerId, name: customerName })
  }
  const firstStage = [...db.stages].sort((a, b) => a.position - b.position)[0]
  const ticket = {
    id: nextId(db.tickets), title, customer_id: customerId, stage_id: firstStage.id,
    assigned_to: null, value: null, waiting_on_customer: false, due_date: null,
    completed_at: null, created_at: new Date().toISOString(),
  }
  db.tickets.push(ticket)
  return ticket
}

const currentUser = () => db.users.find((u) => u.id === CURRENT_USER_ID)

function updateMe(body) {
  const user = currentUser()
  Object.assign(user, { name: body?.name, email: body?.email, role: body?.role })
  return toUser(user)
}

function getWidgets() {
  return db.userWidgets
    .filter((w) => w.user_id === CURRENT_USER_ID)
    .sort((a, b) => a.position - b.position)
    .map(({ widget_key, visible }) => ({ widget_key, visible }))
}

function updateWidget(key, body) {
  const widget = db.userWidgets.find((w) => w.user_id === CURRENT_USER_ID && w.widget_key === key)
  if (widget) widget.visible = Boolean(body?.visible)
  return null
}

// [method, path pattern, handler]. ":param" parts are passed to the handler in order.
const routes = [
  ['GET',    '/stages',          () => getStages()],
  ['GET',    '/events',          (query) => getEvents(query)],
  ['GET',    '/events/upcoming', (query) => getUpcomingEvents(query)],
  ['GET',    '/tasks',           () => getTasks()],
  ['POST',   '/tasks',           (query, body) => createTask(body)],
  ['PATCH',  '/tasks/:id',       (query, body, id) => updateTask(id, body)],
  ['DELETE', '/tasks/:id',       (query, body, id) => deleteTask(id)],
  ['POST',   '/tickets',         (query, body) => createTicket(body)],
  ['GET',    '/me',              () => toUser(currentUser())],
  ['PATCH',  '/me',              (query, body) => updateMe(body)],
  ['GET',    '/widgets',         () => getWidgets()],
  ['PATCH',  '/widgets/:key',    (query, body, key) => updateWidget(key, body)],
]

class MockError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

function matchRoute(pattern, path) {
  const patternParts = pattern.split('/')
  const pathParts = path.split('/')
  if (patternParts.length !== pathParts.length) return null
  const params = []
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) params.push(decodeURIComponent(pathParts[i]))
    else if (patternParts[i] !== pathParts[i]) return null
  }
  return params
}

// Same signature as request() in client.js. Resolves with the JSON the real
// server would send (or null for empty replies), and throws on errors.
export async function mockRequest(method, url, body) {
  const [path, queryString = ''] = url.split('?')
  const query = new URLSearchParams(queryString)

  for (const [routeMethod, pattern, handler] of routes) {
    if (routeMethod !== method) continue
    const params = matchRoute(pattern, path)
    if (!params) continue

    try {
      const result = handler(query, body, ...params)
      if (method !== 'GET') saveDb()
      // Copy so the app can't accidentally edit our "database" directly
      return result == null ? null : structuredClone(result)
    } catch (err) {
      if (err instanceof MockError) throw new Error(`${method} ${url} failed (${err.status})`, { cause: err })
      throw err
    }
  }

  throw new Error(`${method} ${url} failed (404)`)
}
