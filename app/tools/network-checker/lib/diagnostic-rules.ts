// app/tools/network-checker/lib/diagnostic-rules.ts
import type { Device, DiagnosticResult, DiagnosticRule } from './types'
import { isValidIP, isSameNetwork, getNetworkSegment, groupByNetwork } from './network-utils'

/**
 * Rule: Check if all IPs are valid
 */
const invalidIPRule: DiagnosticRule = {
  id: 'invalid-ip',
  name: 'Invalid IP Address',
  check: (devices) => {
    return devices.some(d => !isValidIP(d.ip))
  },
  getSolution: (devices) => {
    const invalid = devices.filter(d => !isValidIP(d.ip))
    return {
      type: 'invalid-ip',
      severity: 'error',
      title: 'Invalid IP Address',
      message: `${invalid.length} device(s) have invalid IP addresses.`,
      solutions: [
        'IP format: 192.168.1.100',
        'Four numbers separated by dots',
        'Each number between 0-255',
        'Find IP: Settings → Network → IP Address'
      ]
    }
  }
}

/**
 * Rule: Check if devices are on same network
 */
const differentNetworkRule: DiagnosticRule = {
  id: 'different-network',
  name: 'Different Networks',
  check: (devices) => {
    if (devices.length < 2) return false
    const firstSegment = getNetworkSegment(devices[0].ip)
    return devices.some(d => getNetworkSegment(d.ip) !== firstSegment)
  },
  getSolution: (devices) => {
    const groups = groupByNetwork(devices)
    const networks = Array.from(groups.keys())
    
    return {
      type: 'different-network',
      severity: 'warning',
      title: 'Different Networks Detected',
      message: 'Devices are on different networks. They cannot connect directly.',
      solutions: [
        'Connect all devices to the same router',
        'Use wired connection for stability',
        'Check WiFi network name (SSID)',
        'Ask network admin for help'
      ],
      technicalDetails: {
        networks,
        canConnect: false
      }
    }
  }
}

/**
 * Rule: All devices on same network
 */
const sameNetworkRule: DiagnosticRule = {
  id: 'same-network',
  name: 'Same Network',
  check: (devices) => {
    if (devices.length < 2) return false
    const firstSegment = getNetworkSegment(devices[0].ip)
    return devices.every(d => getNetworkSegment(d.ip) === firstSegment)
  },
  getSolution: (devices) => {
    const segment = getNetworkSegment(devices[0].ip)
    
    return {
      type: 'same-network',
      severity: 'success',
      title: 'Same Network - Can Connect!',
      message: 'All devices are on the same network. They should be able to connect.',
      solutions: [
        'If still can\'t connect, check:',
        '• Firewall settings',
        '• File sharing enabled',
        '• Correct folder permissions',
        '• Both devices turned on'
      ],
      technicalDetails: {
        networks: [segment],
        canConnect: true
      }
    }
  }
}

/**
 * Rule: Need more devices
 */
const needMoreDevicesRule: DiagnosticRule = {
  id: 'need-more-devices',
  name: 'Need More Devices',
  check: (devices) => {
    return devices.length < 2 || devices.some(d => !d.ip.trim())
  },
  getSolution: () => {
    return {
      type: 'need-more-devices',
      severity: 'info',
      title: 'Add More Devices',
      message: 'Add at least 2 devices with IP addresses to check connection.',
      solutions: [
        'Click "Add Device" button',
        'Enter device name and IP address',
        'Try the example to see how it works'
      ]
    }
  }
}

/**
 * All diagnostic rules in priority order
 */
export const DIAGNOSTIC_RULES: DiagnosticRule[] = [
  needMoreDevicesRule,
  invalidIPRule,
  differentNetworkRule,
  sameNetworkRule,
]

/**
 * Run diagnosis on devices
 */
export function diagnoseDevices(devices: Device[]): DiagnosticResult {
  // Run rules in order, return first match
  for (const rule of DIAGNOSTIC_RULES) {
    if (rule.check(devices)) {
      return rule.getSolution(devices)
    }
  }
  
  // Fallback
  return {
    type: null,
    severity: 'info',
    title: 'Ready to Check',
    message: 'Enter device information and click Check Connection.',
    solutions: []
  }
}

/**
 * Get human-readable solution steps
 */
export function getSolutionSteps(result: DiagnosticResult): string[] {
  return result.solutions || []
}

/**
 * Check if result indicates a problem
 */
export function hasProblem(result: DiagnosticResult): boolean {
  return result.severity === 'warning' || result.severity === 'error'
}