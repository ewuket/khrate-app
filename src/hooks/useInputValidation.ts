
import { useState } from 'react';

export const useInputValidation = () => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateEmail = async (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      return { isValid: false, error: 'Email is required' };
    }
    
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    
    if (email.length > 100) {
      return { isValid: false, error: 'Email is too long' };
    }
    
    return { isValid: true, error: null };
  };

  const sanitizeTextInput = async (input: string, maxLength: number = 255) => {
    if (!input) return '';
    
    // Trim whitespace
    let sanitized = input.trim();
    
    // Limit length
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }
    
    // Basic XSS protection - remove potentially dangerous characters
    sanitized = sanitized.replace(/[<>'"&]/g, '');
    
    return sanitized;
  };

  const validatePassword = (password: string) => {
    const errors = [];
    
    if (!password) {
      return { isValid: false, errors: ['Password is required'] };
    }
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const validatePhoneNumber = (phone: string) => {
    if (!phone) return { isValid: true, error: null }; // Phone is optional
    
    // Remove all non-numeric characters except +
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    // Basic phone validation (allowing international formats)
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return { isValid: false, error: 'Please enter a valid phone number' };
    }
    
    return { isValid: true, error: null };
  };

  const setFieldError = (field: string, error: string) => {
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const clearFieldError = (field: string) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setValidationErrors({});
  };

  return {
    validationErrors,
    validateEmail,
    sanitizeTextInput,
    validatePassword,
    validatePhoneNumber,
    setFieldError,
    clearFieldError,
    clearAllErrors
  };
};
