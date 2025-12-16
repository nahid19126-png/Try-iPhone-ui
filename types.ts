export enum AppScreen {
  BOOT = 'BOOT',
  LOCK = 'LOCK',
  HOME = 'HOME',
  NOTES = 'NOTES',
  CAMERA = 'CAMERA',
  GALLERY = 'GALLERY',
  CALL = 'CALL',
  DRAWING = 'DRAWING',
  AUDIO_ERASER = 'AUDIO_ERASER',
  GEMINI_LIVE = 'GEMINI_LIVE',
  BROWSER = 'BROWSER',
  MESSAGES = 'MESSAGES',
  RECENTS = 'RECENTS',
  SETTINGS = 'SETTINGS',
  CALCULATOR = 'CALCULATOR',
  CLOCK = 'CLOCK',
  MUSIC = 'MUSIC',
  MY_FILES = 'MY_FILES',
  DEVICE_CARE = 'DEVICE_CARE',
  AR_ZONE = 'AR_ZONE',
  KIDS_MODE = 'KIDS_MODE',
  THEME_STORE = 'THEME_STORE',
  MODES_ROUTINES = 'MODES_ROUTINES',
  APP_LIBRARY = 'APP_LIBRARY',
  QUICK_SHARE = 'QUICK_SHARE'
}

export type ThemeType = 'DEFAULT' | 'NEON' | 'PASTEL' | 'DARK_MATTER';
export type ModeType = 'NONE' | 'SLEEP' | 'WORK' | 'RELAX';

export interface Note {
  id: string;
  title: string;
  content: string;
}

export interface Photo {
  id: string;
  url: string;
  description: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  location: string;
}

export interface SimulationState {
  battery: number;
  time: string;
  energyScore: number;
}

export interface LogMessage {
  id: string;
  text: string;
  sender: 'system' | 'user' | 'ai';
}