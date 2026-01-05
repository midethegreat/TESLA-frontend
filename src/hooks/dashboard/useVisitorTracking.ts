// src/hooks/dashboard/useVisitorTracking.ts
import { useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://tesla-backend-2da8.onrender.com/api';

export const useVisitorTracking = () => {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Visitor tracking disabled
        return;

        // Get location info
        const geoResponse = await fetch('https://ipapi.co/json/');
        const geoData = await geoResponse.json();

        // Send to backend
        await axios.post(`${API_BASE_URL}/admin/track-visitor`, {
          ip: geoData.ip,
          country: geoData.country_name,
          city: geoData.city,
          userAgent: navigator.userAgent,
          referrer: document.referrer || 'Direct'
        });

        sessionStorage.setItem('visitor_tracked', 'true');
      } catch (error) {
        console.error('Visitor tracking failed:', error);
      }
    };

    trackVisitor();
  }, []);
};
