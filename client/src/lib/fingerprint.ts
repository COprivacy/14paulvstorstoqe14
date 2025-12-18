interface DeviceInfo {
  browser: string;
  browserVersion: string;
  os: string;
  platform: string;
  language: string;
  timezone: string;
  screenResolution: string;
  colorDepth: number;
  deviceMemory?: number;
  hardwareConcurrency?: number;
  touchSupport: boolean;
  cookiesEnabled: boolean;
  doNotTrack: string | null;
}

export function getDeviceInfo(): DeviceInfo {
  const nav = navigator as any;
  
  const getBrowser = (): { name: string; version: string } => {
    const ua = navigator.userAgent;
    let browser = "Unknown";
    let version = "Unknown";
    
    if (ua.includes("Firefox")) {
      browser = "Firefox";
      version = ua.match(/Firefox\/(\d+)/)?.[1] || "Unknown";
    } else if (ua.includes("Chrome") && !ua.includes("Edg")) {
      browser = "Chrome";
      version = ua.match(/Chrome\/(\d+)/)?.[1] || "Unknown";
    } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
      browser = "Safari";
      version = ua.match(/Version\/(\d+)/)?.[1] || "Unknown";
    } else if (ua.includes("Edg")) {
      browser = "Edge";
      version = ua.match(/Edg\/(\d+)/)?.[1] || "Unknown";
    } else if (ua.includes("Opera") || ua.includes("OPR")) {
      browser = "Opera";
      version = ua.match(/(?:Opera|OPR)\/(\d+)/)?.[1] || "Unknown";
    }
    
    return { name: browser, version };
  };
  
  const getOS = (): string => {
    const ua = navigator.userAgent;
    if (ua.includes("Windows NT 10.0")) return "Windows 10/11";
    if (ua.includes("Windows NT 6.3")) return "Windows 8.1";
    if (ua.includes("Windows NT 6.2")) return "Windows 8";
    if (ua.includes("Windows NT 6.1")) return "Windows 7";
    if (ua.includes("Mac OS X")) return "macOS";
    if (ua.includes("Linux")) return "Linux";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
    return "Unknown";
  };
  
  const browserInfo = getBrowser();
  
  return {
    browser: browserInfo.name,
    browserVersion: browserInfo.version,
    os: getOS(),
    platform: navigator.platform || "Unknown",
    language: navigator.language || "Unknown",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    deviceMemory: nav.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
    touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
  };
}

export async function generateFingerprint(): Promise<string> {
  const deviceInfo = getDeviceInfo();
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let canvasHash = '';
  
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Pavisoft', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Security', 4, 17);
    canvasHash = canvas.toDataURL();
  }
  
  const fingerprintData = JSON.stringify({
    ...deviceInfo,
    canvasHash: canvasHash.substring(0, 100),
  });
  
  const encoder = new TextEncoder();
  const data = encoder.encode(fingerprintData);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

export function getStoredSessionToken(): string | null {
  try {
    // Tentar localStorage primeiro (mais persistente)
    const localToken = localStorage.getItem('session_token');
    if (localToken) return localToken;
    
    // Fallback para sessionStorage (melhor para mobile)
    const sessionToken = sessionStorage.getItem('session_token');
    return sessionToken;
  } catch (e) {
    // Se localStorage falhar (private mode), usar sessionStorage
    try {
      return sessionStorage.getItem('session_token');
    } catch {
      return null;
    }
  }
}

export function setStoredSessionToken(token: string): void {
  try {
    // Tentar armazenar em ambos os locais para máxima compatibilidade
    try {
      localStorage.setItem('session_token', token);
    } catch (e) {
      console.warn('[TOKEN] localStorage indisponível, usando sessionStorage');
    }
    
    // Sempre armazenar em sessionStorage como fallback
    sessionStorage.setItem('session_token', token);
  } catch (e) {
    console.error('[TOKEN] Erro ao armazenar token:', e);
  }
}

export function clearStoredSessionToken(): void {
  try {
    localStorage.removeItem('session_token');
  } catch (e) {
    // Ignorar erros
  }
  
  try {
    sessionStorage.removeItem('session_token');
  } catch (e) {
    // Ignorar erros
  }
}
