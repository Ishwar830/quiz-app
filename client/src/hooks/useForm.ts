import { useState } from 'react';

export function useForm<T>(initialFormData: T) {
  const [formData, setFormData] = useState<T>(initialFormData);

  const handleInputChange = (field: keyof T, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  return { formData, handleInputChange };   
}
