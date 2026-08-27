/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} role
 * @property {string} created_at
 */

/**
 * @typedef {Object} PatientProfile
 * @property {string} id
 * @property {string} user_id
 * @property {string} name
 * @property {number} age
 * @property {number} pregnancy_week
 * @property {string} edd
 * @property {string} blood_group
 * @property {string[]} conditions
 * @property {string} emergency_contact
 * @property {string} emergency_contact_name
 * @property {string} language
 * @property {string} asha_contact
 */

/**
 * @typedef {Object} Measurement
 * @property {string} id
 * @property {string} user_id
 * @property {string} type
 * @property {number} value
 * @property {string} unit
 * @property {number} confidence
 * @property {number} signal_quality
 * @property {Object} metadata
 * @property {string} created_at
 */

/**
 * @typedef {Object} VisionScan
 * @property {string} id
 * @property {string} user_id
 * @property {string} type
 * @property {Object} result
 * @property {number} confidence
 * @property {string} notes
 * @property {string} created_at
 */

/**
 * @typedef {Object} LabReportField
 * @property {string} name
 * @property {string} value
 * @property {string} unit
 * @property {string} reference_range
 */

/**
 * @typedef {Object} LabReport
 * @property {string} id
 * @property {string} user_id
 * @property {LabReportField[]} fields
 * @property {string} ocr_raw
 * @property {boolean} verified
 * @property {string} source
 * @property {string} created_at
 */

/**
 * @typedef {Object} SymptomSession
 * @property {string} id
 * @property {string} user_id
 * @property {string} transcript
 * @property {string} language
 * @property {string[]} extracted_symptoms
 * @property {TriageResponse} triage_response
 * @property {string} urgency
 * @property {string} created_at
 */

/**
 * @typedef {Object} RiskAssessment
 * @property {string} id
 * @property {string} user_id
 * @property {string} level
 * @property {number} score
 * @property {string[]} factors
 * @property {string[]} reasons
 * @property {string[]} recommendations
 * @property {string} created_at
 */

/**
 * @typedef {Object} EmergencyEvent
 * @property {string} id
 * @property {string} user_id
 * @property {string} type
 * @property {Object} payload
 * @property {string} status
 * @property {string} sent_at
 * @property {string} acknowledged_at
 * @property {string} created_at
 */

/**
 * @typedef {Object} Report
 * @property {string} id
 * @property {string} user_id
 * @property {string} title
 * @property {string} content
 * @property {string} verification_id
 * @property {string} created_at
 */

/**
 * @typedef {Object} TriageResponse
 * @property {string[]} symptoms
 * @property {string[]} possible_concerns
 * @property {string} urgency_level
 * @property {string[]} what_to_do_now
 * @property {string[]} what_to_monitor
 * @property {string} when_to_seek_care
 * @property {string[]} red_flags
 */
