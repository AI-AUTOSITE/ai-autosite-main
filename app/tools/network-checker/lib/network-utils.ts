// app/tools/network-checker/lib/network-utils.ts

/**
 * Check if IP address is valid
 */
export function isValidIP(ip: string): boolean {
  const parts = ip.split('.')
  if (parts.length !== 4) return false
  
  return parts.every(part => {
    const num = parseInt(part, 10)
    return !isNaN(num) && num >= 0 && num <= 255
  })
}

/**
 * Check if IP is a private IP address
 */
export function isPrivateIP(ip: string): boolean {
  const parts = ip.split('.').map(p => parseInt(p, 10))
  const first = parts[0]
  const second = parts[1]
  
  return (
    first === 192 && second === 168 ||
    first === 10 ||
    (first === 172 && second >= 16 && second <= 31)
  )
}

/**
 * Get network segment (first 3 octets)
 */
export function getNetworkSegment(ip: string): string {
  return ip.split('.').slice(0, 3).join('.')
}

/**
 * Check if two IPs are on the same network
 */
export function isSameNetwork(ip1: string, ip2: string): boolean {
  return getNetworkSegment(ip1) === getNetworkSegment(ip2)
}

/**
 * Group devices by network segment
 */
export function groupByNetwork(devices: { id: string; name: string; ip: string; connection: 'wired' | 'wifi' }[]) {
  const groups = new Map<string, typeof devices>()
  
  devices.forEach(device => {
    const segment = getNetworkSegment(device.ip)
    if (!groups.has(segment)) {
      groups.set(segment, [])
    }
    groups.get(segment)!.push(device)
  })
  
  return groups
}

/**
 * Format IP address for display
 */
export function formatIP(ip: string): string {
  return ip
}

/**
 * Validate all devices have valid IPs
 */
export function validateDevices(devices: { ip: string }[]): { valid: boolean; invalidIndices: number[] } {
  const invalidIndices: number[] = []
  
  devices.forEach((device, index) => {
    if (!isValidIP(device.ip)) {
      invalidIndices.push(index)
    }
  })
  
  return {
    valid: invalidIndices.length === 0,
    invalidIndices
  }
}

/**
 * Get common network prefix
 */
export function getCommonPrefix(ips: string[]): string | null {
  if (ips.length === 0) return null
  
  const firstSegment = getNetworkSegment(ips[0])
  const allSame = ips.every(ip => getNetworkSegment(ip) === firstSegment)
  
  return allSame ? firstSegment : null
}

/**
 * Suggest IP for same network
 */
export function suggestIPForNetwork(existingIPs: string[], targetSegment: string): string {
  const usedLastOctets = new Set(
    existingIPs
      .filter(ip => getNetworkSegment(ip) === targetSegment)
      .map(ip => parseInt(ip.split('.')[3], 10))
  )
  
  // Find first available number from 100-200
  for (let i = 100; i <= 200; i++) {
    if (!usedLastOctets.has(i)) {
      return `${targetSegment}.${i}`
    }
  }
  
  return `${targetSegment}.150`
}