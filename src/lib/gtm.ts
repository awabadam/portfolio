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

// Push to dataLayer
export const pushToDataLayer = (data: any) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data);
  }
};

// Track page views
export const trackPageView = (url: string) => {
  pushToDataLayer({
    event: 'page_view',
    page_location: url,
    page_title: document.title,
  });
};

// Track custom events
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  pushToDataLayer({
    event: eventName,
    ...parameters,
  });
};

// Track form submissions
export const trackFormSubmission = (formName: string, formType: string) => {
  trackEvent('form_submit', {
    form_name: formName,
    form_type: formType,
  });
};

// Track button clicks
export const trackButtonClick = (buttonName: string, buttonLocation: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
    button_location: buttonLocation,
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