
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const useInputValidation = () => {
  const [isValidating, setIsValidating] = useState(false);

  const validateEmail = useCallback(async (email: string): Promise<ValidationResult> => {
    setIsValidating(true);
    
    try {
      // First do client-side basic validation
      if (!email || email.trim() === '') {
        return { isValid: false, error: 'Email is required' };
      }

      // Use the database validation function
      const { data, error } = await supabase.rpc('validate_email_format', { email });
      
      if (error) {
        console.error('Email validation error:', error);
        return { isValid: false, error: 'Email validation failed' };
      }
      
      if (!data) {
        return { isValid: false, error: 'Please enter a valid email address' };
      }
      
      return { isValid: true };
    } catch (error) {
      console.error('Email validation error:', error);
      return { isValid: false, error: 'Email validation failed' };
    } finally {
      setIsValidating(false);
    }
  }, []);

  const validatePhoneNumber = useCallback(async (phone: string): Promise<ValidationResult> => {
    setIsValidating(true);
    
    try {
      if (!phone || phone.trim() === '') {
        return { isValid: false, error: 'Phone number is required' };
      }

      // Use the database validation function
      const { data, error } = await supabase.rpc('validate_phone_number', { phone });
      
      if (error) {
        console.error('Phone validation error:', error);
        return { isValid: false, error: 'Phone validation failed' };
      }
      
      if (!data) {
        return { isValid: false, error: 'Please enter a valid Rwanda phone number' };
      }
      
      return { isValid: true };
    } catch (error) {
      console.error('Phone validation error:', error);
      return { isValid: false, error: 'Phone validation failed' };
    } finally {
      setIsValidating(false);
    }
  }, []);

  const sanitizeTextInput = useCallback(async (text: string, maxLength = 255): Promise<string> => {
    try {
      if (!text) return '';
      
      // Use the database sanitization function
      const { data, error } = await supabase.rpc('sanitize_text_input', { 
        input_text: text, 
        max_length: maxLength 
      });
      
      if (error) {
        console.error('Text sanitization error:', error);
        // Fallback to basic client-side sanitization
        return text.trim().slice(0, maxLength).replace(/[<>"'&]/g, '');
      }
      
      return data || '';
    } catch (error) {
      console.error('Text sanitization error:', error);
      // Fallback to basic client-side sanitization
      return text.trim().slice(0, maxLength).replace(/[<>"'&]/g, '');
    }
  }, []);

  const validateRequired = useCallback((value: string, fieldName: string): ValidationResult => {
    if (!value || value.trim() === '') {
      return { isValid: false, error: `${fieldName} is required` };
    }
    return { isValid: true };
  }, []);

  const validateMinLength = useCallback((value: string, minLength: number, fieldName: string): ValidationResult => {
    if (value.length < minLength) {
      return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
    }
    return { isValid: true };
  }, []);

  return {
    validateEmail,
    validatePhoneNumber,
    sanitizeTextInput,
    validateRequired,
    validateMinLength,
    isValidating
  };
};
