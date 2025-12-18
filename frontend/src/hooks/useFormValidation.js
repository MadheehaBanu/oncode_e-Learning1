import { useState, useEffect, useCallback } from 'react';
import sessionService from '../services/sessionService';
import cookieService from '../services/cookieService';

export const useFormValidation = (formName, initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved form data on mount
  useEffect(() => {
    const savedData = sessionService.getFormValidation(formName);
    const cookieData = cookieService.getFormData(formName);
    
    if (savedData) {
      setValues(prev => ({ ...prev, ...savedData.values }));
      setTouched(prev => ({ ...prev, ...savedData.touched }));
    } else if (cookieData) {
      setValues(prev => ({ ...prev, ...cookieData.values }));
      setTouched(prev => ({ ...prev, ...cookieData.touched }));
    }
  }, [formName]);

  // Save form data to session and cookies
  const saveFormData = useCallback(() => {
    const formData = { values, touched, timestamp: Date.now() };
    sessionService.setFormValidation(formName, formData);
    cookieService.setFormData(formName, formData);
  }, [formName, values, touched]);

  // Auto-save form data when values change
  useEffect(() => {
    if (Object.keys(values).length > 0) {
      const timeoutId = setTimeout(saveFormData, 1000); // Debounce save
      return () => clearTimeout(timeoutId);
    }
  }, [values, saveFormData]);

  // Validate single field
  const validateField = useCallback((name, value) => {
    const rule = validationRules[name];
    if (!rule) return '';

    if (rule.required && (!value || value.toString().trim() === '')) {
      return rule.message || `${name} is required`;
    }

    if (rule.minLength && value.length < rule.minLength) {
      return rule.message || `${name} must be at least ${rule.minLength} characters`;
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return rule.message || `${name} must be no more than ${rule.maxLength} characters`;
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || `${name} format is invalid`;
    }

    if (rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return rule.message || 'Please enter a valid email address';
    }

    if (rule.custom && typeof rule.custom === 'function') {
      return rule.custom(value, values) || '';
    }

    return '';
  }, [validationRules, values]);

  // Handle input change
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Validate field if it's been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [errors, touched, validateField]);

  // Handle input blur
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [values, validateField]);

  // Handle form submit
  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(validationRules).forEach(name => {
      allTouched[name] = true;
    });
    setTouched(allTouched);

    const isValid = Object.keys(validationRules).every(name => {
      const error = validateField(name, values[name]);
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }));
        return false;
      }
      return true;
    });
    
    if (isValid) {
      try {
        await onSubmit(values);
        // Clear form data on successful submit
        clearFormData();
      } catch (error) {
        console.error('Form submission error:', error);
        throw error;
      }
    }
    
    setIsSubmitting(false);
    return isValid;
  }, [values, validationRules, validateField]);

  // Clear form data
  const clearFormData = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    sessionService.removeFormValidation(formName);
    cookieService.removeFormData(formName);
  }, [formName, initialValues]);

  // Get field props for easy integration
  const getFieldProps = useCallback((name) => ({
    value: values[name] || '',
    onChange: (e) => handleChange(name, e.target.value),
    onBlur: () => handleBlur(name),
    error: touched[name] && errors[name],
    hasError: touched[name] && !!errors[name]
  }), [values, errors, touched, handleChange, handleBlur]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    clearFormData,
    getFieldProps,
    isValid: Object.keys(errors).length === 0 && Object.keys(touched).length > 0
  };
};