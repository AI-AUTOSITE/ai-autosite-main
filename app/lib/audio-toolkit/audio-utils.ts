// app/lib/audio-toolkit/audio-utils.ts
// 音声処理ユーティリティ関数

/**
 * AudioBufferの音量を調整
 * @param buffer - 元のAudioBuffer
 * @param gainDb - 音量調整（dB） -60 to +20
 * @returns 新しいAudioBuffer
 */
export function adjustVolume(buffer: AudioBuffer, gainDb: number): AudioBuffer {
  // dBをリニアゲインに変換
  const linearGain = Math.pow(10, gainDb / 20);
  
  // 新しいAudioBufferを作成
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const newBuffer = audioContext.createBuffer(
    buffer.numberOfChannels,
    buffer.length,
    buffer.sampleRate
  );
  
  // 各チャンネルにゲインを適用
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const inputData = buffer.getChannelData(channel);
    const outputData = newBuffer.getChannelData(channel);
    
    for (let i = 0; i < inputData.length; i++) {
      // ゲイン適用
      let sample = inputData[i] * linearGain;
      
      // クリッピング防止（-1.0 to 1.0）
      sample = Math.max(-1, Math.min(1, sample));
      
      outputData[i] = sample;
    }
  }
  
  audioContext.close();
  return newBuffer;
}

/**
 * AudioBufferのピーク音量を取得（dB）
 * @param buffer - AudioBuffer
 * @returns ピーク音量（dB）
 */
export function getPeakLevel(buffer: AudioBuffer): number {
  let maxSample = 0;
  
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < data.length; i++) {
      const absSample = Math.abs(data[i]);
      if (absSample > maxSample) {
        maxSample = absSample;
      }
    }
  }
  
  // リニアをdBに変換
  if (maxSample === 0) return -Infinity;
  return 20 * Math.log10(maxSample);
}

/**
 * AudioBufferのRMS音量を取得（dB）
 * @param buffer - AudioBuffer
 * @returns RMS音量（dB）
 */
export function getRmsLevel(buffer: AudioBuffer): number {
  let sumSquares = 0;
  let totalSamples = 0;
  
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < data.length; i++) {
      sumSquares += data[i] * data[i];
      totalSamples++;
    }
  }
  
  const rms = Math.sqrt(sumSquares / totalSamples);
  
  if (rms === 0) return -Infinity;
  return 20 * Math.log10(rms);
}

/**
 * クリッピングなしで適用可能な最大ゲインを計算
 * @param buffer - AudioBuffer
 * @returns 最大ゲイン（dB）
 */
export function getMaxGainWithoutClipping(buffer: AudioBuffer): number {
  const peakDb = getPeakLevel(buffer);
  // 0dB（フルスケール）までの余裕
  return -peakDb;
}

/**
 * ノーマライズ（音量を最大化）
 * @param buffer - AudioBuffer
 * @param targetDb - 目標ピーク音量（dB）デフォルト -0.3dB
 * @returns 新しいAudioBuffer
 */
export function normalize(buffer: AudioBuffer, targetDb: number = -0.3): AudioBuffer {
  const peakDb = getPeakLevel(buffer);
  const gainDb = targetDb - peakDb;
  return adjustVolume(buffer, gainDb);
}

/**
 * 速度変更（ピッチ維持なし - 簡易版）
 * @param buffer - AudioBuffer
 * @param speed - 速度倍率 (0.5 = 半分, 2.0 = 2倍)
 * @returns 新しいAudioBuffer
 */
export function changeSpeed(buffer: AudioBuffer, speed: number): AudioBuffer {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const newLength = Math.floor(buffer.length / speed);
  const newBuffer = audioContext.createBuffer(
    buffer.numberOfChannels,
    newLength,
    buffer.sampleRate
  );
  
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const inputData = buffer.getChannelData(channel);
    const outputData = newBuffer.getChannelData(channel);
    
    for (let i = 0; i < newLength; i++) {
      // 線形補間
      const srcIndex = i * speed;
      const srcIndexFloor = Math.floor(srcIndex);
      const srcIndexCeil = Math.min(srcIndexFloor + 1, inputData.length - 1);
      const fraction = srcIndex - srcIndexFloor;
      
      outputData[i] = inputData[srcIndexFloor] * (1 - fraction) + inputData[srcIndexCeil] * fraction;
    }
  }
  
  audioContext.close();
  return newBuffer;
}

/**
 * フェードイン
 * @param buffer - AudioBuffer
 * @param durationSec - フェード時間（秒）
 * @returns 新しいAudioBuffer
 */
export function fadeIn(buffer: AudioBuffer, durationSec: number): AudioBuffer {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const newBuffer = audioContext.createBuffer(
    buffer.numberOfChannels,
    buffer.length,
    buffer.sampleRate
  );
  
  const fadeSamples = Math.min(
    Math.floor(durationSec * buffer.sampleRate),
    buffer.length
  );
  
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const inputData = buffer.getChannelData(channel);
    const outputData = newBuffer.getChannelData(channel);
    
    for (let i = 0; i < buffer.length; i++) {
      if (i < fadeSamples) {
        // フェードイン部分
        const fadeGain = i / fadeSamples;
        outputData[i] = inputData[i] * fadeGain;
      } else {
        outputData[i] = inputData[i];
      }
    }
  }
  
  audioContext.close();
  return newBuffer;
}

/**
 * フェードアウト
 * @param buffer - AudioBuffer
 * @param durationSec - フェード時間（秒）
 * @returns 新しいAudioBuffer
 */
export function fadeOut(buffer: AudioBuffer, durationSec: number): AudioBuffer {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const newBuffer = audioContext.createBuffer(
    buffer.numberOfChannels,
    buffer.length,
    buffer.sampleRate
  );
  
  const fadeSamples = Math.min(
    Math.floor(durationSec * buffer.sampleRate),
    buffer.length
  );
  const fadeStartSample = buffer.length - fadeSamples;
  
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const inputData = buffer.getChannelData(channel);
    const outputData = newBuffer.getChannelData(channel);
    
    for (let i = 0; i < buffer.length; i++) {
      if (i >= fadeStartSample) {
        // フェードアウト部分
        const fadeGain = (buffer.length - i) / fadeSamples;
        outputData[i] = inputData[i] * fadeGain;
      } else {
        outputData[i] = inputData[i];
      }
    }
  }
  
  audioContext.close();
  return newBuffer;
}

/**
 * オーディオをトリム（切り取り）
 * @param buffer - AudioBuffer
 * @param startSec - 開始位置（秒）
 * @param endSec - 終了位置（秒）
 * @returns 新しいAudioBuffer
 */
export function trimAudio(buffer: AudioBuffer, startSec: number, endSec: number): AudioBuffer {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const startSample = Math.max(0, Math.floor(startSec * buffer.sampleRate));
  const endSample = Math.min(buffer.length, Math.floor(endSec * buffer.sampleRate));
  const newLength = endSample - startSample;
  
  if (newLength <= 0) {
    throw new Error('Invalid trim range');
  }
  
  const newBuffer = audioContext.createBuffer(
    buffer.numberOfChannels,
    newLength,
    buffer.sampleRate
  );
  
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const inputData = buffer.getChannelData(channel);
    const outputData = newBuffer.getChannelData(channel);
    
    for (let i = 0; i < newLength; i++) {
      outputData[i] = inputData[startSample + i];
    }
  }
  
  audioContext.close();
  return newBuffer;
}

/**
 * 逆再生
 * @param buffer - AudioBuffer
 * @returns 新しいAudioBuffer
 */
export function reverseAudio(buffer: AudioBuffer): AudioBuffer {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const newBuffer = audioContext.createBuffer(
    buffer.numberOfChannels,
    buffer.length,
    buffer.sampleRate
  );
  
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const inputData = buffer.getChannelData(channel);
    const outputData = newBuffer.getChannelData(channel);
    
    for (let i = 0; i < buffer.length; i++) {
      outputData[i] = inputData[buffer.length - 1 - i];
    }
  }
  
  audioContext.close();
  return newBuffer;
}

/**
 * オーディオをループ（繰り返し）
 * @param buffer - AudioBuffer
 * @param loopCount - ループ回数
 * @param crossfadeSec - クロスフェード時間（秒）デフォルト 0
 * @returns 新しいAudioBuffer
 */
export function loopAudio(buffer: AudioBuffer, loopCount: number, crossfadeSec: number = 0): AudioBuffer {
  if (loopCount < 1) loopCount = 1;
  if (loopCount > 100) loopCount = 100; // 安全上限
  
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const crossfadeSamples = Math.floor(crossfadeSec * buffer.sampleRate);
  
  // クロスフェードありの場合は長さが短くなる
  const effectiveLength = crossfadeSamples > 0 
    ? buffer.length - crossfadeSamples 
    : buffer.length;
  
  const totalLength = crossfadeSamples > 0
    ? effectiveLength * loopCount + crossfadeSamples
    : buffer.length * loopCount;
  
  const newBuffer = audioContext.createBuffer(
    buffer.numberOfChannels,
    totalLength,
    buffer.sampleRate
  );
  
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const inputData = buffer.getChannelData(channel);
    const outputData = newBuffer.getChannelData(channel);
    
    for (let loop = 0; loop < loopCount; loop++) {
      const startOffset = loop * effectiveLength;
      
      for (let i = 0; i < buffer.length; i++) {
        const outIndex = startOffset + i;
        if (outIndex >= totalLength) break;
        
        let sample = inputData[i];
        
        // クロスフェード処理
        if (crossfadeSamples > 0 && loop > 0 && i < crossfadeSamples) {
          // 前のループの終わりとクロスフェード
          const fadeIn = i / crossfadeSamples;
          const fadeOut = 1 - fadeIn;
          const prevSample = outputData[outIndex] || 0;
          sample = prevSample * fadeOut + sample * fadeIn;
        }
        
        outputData[outIndex] = (outputData[outIndex] || 0) + (crossfadeSamples > 0 && loop > 0 && i < crossfadeSamples ? 0 : sample);
        if (crossfadeSamples > 0 && loop > 0 && i < crossfadeSamples) {
          outputData[outIndex] = sample;
        } else if (crossfadeSamples === 0 || loop === 0 || i >= crossfadeSamples) {
          outputData[outIndex] = sample;
        }
      }
    }
  }
  
  audioContext.close();
  return newBuffer;
}

/**
 * 複数のAudioBufferを結合
 * @param buffers - AudioBuffer配列
 * @param crossfadeSec - クロスフェード時間（秒）デフォルト 0
 * @returns 新しいAudioBuffer
 */
export function mergeAudio(buffers: AudioBuffer[], crossfadeSec: number = 0): AudioBuffer {
  if (buffers.length === 0) {
    throw new Error('No buffers to merge');
  }
  
  if (buffers.length === 1) {
    return buffers[0];
  }
  
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // 最初のバッファを基準にサンプルレートとチャンネル数を決定
  const sampleRate = buffers[0].sampleRate;
  const numberOfChannels = Math.max(...buffers.map(b => b.numberOfChannels));
  const crossfadeSamples = Math.floor(crossfadeSec * sampleRate);
  
  // 総長さを計算
  let totalLength = buffers[0].length;
  for (let i = 1; i < buffers.length; i++) {
    totalLength += buffers[i].length - crossfadeSamples;
  }
  
  const newBuffer = audioContext.createBuffer(
    numberOfChannels,
    totalLength,
    sampleRate
  );
  
  let currentOffset = 0;
  
  for (let bufIndex = 0; bufIndex < buffers.length; bufIndex++) {
    const buf = buffers[bufIndex];
    
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const inputData = channel < buf.numberOfChannels 
        ? buf.getChannelData(channel) 
        : buf.getChannelData(0); // モノラルソースの場合
      const outputData = newBuffer.getChannelData(channel);
      
      for (let i = 0; i < buf.length; i++) {
        const outIndex = currentOffset + i;
        if (outIndex >= totalLength) break;
        
        let sample = inputData[i];
        
        // クロスフェード処理
        if (crossfadeSamples > 0 && bufIndex > 0 && i < crossfadeSamples) {
          const fadeIn = i / crossfadeSamples;
          sample = sample * fadeIn;
        }
        if (crossfadeSamples > 0 && bufIndex < buffers.length - 1 && i >= buf.length - crossfadeSamples) {
          const fadeOut = (buf.length - i) / crossfadeSamples;
          sample = sample * fadeOut;
        }
        
        outputData[outIndex] = (outputData[outIndex] || 0) + sample;
      }
    }
    
    currentOffset += buf.length - crossfadeSamples;
  }
  
  audioContext.close();
  return newBuffer;
}
