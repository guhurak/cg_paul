import migration_202410201620 from "./202410201620_create_survey_response_table.js"
import migration_202410201603 from "./202410201603_create_surveys_table.js"

const versions = [
  ["202410201603", migration_202410201603],
  ["202410201620", migration_202410201620]
]

export default versions
