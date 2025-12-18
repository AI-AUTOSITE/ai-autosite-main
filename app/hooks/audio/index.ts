// app/hooks/audio/index.ts
// 共有オーディオHooksのエクスポート

export { useAudioContext, isAudioContextSupported, closeGlobalAudioContext } from './useAudioContext';
export { useAudioBuffer } from './useAudioBuffer';
export { useAudioExport } from './useAudioExport';
export { useMediaRecorder } from './useMediaRecorder';

// 今後追加予定:
// export { useWaveform } from './useWaveform';
// export { useTranscription } from './useTranscription';
// export { useWebSpeech } from './useWebSpeech';
// export { useAudioOperations } from './useAudioOperations';
