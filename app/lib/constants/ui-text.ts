// app/lib/constants/ui-text.ts

/**
 * Global UI Text Constants
 * Simple English (5th-6th grade level)
 * Used across all tools for consistency
 */

export const UI_TEXT = {
  // Common Buttons
  BUTTON: {
    DOWNLOAD: 'Download',
    COPY: 'Copy',
    COPIED: 'Copied!',
    GENERATE: 'Generate',
    UPLOAD: 'Upload',
    CLEAR: 'Clear',
    RESET: 'Reset',
    CANCEL: 'Cancel',
    SUBMIT: 'Submit',
    PREVIEW: 'Preview',
    SAVE: 'Save',
    DELETE: 'Delete',
    EDIT: 'Edit',
    CLOSE: 'Close',
  },
  
  // Status Messages
  STATUS: {
    LOADING: 'Loading...',
    PROCESSING: 'Processing...',
    GENERATING: 'Generating...',
    UPLOADING: 'Uploading...',
    DOWNLOADING: 'Downloading...',
    SUCCESS: 'Success!',
    ERROR: 'Error',
    READY: 'Ready',
    DONE: 'Done',
  },
  
  // Common Messages
  MESSAGE: {
    NO_FILE_SELECTED: 'No file selected',
    FILE_TOO_LARGE: 'File is too large',
    INVALID_FILE: 'Invalid file type',
    SOMETHING_WENT_WRONG: 'Something went wrong',
    TRY_AGAIN: 'Please try again',
    DROP_FILE_HERE: 'Drop file here',
    OR_CLICK_TO_SELECT: 'or click to select',
  },
} as const

export type UITextKey = keyof typeof UI_TEXT