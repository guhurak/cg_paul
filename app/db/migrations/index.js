import migration_202410201620 from "./202410201620_create_survey_response_table.js"
import migration_202410201603 from "./202410201603_create_surveys_table.js"
import migration_202410261412 from "./202410261412_create_vote_table.js"
import migration_202410261526 from "./202410261526_create_survey_participation_table.js"
import migration_202410272343 from "./202410272343_add_status_for_survey.js"

const versions = [
  ["202410201603", migration_202410201603],
  ["202410201620", migration_202410201620],
  ["202410261412", migration_202410261412],
  ["202410261526", migration_202410261526],
  ["202410272343", migration_202410272343]
]

export default versions
