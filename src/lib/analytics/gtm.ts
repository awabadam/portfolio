declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize GTM dataLayer
export const initGTM = () => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
  }
};

// Get current page path
export const getCurrentPath = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.pathname + window.location.search;
  }
  return '/';
};

// Get current page URL
export const getCurrentURL = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.href;
  }
  return '';
};

// Push to dataLayer
export const pushToDataLayer = (data: any) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data);
  }
};

// Track page views (GA4 standard)
export const trackPageView = (url?: string) => {
  const pageLocation = url || getCurrentURL();
  const pagePath = getCurrentPath();
  
  pushToDataLayer({
    event: 'page_view',
    page_location: pageLocation,
    page_path: pagePath,
    page_title: typeof document !== 'undefined' ? document.title : '',
  });
};

// Track custom events with page context (GA4 standard)
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  const pageLocation = getCurrentURL();
  const pagePath = getCurrentPath();
  
  pushToDataLayer({
    event: eventName,
    page_location: pageLocation,
    page_path: pagePath,
    ...parameters,
  });
};

// Track form submissions with page context
export const trackFormSubmission = (formName: string, formType: string) => {
  trackEvent('form_submit', {
    form_name: formName,
    form_type: formType,
  });
};

// Track button clicks with specific types and page context
export const trackButtonClick = (buttonName: string, buttonLocation: string, buttonType?: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
    button_location: buttonLocation,
    button_type: buttonType || 'general',
  });
};

// Track specific button types with page context
export const trackCTAClick = (ctaType: string, location: string) => {
  trackEvent('cta_click', {
    cta_type: ctaType,
    location: location,
  });
};

export const trackNavigationClick = (navItem: string, location: string) => {
  trackEvent('navigation_click', {
    nav_item: navItem,
    location: location,
  });
};

export const trackSocialClick = (platform: string, location: string) => {
  trackEvent('social_click', {
    platform: platform,
    location: location,
  });
};

export const trackContactClick = (contactMethod: string, location: string) => {
  trackEvent('contact_click', {
    contact_method: contactMethod,
    location: location,
  });
};

export const trackServiceClick = (serviceName: string, location: string) => {
  trackEvent('service_click', {
    service_name: serviceName,
    location: location,
  });
};

export const trackProjectClick = (projectTitle: string, location: string) => {
  trackEvent('project_click', {
    project_title: projectTitle,
    location: location,
  });
};

// Track contact actions with page context
export const trackContactAction = (actionType: string, method: string) => {
  trackEvent('contact_action', {
    action_type: actionType,
    contact_method: method,
  });
};

// Track project views with page context
export const trackProjectView = (projectId: string, projectTitle: string) => {
  trackEvent('project_view', {
    project_id: projectId,
    project_title: projectTitle,
  });
};

// Track service interest with page context
export const trackServiceInterest = (serviceName: string) => {
  trackEvent('service_interest', {
    service_name: serviceName,
  });
};

// Track lead generation with page context
export const trackLeadGeneration = (source: string, formType: string) => {
  trackEvent('lead_generation', {
    lead_source: source,
    form_type: formType,
  });
};

// Enhanced tracking functions with additional context
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

// GA4 Enhanced Ecommerce tracking (if needed later)
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