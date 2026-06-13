import { Lead } from '../types';

export async function fetchLeadDetails(leadgenId: string): Promise<Partial<Lead>> {
  try {
    const accessToken = process.env.META_PAGE_ACCESS_TOKEN;
    if (!accessToken) {
      console.error('[Meta API] Missing META_PAGE_ACCESS_TOKEN');
      return {};
    }

    const url = `https://graph.facebook.com/v19.0/${leadgenId}?fields=field_data,created_time,form_id,ad_id,page_id&access_token=${accessToken}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`[Meta API] Error fetching lead: ${response.statusText}`);
      return {};
    }

    const data = await response.json();
    const fieldData: any[] = data.field_data || [];

    let name = '';
    let email = '';
    let phone = '';

    for (const field of fieldData) {
      const fieldName = field.name.toLowerCase();
      const value = field.values[0] || '';

      if (fieldName.includes('name')) {
        name = value;
      } else if (fieldName.includes('email')) {
        email = value;
      } else if (fieldName.includes('phone')) {
        phone = value;
      }
    }

    return {
      name,
      email,
      phone,
      formId: data.form_id,
      adId: data.ad_id,
      pageId: data.page_id,
    };
  } catch (error) {
    console.error('[Meta API] Fetch error:', error);
    return {};
  }
}
