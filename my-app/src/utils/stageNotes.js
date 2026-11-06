// The small note under the number on each home card.
// Each stage picks one of these with its summary_metric column in the database,
// so a company can change what a card shows without touching code.
const NOTES = {
  new_this_week: (stage) => `${stage.new_this_week} new this week`,
  waiting: (stage) => `${stage.waiting} awaiting reply`,
  due_this_week: (stage) => `${stage.due_this_week} due this week`,
  done_this_month: (stage) => `${stage.done_this_month} this month`,
}

export function stageNote(stage) {
  return NOTES[stage.summary_metric]?.(stage) ?? ''
}
