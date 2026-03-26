// Unified Analytics Utility - Combines GTM and GA4 tracking

import {
  trackEvent as gtmTrackEvent,
  trackPageView as gtmTrackPageView,
  trackButtonClick as gtmTrackButtonClick,
  trackFormSubmission as gtmTrackFormSubmission,
  trackCTAClick as gtmTrackCTAClick,
  trackNavigationClick as gtmTrackNavigationClick,
  trackSocialClick as gtmTrackSocialClick,
  trackContactClick as gtmTrackContactClick,
  trackServiceClick as gtmTrackServiceClick,
  trackProjectClick as gtmTrackProjectClick,
  trackContactAction as gtmTrackContactAction,
  trackProjectView as gtmTrackProjectView,
  trackServiceInterest as gtmTrackServiceInterest,
  trackLeadGeneration as gtmTrackLeadGeneration,
} from './gtm';

import {
  trackEvent as ga4TrackEvent,
  trackPageView as ga4TrackPageView,
  trackButtonClick as ga4TrackButtonClick,
  trackFormSubmission as ga4TrackFormSubmission,
  trackCTAClick as ga4TrackCTAClick,
  trackNavigationClick as ga4TrackNavigationClick,
  trackSocialClick as ga4TrackSocialClick,
  trackContactClick as ga4TrackContactClick,
  trackServiceClick as ga4TrackServiceClick,
  trackProjectClick as ga4TrackProjectClick,
  trackContactAction as ga4TrackContactAction,
  trackProjectView as ga4TrackProjectView,
  trackServiceInterest as ga4TrackServiceInterest,
  trackLeadGeneration as ga4TrackLeadGeneration,
} from './ga4';

// Unified tracking functions that send to both GTM and GA4
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  // Send to GTM
  gtmTrackEvent(eventName, parameters);
  // Send to GA4
  ga4TrackEvent(eventName, parameters);
};

export const trackPageView = (url?: string) => {
  // Send to GTM
  gtmTrackPageView(url);
  // Send to GA4
  ga4TrackPageView(url || window.location.pathname);
};

export const trackButtonClick = (buttonName: string, buttonLocation: string, buttonType?: string) => {
  // Send to GTM
  gtmTrackButtonClick(buttonName, buttonLocation, buttonType);
  // Send to GA4
  ga4TrackButtonClick(buttonName, buttonLocation, buttonType);
};

export const trackFormSubmission = (formName: string, formType: string) => {
  // Send to GTM
  gtmTrackFormSubmission(formName, formType);
  // Send to GA4
  ga4TrackFormSubmission(formName, formType);
};

export const trackCTAClick = (ctaType: string, location: string) => {
  // Send to GTM
  gtmTrackCTAClick(ctaType, location);
  // Send to GA4
  ga4TrackCTAClick(ctaType, location);
};

export const trackNavigationClick = (navItem: string, location: string) => {
  // Send to GTM
  gtmTrackNavigationClick(navItem, location);
  // Send to GA4
  ga4TrackNavigationClick(navItem, location);
};

export const trackSocialClick = (platform: string, location: string) => {
  // Send to GTM
  gtmTrackSocialClick(platform, location);
  // Send to GA4
  ga4TrackSocialClick(platform, location);
};

export const trackContactClick = (contactMethod: string, location: string) => {
  // Send to GTM
  gtmTrackContactClick(contactMethod, location);
  // Send to GA4
  ga4TrackContactClick(contactMethod, location);
};

export const trackServiceClick = (serviceName: string, location: string) => {
  // Send to GTM
  gtmTrackServiceClick(serviceName, location);
  // Send to GA4
  ga4TrackServiceClick(serviceName, location);
};

export const trackProjectClick = (projectTitle: string, location: string) => {
  // Send to GTM
  gtmTrackProjectClick(projectTitle, location);
  // Send to GA4
  ga4TrackProjectClick(projectTitle, location);
};

export const trackContactAction = (actionType: string, method: string) => {
  // Send to GTM
  gtmTrackContactAction(actionType, method);
  // Send to GA4
  ga4TrackContactAction(actionType, method);
};

export const trackProjectView = (projectId: string, projectTitle: string) => {
  // Send to GTM
  gtmTrackProjectView(projectId, projectTitle);
  // Send to GA4
  ga4TrackProjectView(projectId, projectTitle);
};

export const trackServiceInterest = (serviceName: string) => {
  // Send to GTM
  gtmTrackServiceInterest(serviceName);
  // Send to GA4
  ga4TrackServiceInterest(serviceName);
};

export const trackLeadGeneration = (source: string, formType: string) => {
  // Send to GTM
  gtmTrackLeadGeneration(source, formType);
  // Send to GA4
  ga4TrackLeadGeneration(source, formType);
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