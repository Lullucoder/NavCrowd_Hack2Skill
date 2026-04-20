export class InputValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'InputValidationError'
    this.statusCode = 400
  }
}

const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/g

const sanitizeText = (value, maxLength) => {
  if (typeof value !== 'string') {
    return ''
  }

  const normalized = value.replace(CONTROL_CHARACTERS, ' ').trim()
  return normalized.slice(0, maxLength)
}

export const requireText = (value, fieldName, { maxLength = 120 } = {}) => {
  const normalized = sanitizeText(value, maxLength)

  if (!normalized) {
    throw new InputValidationError(`${fieldName} is required`)
  }

  return normalized
}

export const optionalText = (value, { fallback = '', maxLength = 120 } = {}) => {
  const normalized = sanitizeText(value, maxLength)
  return normalized || fallback
}

export const optionalBoolean = (value, fallback = false) => {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (normalized === 'true' || normalized === '1' || normalized === 'yes') {
      return true
    }

    if (normalized === 'false' || normalized === '0' || normalized === 'no') {
      return false
    }
  }

  return fallback
}

export const optionalEnum = (value, allowedValues, fallback) => {
  if (typeof value !== 'string') {
    return fallback
  }

  const normalized = value.trim().toLowerCase()
  return allowedValues.includes(normalized) ? normalized : fallback
}

export const requireTicketId = (value, fieldName = 'ticketId') => {
  const normalized = requireText(value, fieldName, { maxLength: 24 })
  if (!/^Q-\d+$/i.test(normalized)) {
    throw new InputValidationError(`${fieldName} format is invalid`)
  }
  return normalized.toUpperCase()
}

export const requireStallId = (value, fieldName = 'stallId') => {
  const normalized = requireText(value, fieldName, { maxLength: 12 })
  if (!/^[a-z]-\d{2}$/i.test(normalized)) {
    throw new InputValidationError(`${fieldName} format is invalid`)
  }
  return normalized.toLowerCase()
}

export const parseItemIds = (value, { maxItems = 8 } = {}) => {
  if (!Array.isArray(value)) {
    throw new InputValidationError('itemIds must be an array')
  }

  const normalized = value
    .map((entry) => (typeof entry === 'string' ? entry.trim().toLowerCase() : ''))
    .filter(Boolean)

  if (!normalized.length) {
    throw new InputValidationError('At least one menu item is required')
  }

  if (normalized.length > maxItems) {
    throw new InputValidationError(`A maximum of ${maxItems} items can be ordered at once`)
  }

  return [...new Set(normalized)]
}

export const toHttpStatus = (error, fallback = 500) => {
  if (error && typeof error === 'object' && 'statusCode' in error && Number.isInteger(error.statusCode)) {
    return Number(error.statusCode)
  }

  return fallback
}
