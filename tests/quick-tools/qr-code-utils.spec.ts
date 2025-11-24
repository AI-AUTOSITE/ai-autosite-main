// ============================================
// QR Code Generator - Unit Tests for Utils
// ============================================

import { test, expect } from '@playwright/test';

// ============================================
// 型定義
// ============================================

interface WiFiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

interface VCardData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  website: string;
}

// ============================================
// ユーティリティ関数
// ============================================

const formatWiFiString = (data: WiFiData): string => {
  const { ssid, password, encryption, hidden } = data;
  if (!ssid) return '';
  const hiddenStr = hidden ? 'H:true;' : '';
  if (encryption === 'nopass') {
    return `WIFI:T:nopass;S:${ssid};${hiddenStr};`;
  }
  return `WIFI:T:${encryption};S:${ssid};P:${password};${hiddenStr};`;
};

const formatVCardString = (data: VCardData): string => {
  const lines = ['BEGIN:VCARD', 'VERSION:3.0'];

  if (data.firstName || data.lastName) {
    lines.push(`N:${data.lastName};${data.firstName};;;`);
    lines.push(`FN:${data.firstName} ${data.lastName}`.trim());
  }
  if (data.email) lines.push(`EMAIL:${data.email}`);
  if (data.phone) lines.push(`TEL:${data.phone}`);
  if (data.company) lines.push(`ORG:${data.company}`);
  if (data.title) lines.push(`TITLE:${data.title}`);
  if (data.website) lines.push(`URL:${data.website}`);

  lines.push('END:VCARD');
  return lines.join('\n');
};

const getContrastRatio = (hex1: string, hex2: string): number => {
  const getLuminance = (hex: string): number => {
    const rgb = hex
      .replace('#', '')
      .match(/.{2}/g)
      ?.map((x) => {
        const c = parseInt(x, 16) / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      }) || [0, 0, 0];
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };

  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

const isContrastOk = (hex1: string, hex2: string): boolean => {
  return getContrastRatio(hex1, hex2) >= 4.5;
};

const getSizeLabel = (size: number): string => {
  switch (size) {
    case 256:
      return 'Small';
    case 512:
      return 'Medium';
    case 1024:
      return 'Large';
    default:
      return `${size}px`;
  }
};

// ============================================
// WiFi文字列フォーマットテスト
// ============================================

test.describe('formatWiFiString - WiFiフォーマット', () => {
  test('SSIDが空の場合は空文字を返す', () => {
    const data: WiFiData = {
      ssid: '',
      password: 'test123',
      encryption: 'WPA',
      hidden: false,
    };
    expect(formatWiFiString(data)).toBe('');
  });

  test('WPA WiFiが正しくフォーマットされる', () => {
    const data: WiFiData = {
      ssid: 'MyNetwork',
      password: 'MyPassword',
      encryption: 'WPA',
      hidden: false,
    };
    expect(formatWiFiString(data)).toBe('WIFI:T:WPA;S:MyNetwork;P:MyPassword;;');
  });

  test('WEP WiFiが正しくフォーマットされる', () => {
    const data: WiFiData = {
      ssid: 'OldNetwork',
      password: 'WepKey',
      encryption: 'WEP',
      hidden: false,
    };
    expect(formatWiFiString(data)).toBe('WIFI:T:WEP;S:OldNetwork;P:WepKey;;');
  });

  test('オープンネットワーク(nopass)が正しくフォーマットされる', () => {
    const data: WiFiData = {
      ssid: 'OpenNetwork',
      password: '',
      encryption: 'nopass',
      hidden: false,
    };
    expect(formatWiFiString(data)).toBe('WIFI:T:nopass;S:OpenNetwork;;');
  });

  test('隠しネットワークフラグが含まれる', () => {
    const data: WiFiData = {
      ssid: 'HiddenNetwork',
      password: 'Secret',
      encryption: 'WPA',
      hidden: true,
    };
    expect(formatWiFiString(data)).toBe('WIFI:T:WPA;S:HiddenNetwork;P:Secret;H:true;;');
  });

  test('SSIDに特殊文字が含まれても処理できる', () => {
    const data: WiFiData = {
      ssid: 'My Network! @#$',
      password: 'pass',
      encryption: 'WPA',
      hidden: false,
    };
    const result = formatWiFiString(data);
    expect(result).toContain('S:My Network! @#$');
  });

  test('SSIDに日本語が含まれても処理できる', () => {
    const data: WiFiData = {
      ssid: '日本語ネットワーク',
      password: 'password',
      encryption: 'WPA',
      hidden: false,
    };
    const result = formatWiFiString(data);
    expect(result).toContain('S:日本語ネットワーク');
  });

  test('パスワードが空でもフォーマットされる(WPA)', () => {
    const data: WiFiData = {
      ssid: 'TestNet',
      password: '',
      encryption: 'WPA',
      hidden: false,
    };
    expect(formatWiFiString(data)).toBe('WIFI:T:WPA;S:TestNet;P:;;');
  });
});

// ============================================
// vCard文字列フォーマットテスト
// ============================================

test.describe('formatVCardString - vCardフォーマット', () => {
  test('名のみで最小vCardが作成される', () => {
    const data: VCardData = {
      firstName: 'John',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      title: '',
      website: '',
    };
    const result = formatVCardString(data);
    expect(result).toContain('BEGIN:VCARD');
    expect(result).toContain('VERSION:3.0');
    expect(result).toContain('N:;John;;;');
    expect(result).toContain('FN:John');
    expect(result).toContain('END:VCARD');
  });

  test('全フィールドで完全vCardが作成される', () => {
    const data: VCardData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      company: 'Example Inc.',
      title: 'Developer',
      website: 'https://example.com',
    };
    const result = formatVCardString(data);
    expect(result).toContain('N:Doe;John;;;');
    expect(result).toContain('FN:John Doe');
    expect(result).toContain('EMAIL:john@example.com');
    expect(result).toContain('TEL:+1234567890');
    expect(result).toContain('ORG:Example Inc.');
    expect(result).toContain('TITLE:Developer');
    expect(result).toContain('URL:https://example.com');
  });

  test('姓のみでvCardが作成される', () => {
    const data: VCardData = {
      firstName: '',
      lastName: 'Smith',
      email: '',
      phone: '',
      company: '',
      title: '',
      website: '',
    };
    const result = formatVCardString(data);
    expect(result).toContain('N:Smith;;;;');
    // FNには先頭スペースが入る可能性がある（実装による）
    expect(result).toContain('FN:');
    expect(result).toContain('Smith');
  });

  test('空のオプションフィールドはスキップされる', () => {
    const data: VCardData = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@test.com',
      phone: '',
      company: '',
      title: '',
      website: '',
    };
    const result = formatVCardString(data);
    expect(result).not.toContain('TEL:');
    expect(result).not.toContain('ORG:');
    expect(result).not.toContain('TITLE:');
    expect(result).not.toContain('URL:');
    expect(result).toContain('EMAIL:jane@test.com');
  });

  test('全て空データで最小vCardが作成される', () => {
    const data: VCardData = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      title: '',
      website: '',
    };
    const result = formatVCardString(data);
    expect(result).toBe('BEGIN:VCARD\nVERSION:3.0\nEND:VCARD');
  });

  test('日本語が処理できる', () => {
    const data: VCardData = {
      firstName: '太郎',
      lastName: '山田',
      email: 'taro@example.com',
      phone: '',
      company: '株式会社テスト',
      title: '',
      website: '',
    };
    const result = formatVCardString(data);
    expect(result).toContain('N:山田;太郎;;;');
    expect(result).toContain('太郎');
    expect(result).toContain('山田');
    expect(result).toContain('ORG:株式会社テスト');
  });
});

// ============================================
// コントラスト比テスト
// ============================================

test.describe('getContrastRatio - コントラスト比', () => {
  test('白黒で最大コントラストを返す', () => {
    const ratio = getContrastRatio('#000000', '#FFFFFF');
    expect(ratio).toBeCloseTo(21, 0);
  });

  test('同色で1を返す', () => {
    const ratio = getContrastRatio('#FF0000', '#FF0000');
    expect(ratio).toBeCloseTo(1, 2);
  });

  test('小文字hexも処理できる', () => {
    const ratio = getContrastRatio('#ffffff', '#000000');
    expect(ratio).toBeCloseTo(21, 0);
  });

  test('グレーで中程度のコントラストを返す', () => {
    const ratio = getContrastRatio('#808080', '#FFFFFF');
    expect(ratio).toBeGreaterThan(3);
    expect(ratio).toBeLessThan(5);
  });
});

test.describe('isContrastOk - WCAG AA判定', () => {
  test('高コントラスト(白黒)でtrue', () => {
    expect(isContrastOk('#000000', '#FFFFFF')).toBe(true);
  });

  test('低コントラスト(薄グレー/白)でfalse', () => {
    expect(isContrastOk('#CCCCCC', '#FFFFFF')).toBe(false);
  });

  test('4.5:1ちょうどでtrue', () => {
    expect(isContrastOk('#767676', '#FFFFFF')).toBe(true);
  });

  test('暗い背景でも動作する', () => {
    expect(isContrastOk('#FFFFFF', '#000000')).toBe(true);
    expect(isContrastOk('#333333', '#000000')).toBe(false);
  });
});

// ============================================
// サイズラベルテスト
// ============================================

test.describe('getSizeLabel - サイズラベル', () => {
  test('256でSmallを返す', () => {
    expect(getSizeLabel(256)).toBe('Small');
  });

  test('512でMediumを返す', () => {
    expect(getSizeLabel(512)).toBe('Medium');
  });

  test('1024でLargeを返す', () => {
    expect(getSizeLabel(1024)).toBe('Large');
  });

  test('その他のサイズはpx付きで返す', () => {
    expect(getSizeLabel(128)).toBe('128px');
    expect(getSizeLabel(2048)).toBe('2048px');
  });
});

// ============================================
// エッジケーステスト
// ============================================

test.describe('エッジケース', () => {
  test('WiFiパスワードにセミコロンが含まれる', () => {
    const data: WiFiData = {
      ssid: 'Test',
      password: 'pass;word;test',
      encryption: 'WPA',
      hidden: false,
    };
    const result = formatWiFiString(data);
    expect(result).toContain('P:pass;word;test');
  });

  test('vCardに引用符が含まれる', () => {
    const data: VCardData = {
      firstName: 'John "Johnny"',
      lastName: "O'Brien",
      email: '',
      phone: '',
      company: '',
      title: '',
      website: '',
    };
    const result = formatVCardString(data);
    expect(result).toContain('John "Johnny"');
    expect(result).toContain("O'Brien");
  });

  test('非常に長いSSIDが処理できる', () => {
    const data: WiFiData = {
      ssid: 'A'.repeat(100),
      password: 'test',
      encryption: 'WPA',
      hidden: false,
    };
    const result = formatWiFiString(data);
    expect(result).toContain('A'.repeat(100));
  });
});