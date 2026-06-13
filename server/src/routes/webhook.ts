import { Router } from 'express';
import { fetchLeadDetails } from '../services/metaApi';
import { broadcastLead } from '../services/socket';
import { Lead } from '../types';

const router = Router();

router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

router.post('/', async (req, res) => {
  // Always respond 200 immediately
  res.sendStatus(200);

  const body = req.body;

  if (body.object === 'page') {
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value;
        const leadgenId = value.leadgen_id;

        if (leadgenId) {
          console.log(`[${new Date().toISOString()}] New lead received: ${leadgenId}`);
          
          try {
            const details = await fetchLeadDetails(leadgenId);
            
            const lead: Lead = {
              id: leadgenId,
              timestamp: Date.now(),
              name: details.name || 'Unknown',
              email: details.email || 'Unknown',
              phone: details.phone || 'Unknown',
              formId: value.form_id || details.formId || '',
              adId: value.ad_id || details.adId || '',
              pageId: value.page_id || details.pageId || '',
            };

            broadcastLead(lead);
          } catch (err) {
            console.error('Error processing lead:', err);
          }
        }
      }
    }
  }
});

if (process.env.NODE_ENV !== 'production') {
  router.post('/test-lead', (req, res) => {
    const { name, email, phone } = req.body;
    
    const lead: Lead = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      name: name || 'Test User',
      email: email || 'test@example.com',
      phone: phone || '1234567890',
      formId: 'test_form',
      adId: 'test_ad',
      pageId: 'test_page',
    };

    broadcastLead(lead);
    res.json({ success: true, lead });
  });
}

export default router;
