import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateOccupancy, WARNING_THRESHOLD_PCT, CRITICAL_THRESHOLD_PCT, FORECAST_HORIZON_MINUTES } from '../src/member5Metrics.ts';

test('empty zone has a normal status', () => {
  const state = calculateOccupancy(0, 50, 0, true);
  assert.equal(state.pct, 0);
  assert.equal(state.projected, 0);
  assert.equal(state.status, 'Normal');
  assert.equal(state.tone, 'healthy');
});

test('just below warning threshold remains normal', () => {
  const state = calculateOccupancy(34, 50, 0, true);
  assert.equal(state.pct, 68);
  assert.equal(state.busy, false);
});

test('exact 70% threshold is a warning', () => {
  const state = calculateOccupancy(35, 50, 0, true);
  assert.equal(state.pct, 70);
  assert.equal(state.status, 'Busy');
  assert.equal(state.tone, 'warning');
  assert.equal(state.alertTitle, 'Warning condition');
});

test('just below 90% remains a warning', () => {
  const state = calculateOccupancy(44, 50, 0, true);
  assert.equal(state.pct, 88);
  assert.equal(state.critical, false);
});

test('exact 90% is critical', () => {
  const state = calculateOccupancy(45, 50, 0, true);
  assert.equal(state.pct, 90);
  assert.equal(state.status, 'Very busy');
  assert.equal(state.critical, true);
  assert.equal(state.alertTitle, 'Critical condition');
});

test('a projected threshold crossing is clearly labelled', () => {
  const state = calculateOccupancy(30, 50, 5, true);
  assert.equal(state.pct, 60);
  assert.equal(state.projected, 90);
  assert.equal(state.alertTitle, 'Projected risk');
  assert.equal(state.alertDetail, 'Projected threshold crossing');
});

test('offline input never reports a live warning or critical status', () => {
  const state = calculateOccupancy(50, 50, 10, false);
  assert.equal(state.critical, false);
  assert.equal(state.busy, false);
  assert.equal(state.status, 'Unavailable');
  assert.equal(state.tone, 'muted');
  assert.equal(state.alertTitle, 'Data unavailable');
});

test('negative crowd trend cannot create a negative projection', () => {
  const state = calculateOccupancy(1, 50, -8, true);
  assert.equal(state.projected, 0);
});

test('invalid capacity does not divide by zero', () => {
  const state = calculateOccupancy(0, 0, 0, true);
  assert.ok(Number.isFinite(state.pct));
  assert.ok(Number.isFinite(state.projected));
});

test('non-finite inputs do not produce NaN percentages', () => {
  const state = calculateOccupancy(Number.NaN, Number.POSITIVE_INFINITY, Number.NaN, true);
  assert.equal(state.pct, 0);
  assert.equal(state.projected, 0);
});

test('negative counts are normalized for calculations', () => {
  const state = calculateOccupancy(-100, 50, 0, true);
  assert.equal(state.pct, 0);
});

test('proposed threshold constants are centrally defined', () => {
  assert.equal(WARNING_THRESHOLD_PCT, 70);
  assert.equal(CRITICAL_THRESHOLD_PCT, 90);
  assert.equal(FORECAST_HORIZON_MINUTES, 3);
  assert.ok(CRITICAL_THRESHOLD_PCT > WARNING_THRESHOLD_PCT);
});
