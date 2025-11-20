import { BotScenarioData, UserData } from '@/types/chat';

// ============================================
// Helper Functions
// ============================================

/**
 * Check if restaurant is closed for today's reservations
 * Closing times:
 * - Weekday (Mon-Fri): 8:00 PM (20:00)
 * - Weekend (Sat-Sun): 7:00 PM (19:00)
 * IMPORTANT: Uses restaurant's timezone (America/New_York)
 */
const isClosedForToday = (): boolean => {
  // Get current time and day in NYC timezone
  const now = new Date();
  const nycDate = new Date(now.toLocaleString('en-US', { 
    timeZone: 'America/New_York' 
  }));
  
  const nycTimeString = now.toLocaleString('en-US', { 
    timeZone: 'America/New_York',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Extract hour from NYC time string (format: "HH:MM")
  const currentHour = parseInt(nycTimeString.split(':')[0]);
  
  // Get day of week (0 = Sunday, 6 = Saturday)
  const dayOfWeek = nycDate.getDay();
  
  // Weekend: Saturday (6) and Sunday (0)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    // Weekend closes at 7:00 PM (19:00)
    return currentHour >= 19;
  }
  
  // Weekday: Monday (1) - Friday (5)
  // Closes at 8:00 PM (20:00)
  return currentHour >= 20;
};


/**
 * Get formatted date string for reservation
 */
const getFormattedDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
};


/**
 * Get date label for button display
 * Format: "Nov 19 (Tue)"
 */
/**
 * Get date label for button display
 * Format: "Nov 19 (Tue)"
 * IMPORTANT: Uses restaurant's timezone (America/New_York)
 */
const getDateLabel = (daysFromNow: number): string => {
  // Get current date in NYC timezone
  const now = new Date();
  const nycDate = new Date(now.toLocaleString('en-US', { 
    timeZone: 'America/New_York' 
  }));
  
  // Add days
  nycDate.setDate(nycDate.getDate() + daysFromNow);
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const month = monthNames[nycDate.getMonth()];
  const day = nycDate.getDate();
  const dayOfWeek = dayNames[nycDate.getDay()];
  
  return `${month} ${day} (${dayOfWeek})`;
};


/**
 * Get next Saturday date label
 */
/**
 * Get next Saturday date label
 * IMPORTANT: Uses restaurant's timezone (America/New_York)
 */
const getWeekendLabel = (): string => {
  // Get current date in NYC timezone
  const now = new Date();
  const nycDate = new Date(now.toLocaleString('en-US', { 
    timeZone: 'America/New_York' 
  }));
  
  const daysUntilSaturday = (6 - nycDate.getDay() + 7) % 7 || 7;
  
  const saturday = new Date(nycDate);
  saturday.setDate(saturday.getDate() + daysUntilSaturday);
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[saturday.getMonth()];
  const day = saturday.getDate();
  
  return `${month} ${day} (Sat)`;
};



/**
 * Get today's business hours based on day of week
 * IMPORTANT: Uses restaurant's timezone (America/New_York)
 */
const getTodayBusinessHours = (): { open: string; close: string; dayType: string } => {
  // Get current day in NYC timezone
  const now = new Date();
  const nycDate = new Date(now.toLocaleString('en-US', { 
    timeZone: 'America/New_York' 
  }));
  
  const dayOfWeek = nycDate.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Weekend: Saturday (6) and Sunday (0)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return {
      open: '9:00 AM',
      close: '7:00 PM',
      dayType: 'Weekend'
    };
  }
  
  // Weekday: Monday (1) - Friday (5)
  return {
    open: '8:00 AM',
    close: '8:00 PM',
    dayType: 'Weekday'
  };
};


/**
 * Get formatted today's hours message
 */
const getTodayHoursMessage = (): string => {
  const hours = getTodayBusinessHours();
  
  // Get current day name
  const now = new Date();
  const nycDate = new Date(now.toLocaleString('en-US', { 
    timeZone: 'America/New_York' 
  }));
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = dayNames[nycDate.getDay()];
  
  return `📅 **Today (${todayName})**: ${hours.open} - ${hours.close}`;
};


// Signal Cafe NYC - Automated Reservation Bot
// ✨ Fully automated reservation flow demo
export const getRuleCafeScenario = (): BotScenarioData => {
  const isClosed = isClosedForToday();
  
  return {
  // ============================================
  // Main Menu
  // ============================================
  main: {
    id: 'main',
    message: 'Welcome to Signal Cafe NYC! ☕✨\n\n**This is a demo chatbot** showcasing automated reservation capabilities.\n\nHow can I help you today?',
    buttons: [
      { 
        id: 'btn-reservation', 
        label: '📅 Make a Reservation', 
        value: 'reservation', 
        action: 'reservation-start',
        ariaLabel: 'Start making a reservation',
        isPrimary: true
      },
      { 
        id: 'btn-menu', 
        label: '🍽️ View Menu', 
        value: 'menu', 
        action: 'menu-list',
        ariaLabel: 'View our menu'
      },
      { 
        id: 'btn-hours', 
        label: '🕐 Hours & Location', 
        value: 'hours', 
        action: 'hours-info',
        ariaLabel: 'See hours and location'
      },
      { 
        id: 'btn-faq', 
        label: '❓ FAQ', 
        value: 'faq', 
        action: 'faq-menu',
        ariaLabel: 'Frequently asked questions'
      },
      {
        id: 'btn-human-support',
        label: '👤 Talk to Staff',
        value: 'human',
        action: 'escalation',
        ariaLabel: 'Contact a staff member',
        isEscalation: true
      },
    ],
    ariaLabel: 'Main menu',
  },

  // ============================================
  // Automated Reservation Flow
  // ============================================
  'reservation-start': {
    id: 'reservation-start',
    message: 'Perfect! Let\'s get your table reserved 🪑\n\n**First, how many people will be joining?**\n\n*(For parties of 5 or more, we\'ll provide direct phone assistance)*',
    buttons: [
      { 
        id: 'btn-people-1', 
        label: '1 person', 
        value: '1', 
        action: 'reservation-date',
        ariaLabel: 'Reservation for 1 person' 
      },
      { 
        id: 'btn-people-2', 
        label: '2 people', 
        value: '2', 
        action: 'reservation-date',
        ariaLabel: 'Reservation for 2 people',
        isPrimary: true
      },
      { 
        id: 'btn-people-3', 
        label: '3 people', 
        value: '3', 
        action: 'reservation-date',
        ariaLabel: 'Reservation for 3 people' 
      },
      { 
        id: 'btn-people-4', 
        label: '4 people', 
        value: '4', 
        action: 'reservation-date',
        ariaLabel: 'Reservation for 4 people' 
      },
      { 
        id: 'btn-people-5plus', 
        label: '5+ people - 📞 Call Us', 
        value: '5+', 
        action: 'reservation-large-group',
        ariaLabel: 'Reservation for 5 or more people - Call for assistance' 
      },
      { 
        id: 'btn-back-main', 
        label: '⬅️ Back to Menu', 
        value: 'back', 
        action: 'main',
        ariaLabel: 'Back to main menu' 
      },
    ],
    ariaLabel: 'Select party size',
  },

  'reservation-date': {
    id: 'reservation-date',
    message: (userData: UserData) => {
      const people = userData.numberOfPeople || '?';
      return `Great! Table for **${people}** ${people === '1' ? 'person' : 'people'} 👥\n\n**When would you like to visit us?**`;
    },
    buttons: [
      { 
        id: 'btn-date-today', 
        label: isClosed ? `📅 ${getDateLabel(0)} (Closed)` : `📅 ${getDateLabel(0)}`, 
        value: 'today', 
        action: isClosed ? 'reservation-closed-today' : 'reservation-time',
        ariaLabel: isClosed ? 'Restaurant is closed for today' : 'Reserve for today',
        disabled: isClosed
      },
      { 
        id: 'btn-date-tomorrow', 
        label: `📅 ${getDateLabel(1)}`, 
        value: 'tomorrow', 
        action: 'reservation-time',
        ariaLabel: 'Reserve for tomorrow',
        isPrimary: true
      },
      { 
        id: 'btn-date-2days', 
        label: `📅 ${getDateLabel(2)}`, 
        value: '2days', 
        action: 'reservation-time',
        ariaLabel: 'Reserve for day after tomorrow' 
      },
      { 
        id: 'btn-date-3days', 
        label: `📅 ${getDateLabel(3)}`, 
        value: '3days', 
        action: 'reservation-time',
        ariaLabel: 'Reserve for 3 days from now' 
      },
      { 
        id: 'btn-date-weekend', 
        label: `📅 ${getWeekendLabel()}`, 
        value: 'weekend', 
        action: 'reservation-time',
        ariaLabel: 'Reserve for this weekend' 
      },
      { 
        id: 'btn-back-people', 
        label: '⬅️ Change Party Size', 
        value: 'back', 
        action: 'reservation-start',
        ariaLabel: 'Go back to change party size' 
      },
    ],
    ariaLabel: 'Select reservation date',
  },


  // ============================================
  // Closed for Today Message
  // ============================================
  'reservation-closed-today': {
    id: 'reservation-closed-today',
    message: '⏰ **Sorry, we\'re closed for today!**\n\nOur restaurant accepts reservations until **8:00 PM** daily.\n\nPlease book for **tomorrow** or select a future date. We\'d love to see you soon! 🌟',
    buttons: [
      { 
        id: 'btn-tomorrow-retry', 
        label: `📅 ${getDateLabel(1)}`, 
        value: 'tomorrow', 
        action: 'reservation-time',
        ariaLabel: 'Reserve for tomorrow',
        isPrimary: true
      },
      { 
        id: 'btn-2days-retry', 
        label: `📅 ${getDateLabel(2)}`, 
        value: '2days', 
        action: 'reservation-time',
        ariaLabel: 'Reserve for day after tomorrow' 
      },
      { 
        id: 'btn-back-date', 
        label: '⬅️ Back', 
        value: 'back', 
        action: 'reservation-start',
        ariaLabel: 'Back to date selection' 
      },
    ],
    ariaLabel: 'Restaurant closed for today - select another date',
  },

  // ============================================
  // Time Selection
  // ============================================
  'reservation-time': {
    id: 'reservation-time',
    message: (userData: UserData) => {
      const date = userData.reservationDate || 'your selected date';
      return `Great choice! 📅\n\n**What time works best for you?**\n\nPlease select from our available time slots.`;
    },
    buttons: [
      { 
        id: 'btn-select-time', 
        label: '🕐 Select Time', 
        value: 'select-time', 
        action: 'show-time-picker',
        ariaLabel: 'Open time picker',
        isPrimary: true
      },
      { 
        id: 'btn-back-date', 
        label: '⬅️ Change Date', 
        value: 'back', 
        action: 'reservation-date',
        ariaLabel: 'Go back to select date' 
      },
    ],
    ariaLabel: 'Select reservation time',
  },



  'reservation-large-group': {
    id: 'reservation-large-group',
    message: 'For parties of **5 or more**, please call us directly for the best experience 📞\n\n**Phone: (212) 555-0123**\n\nOur team will help you with:\n✅ Special seating arrangements\n✅ Menu customization\n✅ Group discounts\n\n**Hours:**\nMon-Fri: 8:00 AM - 8:00 PM\nSat-Sun: 9:00 AM - 7:00 PM\n\n*(This is a demo number)*\n\nCan I help you with anything else?',
    buttons: [
      { 
        id: 'btn-back-people', 
        label: '⬅️ Change Party Size', 
        value: 'back', 
        action: 'reservation-start',
        ariaLabel: 'Go back to change party size' 
      },
      { 
        id: 'btn-back-main-large', 
        label: '⬅️ Back to Menu', 
        value: 'back', 
        action: 'main',
        ariaLabel: 'Back to main menu' 
      },
    ],
  },

  'reservation-contact-name': {
    id: 'reservation-contact-name',
    message: 'Almost there! 👤\n\n**What name should we put the reservation under?**\n\n*(For this demo, select a sample name)*',
    buttons: [
      { 
        id: 'btn-name-john', 
        label: 'John Smith', 
        value: 'John Smith', 
        action: 'reservation-contact-method',
        ariaLabel: 'Use name John Smith',
        isPrimary: true
      },
      { 
        id: 'btn-name-sarah', 
        label: 'Sarah Johnson', 
        value: 'Sarah Johnson', 
        action: 'reservation-contact-method',
        ariaLabel: 'Use name Sarah Johnson' 
      },
      { 
        id: 'btn-name-michael', 
        label: 'Michael Chen', 
        value: 'Michael Chen', 
        action: 'reservation-contact-method',
        ariaLabel: 'Use name Michael Chen' 
      },
      { 
        id: 'btn-back-people-2', 
        label: '⬅️ Change Party Size', 
        value: 'back', 
        action: 'reservation-people',
        ariaLabel: 'Go back to change party size' 
      },
    ],
    ariaLabel: 'Enter your name',
  },

  'reservation-contact-method': {
    id: 'reservation-contact-method',
    message: (userData: UserData) => {
      const name = userData.customerName || 'there';
      return `Great, ${name}! 📱\n\n**How would you like us to contact you?**`;
    },
    buttons: [
      { 
        id: 'btn-contact-phone', 
        label: '📞 Phone Number', 
        value: 'phone', 
        action: 'reservation-contact-phone',
        ariaLabel: 'Provide phone number',
        isPrimary: true
      },
      { 
        id: 'btn-contact-email', 
        label: '📧 Email Address', 
        value: 'email', 
        action: 'reservation-contact-email',
        ariaLabel: 'Provide email address' 
      },
      { 
        id: 'btn-back-name', 
        label: '⬅️ Change Name', 
        value: 'back', 
        action: 'reservation-contact-name',
        ariaLabel: 'Go back to change name' 
      },
    ],
    ariaLabel: 'Select contact method',
  },

  'reservation-contact-phone': {
    id: 'reservation-contact-phone',
    message: '📞 **Phone Number**\n\n*(For this demo, select a sample phone number)*',
    buttons: [
      { 
        id: 'btn-phone-1', 
        label: '(555) 123-4567', 
        value: '(555) 123-4567', 
        action: 'reservation-special-request',
        ariaLabel: 'Use phone number (555) 123-4567',
        isPrimary: true
      },
      { 
        id: 'btn-phone-2', 
        label: '(555) 987-6543', 
        value: '(555) 987-6543', 
        action: 'reservation-special-request',
        ariaLabel: 'Use phone number (555) 987-6543' 
      },
      { 
        id: 'btn-back-method', 
        label: '⬅️ Use Email Instead', 
        value: 'back', 
        action: 'reservation-contact-email',
        ariaLabel: 'Switch to email instead' 
      },
    ],
    ariaLabel: 'Enter phone number',
  },

  'reservation-contact-email': {
    id: 'reservation-contact-email',
    message: '📧 **Email Address**\n\n*(For this demo, select a sample email)*',
    buttons: [
      { 
        id: 'btn-email-1', 
        label: 'john.smith@email.com', 
        value: 'john.smith@email.com', 
        action: 'reservation-special-request',
        ariaLabel: 'Use email john.smith@email.com',
        isPrimary: true
      },
      { 
        id: 'btn-email-2', 
        label: 'sarah.j@email.com', 
        value: 'sarah.j@email.com', 
        action: 'reservation-special-request',
        ariaLabel: 'Use email sarah.j@email.com' 
      },
      { 
        id: 'btn-back-method-2', 
        label: '⬅️ Use Phone Instead', 
        value: 'back', 
        action: 'reservation-contact-phone',
        ariaLabel: 'Switch to phone instead' 
      },
    ],
    ariaLabel: 'Enter email address',
  },

  'reservation-special-request': {
    id: 'reservation-special-request',
    message: '💬 **Any special requests?**\n\nLet us know how we can make your visit more comfortable.\n\n*(Optional)*',
    buttons: [
      { 
        id: 'btn-request-window', 
        label: '🪟 Window Seat', 
        value: 'Window seat preferred', 
        action: 'reservation-confirm',
        ariaLabel: 'Request window seat' 
      },
      { 
        id: 'btn-request-quiet', 
        label: '🤫 Quiet Area', 
        value: 'Quiet area preferred', 
        action: 'reservation-confirm',
        ariaLabel: 'Request quiet area' 
      },
      { 
        id: 'btn-request-highchair', 
        label: '👶 High Chair Needed', 
        value: 'High chair for child', 
        action: 'reservation-confirm',
        ariaLabel: 'Request high chair' 
      },
      { 
        id: 'btn-request-dietary', 
        label: '🥗 Dietary Restrictions', 
        value: 'Has dietary restrictions (will specify at restaurant)', 
        action: 'reservation-confirm',
        ariaLabel: 'Mention dietary restrictions' 
      },
      { 
        id: 'btn-request-none', 
        label: '✅ No Special Requests', 
        value: 'none', 
        action: 'reservation-confirm',
        ariaLabel: 'No special requests',
        isPrimary: true
      },
      { 
        id: 'btn-back-contact', 
        label: '⬅️ Back', 
        value: 'back', 
        action: 'reservation-contact-method',
        ariaLabel: 'Go back' 
      },
    ],
    ariaLabel: 'Enter special requests',
  },

  'reservation-confirm': {
    id: 'reservation-confirm',
    message: (userData: UserData) => {
      const date = userData.reservationDate || 'Selected date';
      const time = userData.reservationTime || 'Selected time';
      const people = userData.numberOfPeople || '?';
      const name = userData.customerName || 'Customer';
      const contact = userData.contactInfo || 'Contact info';
      const request = userData.specialRequest === 'none' ? 'None' : userData.specialRequest || 'None';
      
      return `📋 **Please review your reservation:**\n\n` +
             `📅 **Date:** ${date}\n` +
             `🕐 **Time:** ${time}\n` +
             `👥 **Party Size:** ${people} ${people === '1' ? 'person' : 'people'}\n` +
             `👤 **Name:** ${name}\n` +
             `📱 **Contact:** ${contact}\n` +
             `💬 **Special Request:** ${request}\n\n` +
             `**Everything look good?**`;
    },
    buttons: [
      { 
        id: 'btn-confirm-yes', 
        label: '✅ Confirm Reservation', 
        value: 'confirm', 
        action: 'reservation-success',
        ariaLabel: 'Confirm and complete reservation',
        isPrimary: true
      },
      { 
        id: 'btn-confirm-edit', 
        label: '✏️ Edit Details', 
        value: 'edit', 
        action: 'reservation-start',
        ariaLabel: 'Go back to edit reservation details' 
      },
      { 
        id: 'btn-confirm-cancel', 
        label: '❌ Cancel', 
        value: 'cancel', 
        action: 'main',
        ariaLabel: 'Cancel reservation' 
      },
    ],
    ariaLabel: 'Confirm reservation details',
  },

  'reservation-success': {
    id: 'reservation-success',
    message: (userData: UserData) => {
      const date = userData.reservationDate || 'your selected date';
      const time = userData.reservationTime || 'your selected time';
      const people = userData.numberOfPeople || '?';
      const name = userData.customerName || 'Customer';
      const contact = userData.contactInfo || 'N/A';
      const request = userData.specialRequest === 'none' ? 'None' : userData.specialRequest || 'None';
      
      return `🎉 **Reservation Confirmed!**\n\n` +
             `✅ Your table is reserved for:\n\n` +
             `📅 **Date:** ${date}\n` +
             `🕐 **Time:** ${time}\n` +
             `👥 **Party Size:** ${people} ${people === '1' ? 'person' : 'people'}\n` +
             `👤 **Name:** ${name}\n` +
             `📱 **Contact:** ${contact}\n` +
             `💬 **Special Request:** ${request}\n\n` +
             `**🎫 Confirmation Code: #${Math.random().toString(36).substr(2, 9).toUpperCase()}**\n\n` +
             `📋 **QR Code:** [QR code would be displayed here]\n\n` +
             `💡 **Please show this confirmation upon arrival**\n\n` +
             `---\n\n` +
             `🎭 **This is a DEMO** - No actual reservation was made.\n\n` +
             `**In a real system, this reservation would be instantly sent to:**\n` +
             `✅ Restaurant email\n` +
             `✅ Staff Slack/LINE (optional)\n` +
             `✅ Management dashboard (optional)\n\n` +
             `**Want this for your business?** [Contact us](/automation/first-5-clients) for pricing.\n\n` +
             `---\n\n` +
             `**Signal Cafe NYC**\n` +
             `123 Broadway, New York, NY 10012\n` +
             `[(212) 555-0123](tel:2125550123)\n\n` +
             `Can I help you with anything else?`;
    },
    buttons: [
      { 
        id: 'btn-success-new', 
        label: '📅 Make Another Reservation', 
        value: 'new', 
        action: 'reservation-start',
        ariaLabel: 'Make another reservation' 
      },
      { 
        id: 'btn-success-menu', 
        label: '⬅️ Back to Menu', 
        value: 'menu', 
        action: 'main',
        ariaLabel: 'Back to main menu',
        isPrimary: true
      },
    ],
    ariaLabel: 'Reservation confirmed',
  },

  // ============================================
  // Human Escalation
  // ============================================
  escalation: {
    id: 'escalation',
    message: '👤 **Contact Our Team**\n\nHow would you like to reach us?',
    buttons: [
      {
        id: 'btn-escalation-phone',
        label: '📞 Call Us',
        value: 'phone',
        action: 'escalation-phone',
        ariaLabel: 'Call our staff',
        isPrimary: true
      },
      {
        id: 'btn-escalation-email',
        label: '📧 Email Us',
        value: 'email',
        action: 'escalation-email',
        ariaLabel: 'Email our staff'
      },
      {
        id: 'btn-back-main-esc',
        label: '⬅️ Back to Menu',
        value: 'back',
        action: 'main',
        ariaLabel: 'Back to main menu'
      },
    ],
  },

  'escalation-phone': {
    id: 'escalation-phone',
    message: '📞 **Call Us**\n\n**Phone: (212) 555-0123**\n\n**Hours:**\nMon-Fri: 8:00 AM - 8:00 PM EST\nSat-Sun: 9:00 AM - 7:00 PM EST\n\n*(This is a demo number)*\n\nOur friendly staff is ready to help!',
    buttons: [
      {
        id: 'btn-try-email-esc',
        label: '📧 Email Instead',
        value: 'email',
        action: 'escalation-email',
        ariaLabel: 'Send email instead'
      },
      {
        id: 'btn-back-main-phone-esc',
        label: '⬅️ Back to Menu',
        value: 'back',
        action: 'main',
        ariaLabel: 'Back to main menu'
      },
    ],
  },

  'escalation-email': {
    id: 'escalation-email',
    message: '📧 **Email Us**\n\n**Email: contact@signalcafenyc.demo**\n\nWe typically respond within **2-4 hours** during business hours.\n\n**Business Hours:**\nMon-Fri: 8:00 AM - 8:00 PM EST\nSat-Sun: 9:00 AM - 7:00 PM EST\n\n*(This is a demo email address)*',
    buttons: [
      {
        id: 'btn-try-phone-esc',
        label: '📞 Call Instead',
        value: 'phone',
        action: 'escalation-phone',
        ariaLabel: 'Call instead',
        isPrimary: true
      },
      {
        id: 'btn-back-main-email-esc',
        label: '⬅️ Back to Menu',
        value: 'back',
        action: 'main',
        ariaLabel: 'Back to main menu'
      },
    ],
  },

  // ============================================
  // Menu
  // ============================================
  'menu-list': {
    id: 'menu-list',
    message: '🍽️ **Our Menu**\n\nWhat would you like to see?',
    buttons: [
      {
        id: 'btn-menu-breakfast',
        label: '🌅 Breakfast',
        value: 'breakfast',
        action: 'menu-breakfast',
        ariaLabel: 'View breakfast menu'
      },
      {
        id: 'btn-menu-lunch',
        label: '🥗 Lunch',
        value: 'lunch',
        action: 'menu-lunch',
        ariaLabel: 'View lunch menu'
      },
      {
        id: 'btn-menu-dinner',
        label: '🍝 Dinner',
        value: 'dinner',
        action: 'menu-dinner',
        ariaLabel: 'View dinner menu'
      },
      {
        id: 'btn-menu-drinks',
        label: '☕ Drinks',
        value: 'drinks',
        action: 'menu-drinks',
        ariaLabel: 'View drinks menu'
      },
      {
        id: 'btn-back-main-menu',
        label: '⬅️ Back to Menu',
        value: 'back',
        action: 'main',
        ariaLabel: 'Back to main menu'
      },
    ],
  },

  'menu-breakfast': {
    id: 'menu-breakfast',
    message: '🌅 **Breakfast Menu**\n*Available 8:00 AM - 11:00 AM*\n\n**Classics**\n• Avocado Toast - $12\n• Belgian Waffles - $14\n• Eggs Benedict - $16\n• Pancake Stack - $13\n\n**Healthy Options**\n• Acai Bowl - $11\n• Greek Yogurt Parfait - $9\n• Oatmeal Bowl - $8\n\n**Beverages**\n• Freshly Squeezed OJ - $5\n• Coffee - $4\n\n*(Demo menu - prices in USD)*',
    buttons: [
      {
        id: 'btn-back-menu-list',
        label: '⬅️ Back to Menu Categories',
        value: 'back',
        action: 'menu-list',
        ariaLabel: 'Back to menu categories'
      },
      {
        id: 'btn-reserve-breakfast',
        label: '📅 Make a Reservation',
        value: 'reserve',
        action: 'reservation-start',
        ariaLabel: 'Make a reservation',
        isPrimary: true
      },
    ],
  },

  'menu-lunch': {
    id: 'menu-lunch',
    message: '🥗 **Lunch Menu**\n*Available 11:30 AM - 3:00 PM*\n\n**Sandwiches & Wraps**\n• Club Sandwich - $15\n• Chicken Caesar Wrap - $14\n• Veggie Panini - $13\n\n**Salads**\n• Caesar Salad - $12\n• Greek Salad - $13\n• Cobb Salad - $15\n\n**Mains**\n• Pasta Primavera - $16\n• Grilled Chicken Plate - $17\n• Fish Tacos - $16\n\n*(Demo menu - prices in USD)*',
    buttons: [
      {
        id: 'btn-back-menu-list-2',
        label: '⬅️ Back to Menu Categories',
        value: 'back',
        action: 'menu-list',
        ariaLabel: 'Back to menu categories'
      },
      {
        id: 'btn-reserve-lunch',
        label: '📅 Make a Reservation',
        value: 'reserve',
        action: 'reservation-start',
        ariaLabel: 'Make a reservation',
        isPrimary: true
      },
    ],
  },

  'menu-dinner': {
    id: 'menu-dinner',
    message: '🍝 **Dinner Menu**\n*Available 5:00 PM - 8:00 PM*\n\n**Appetizers**\n• Bruschetta - $12\n• Calamari - $14\n• Caprese Salad - $13\n\n**Mains**\n• Grilled Salmon - $26\n• Ribeye Steak - $32\n• Mushroom Risotto - $22\n• Seafood Pasta - $28\n\n**Desserts**\n• Tiramisu - $9\n• Chocolate Lava Cake - $10\n• Cheesecake - $9\n\n*(Demo menu - prices in USD)*',
    buttons: [
      {
        id: 'btn-back-menu-list-3',
        label: '⬅️ Back to Menu Categories',
        value: 'back',
        action: 'menu-list',
        ariaLabel: 'Back to menu categories'
      },
      {
        id: 'btn-reserve-dinner',
        label: '📅 Make a Reservation',
        value: 'reserve',
        action: 'reservation-start',
        ariaLabel: 'Make a reservation',
        isPrimary: true
      },
    ],
  },

  'menu-drinks': {
    id: 'menu-drinks',
    message: '☕ **Drinks Menu**\n\n**Coffee**\n• Espresso - $4\n• Cappuccino - $5\n• Latte - $5.50\n• Americano - $4.50\n\n**Tea**\n• English Breakfast - $3.50\n• Earl Grey - $3.50\n• Green Tea - $3.50\n\n**Specialty**\n• Iced Coffee - $5\n• Matcha Latte - $6\n• Chai Latte - $5.50\n\n**Fresh Juices**\n• Orange Juice - $5\n• Apple Juice - $5\n• Mixed Berry Smoothie - $7\n\n*(Demo menu - prices in USD)*',
    buttons: [
      {
        id: 'btn-back-menu-list-4',
        label: '⬅️ Back to Menu Categories',
        value: 'back',
        action: 'menu-list',
        ariaLabel: 'Back to menu categories'
      },
      {
        id: 'btn-reserve-drinks',
        label: '📅 Make a Reservation',
        value: 'reserve',
        action: 'reservation-start',
        ariaLabel: 'Make a reservation',
        isPrimary: true
      },
    ],
  },

  // ============================================
  // Hours & Location
  // ============================================
  'hours-info': {
    id: 'hours-info',
    message: () => {
      const todayHours = getTodayHoursMessage();
      return `🕐 **Hours & Location**\n\n**Signal Cafe NYC**\n123 Broadway\nNew York, NY 10012\n\n📞 Phone: (212) 555-0123\n📧 Email: contact@signalcafenyc.demo\n\n${todayHours}\n\n**Regular Hours:**\nMonday - Friday: 8:00 AM - 8:00 PM\nSaturday - Sunday: 9:00 AM - 7:00 PM\n\n🚇 **Nearest Subway:**\nCanal St Station (N, Q, R, W, 6)\n\n*(This is a demo location)*`;
    },
    buttons: [
      {
        id: 'btn-hours-reserve',
        label: '📅 Make a Reservation',
        value: 'reserve',
        action: 'reservation-start',
        ariaLabel: 'Make a reservation',
        isPrimary: true
      },
      {
        id: 'btn-back-main-hours',
        label: '⬅️ Back to Menu',
        value: 'back',
        action: 'main',
        ariaLabel: 'Back to main menu'
      },
    ],
  },

  // ============================================
  // FAQ
  // ============================================
  'faq-menu': {
    id: 'faq-menu',
    message: '❓ **Frequently Asked Questions**\n\nWhat would you like to know?',
    buttons: [
      {
        id: 'btn-faq-parking',
        label: '🅿️ Parking',
        value: 'parking',
        action: 'faq-parking',
        ariaLabel: 'Parking information'
      },
      {
        id: 'btn-faq-wifi',
        label: '📶 WiFi',
        value: 'wifi',
        action: 'faq-wifi',
        ariaLabel: 'WiFi information'
      },
      {
        id: 'btn-faq-dietary',
        label: '🥗 Dietary Options',
        value: 'dietary',
        action: 'faq-dietary',
        ariaLabel: 'Dietary options'
      },
      {
        id: 'btn-faq-cancellation',
        label: '❌ Cancellation Policy',
        value: 'cancellation',
        action: 'faq-cancellation',
        ariaLabel: 'Cancellation policy'
      },
      {
        id: 'btn-back-main-faq',
        label: '⬅️ Back to Menu',
        value: 'back',
        action: 'main',
        ariaLabel: 'Back to main menu'
      },
    ],
  },

  'faq-parking': {
    id: 'faq-parking',
    message: '🅿️ **Parking Information**\n\nWe have a partnership with the Broadway Parking Garage, located 2 blocks away at 125 Broadway.\n\n**Rates:**\n• 2 hours: $15\n• 4 hours: $25\n• Full day: $35\n\nShow your reservation confirmation for a 10% discount!\n\n**Street Parking:**\nLimited metered parking available on Broadway and nearby streets.',
    buttons: [
      {
        id: 'btn-back-faq',
        label: '⬅️ Back to FAQ',
        value: 'back',
        action: 'faq-menu',
        ariaLabel: 'Back to FAQ menu'
      },
    ],
  },

  'faq-wifi': {
    id: 'faq-wifi',
    message: '📶 **WiFi Information**\n\nFree WiFi is available for all guests!\n\n**Network:** SignalCafe_Guest\n**Password:** coffee2024\n\n*(Demo credentials)*\n\nPlease be considerate of other guests during peak hours.',
    buttons: [
      {
        id: 'btn-back-faq-2',
        label: '⬅️ Back to FAQ',
        value: 'back',
        action: 'faq-menu',
        ariaLabel: 'Back to FAQ menu'
      },
    ],
  },

  'faq-dietary': {
    id: 'faq-dietary',
    message: '🥗 **Dietary Options**\n\nWe cater to various dietary needs:\n\n✅ **Vegetarian** - Extensive options\n✅ **Vegan** - Multiple dishes available\n✅ **Gluten-Free** - On request\n✅ **Dairy-Free** - Alternative milk options\n✅ **Nut-Free** - Please inform staff\n\nOur staff is trained to handle allergy concerns. Please notify us when ordering.',
    buttons: [
      {
        id: 'btn-back-faq-3',
        label: '⬅️ Back to FAQ',
        value: 'back',
        action: 'faq-menu',
        ariaLabel: 'Back to FAQ menu'
      },
    ],
  },

  'faq-cancellation': {
    id: 'faq-cancellation',
    message: '❌ **Cancellation Policy**\n\nWe understand plans change!\n\n**Cancellation:**\n• Free cancellation up to 2 hours before reservation\n• Please call us: (212) 555-0123\n• Or reply to your confirmation email\n\n**No-Show:**\n• We hold tables for 15 minutes past reservation time\n• After that, the table may be released\n\n**Late Arrival:**\n• Please call if running late - we\'ll do our best to accommodate!',
    buttons: [
      {
        id: 'btn-back-faq-4',
        label: '⬅️ Back to FAQ',
        value: 'back',
        action: 'faq-menu',
        ariaLabel: 'Back to FAQ menu'
      },
    ],
  },

  // ============================================
  // Fallback
  // ============================================
  fallback: {
    id: 'fallback',
    message: '🤔 I didn\'t quite catch that.\n\nLet\'s try something else!',
    buttons: [
      {
        id: 'btn-fallback-main',
        label: '⬅️ Back to Menu',
        value: 'main',
        action: 'main',
        ariaLabel: 'Back to main menu',
        isPrimary: true
      },
    ],
  },
};
};