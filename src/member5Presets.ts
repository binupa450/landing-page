/** Stable demo presets, not thresholds for a real safety system. */
export const SIMULATION_PRESETS = {
  calm: {people:13, capacity:50, trend:0, online:true},
  busy: {people:38, capacity:50, trend:3, online:true},
  critical: {people:49, capacity:50, trend:4, online:true},
  offline: {people:38, capacity:50, trend:3, online:false},
} as const;

export type PresetName = keyof typeof SIMULATION_PRESETS;
export type PresetValues = {people:number;capacity:number;trend:number;online:boolean};

export function getPreset(name:PresetName):PresetValues {
  return {...SIMULATION_PRESETS[name]};
}
