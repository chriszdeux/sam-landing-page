import React from 'react';

/**
 * Honeypot anti-spam field.
 * Invisible to human users, but automated spam bots fill it automatically.
 * On form submission, if this field has a value, discard or reject the submission.
 */
export function HoneypotField({ fieldName = 'ly_website_hp' }: { fieldName?: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        opacity: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        height: 0,
        width: 0,
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      <label htmlFor={fieldName}>No rellenar este campo de seguridad</label>
      <input
        type="text"
        id={fieldName}
        name={fieldName}
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}

/**
 * Helper to validate submission payload on server/client.
 */
export function isSpamSubmission(formData: FormData | Record<string, any>, fieldName = 'ly_website_hp'): boolean {
  if (formData instanceof FormData) {
    const val = formData.get(fieldName);
    return typeof val === 'string' && val.trim().length > 0;
  }
  return typeof formData[fieldName] === 'string' && formData[fieldName].trim().length > 0;
}
