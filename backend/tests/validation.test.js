import assert from 'node:assert/strict'
import test from 'node:test'
import {
  InputValidationError,
  optionalEnum,
  parseItemIds,
  requireStallId,
  requireTicketId,
  requireText
} from '../utils/validation.js'

test('requireText trims and validates non-empty strings', () => {
  const value = requireText('  hello  ', 'message', { maxLength: 20 })
  assert.equal(value, 'hello')
})

test('requireText throws for empty values', () => {
  assert.throws(() => requireText('   ', 'message'), InputValidationError)
})

test('parseItemIds enforces array and deduplicates values', () => {
  const parsed = parseItemIds(['m1', 'm1', 'm2'])
  assert.deepEqual(parsed, ['m1', 'm2'])
})

test('ticket and stall format validators normalize values', () => {
  assert.equal(requireTicketId('q-402'), 'Q-402')
  assert.equal(requireStallId('F-01'), 'f-01')
})

test('optionalEnum falls back when value is not allowed', () => {
  assert.equal(optionalEnum('critical', ['info', 'warning'], 'warning'), 'warning')
})
