declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// GA4 Configuration
export const GA4_TRACKING_ID = 'G-EL4WEH4X3X';

// Initialize GA4
export const initGA4 = () => {
  if (typeof window !== 'undefined') {
    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.gtag = window.gtag || function() {
      (window.gtag as any).q = (window.gtag as any).q || [];
      (window.gtag as any).q.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA4_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA4_TRACKING_ID, {
      page_path: url,
      page_title: title || document.title,
      page_location: window.location.href,
    });
  }
};

// Track custom events
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      page_location: window.location.href,
      page_path: window.location.pathname,
      page_title: document.title,
    });
  }
};

// Track button clicks
export const trackButtonClick = (buttonName: string, buttonLocation: string, buttonType?: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
    button_location: buttonLocation,
    button_type: buttonType || 'general',
  });
};

// Track form submissions
export const trackFormSubmission = (formName: string, formType: string) => {
  trackEvent('form_submit', {
    form_name: formName,
    form_type: formType,
  });
};

// Track CTA clicks
export const trackCTAClick = (ctaType: string, location: string) => {
  trackEvent('cta_click', {
    cta_type: ctaType,
    location: location,
  });
};

// Track navigation clicks
export const trackNavigationClick = (navItem: string, location: string) => {
  trackEvent('navigation_click', {
    nav_item: navItem,
    location: location,
  });
};

// Track social media clicks
export const trackSocialClick = (platform: string, location: string) => {
  trackEvent('social_click', {
    platform: platform,
    location: location,
  });
};

// Track contact clicks
export const trackContactClick = (contactMethod: string, location: string) => {
  trackEvent('contact_click', {
    contact_method: contactMethod,
    location: location,
  });
};

// Track service clicks
export const trackServiceClick = (serviceName: string, location: string) => {
  trackEvent('service_click', {
    service_name: serviceName,
    location: location,
  });
};

// Track project clicks
export const trackProjectClick = (projectTitle: string, location: string) => {
  trackEvent('project_click', {
    project_title: projectTitle,
    location: location,
  });
};

// Track contact actions
export const trackContactAction = (actionType: string, method: string) => {
  trackEvent('contact_action', {
    action_type: actionType,
    contact_method: method,
  });
};

// Track project views
export const trackProjectView = (projectId: string, projectTitle: string) => {
  trackEvent('project_view', {
    project_id: projectId,
    project_title: projectTitle,
  });
};

// Track service interest
export const trackServiceInterest = (serviceName: string) => {
  trackEvent('service_interest', {
    service_name: serviceName,
  });
};

// Track lead generation
export const trackLeadGeneration = (source: string, formType: string) => {
  trackEvent('lead_generation', {
    lead_source: source,
    form_type: formType,
  });
};

// Enhanced tracking functions
export const trackScrollDepth = (depth: number) => {
  trackEvent('scroll_depth', {
    scroll_percentage: depth,
  });
};

export const trackTimeOnPage = (seconds: number) => {
  trackEvent('time_on_page', {
    time_seconds: seconds,
  });
};

export const trackFileDownload = (fileName: string, fileType: string) => {
  trackEvent('file_download', {
    file_name: fileName,
    file_type: fileType,
  });
};

export const trackExternalLink = (url: string, linkText: string) => {
  trackEvent('external_link_click', {
    external_url: url,
    link_text: linkText,
  });
};

// GA4 Enhanced Ecommerce tracking
export const trackAddToCart = (itemId: string, itemName: string, value: number) => {
  trackEvent('add_to_cart', {
    currency: 'USD',
    value: value,
    items: [{
      item_id: itemId,
      item_name: itemName,
      price: value,
      quantity: 1
    }]
  });
};

export const trackPurchase = (transactionId: string, value: number, items: any[]) => {
  trackEvent('purchase', {
    transaction_id: transactionId,
    value: value,
    currency: 'USD',
    items: items
  });
}; 