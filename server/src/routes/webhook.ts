import { Router } from 'express';
import { fetchLeadDetails } from '../services/metaApi';
import { broadcastLead } from '../services/socket';
import { Lead } from '../types';
import { LeadModel } from '../models/Lead';

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
              name: details.name || 'New Lead',
              email: details.email || 'N/A',
              phone: details.phone || 'N/A',
              formId: value.form_id || '',
              adId: value.ad_id || '',
              pageId: value.page_id || '',
            };

            try {
              await LeadModel.findOneAndUpdate(
                { id: lead.id },
                lead,
                { upsert: true, new: true }
              );
            } catch (dbError) {
              console.error('Error saving to MongoDB:', dbError);
            }

            broadcastLead(lead);
          } catch (err) {
            console.error('Error processing lead:', err);
            // Broadcast anyway with available data
            const fallbackLead: Lead = {
              id: leadgenId,
              timestamp: Date.now(),
              name: 'New Lead',
              email: 'N/A',
              phone: 'N/A',
              formId: value.form_id || '',
              adId: value.ad_id || '',
              pageId: value.page_id || '',
            };
            broadcastLead(fallbackLead);
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

    LeadModel.findOneAndUpdate(
      { id: lead.id },
      lead,
      { upsert: true, new: true }
    ).catch(err => console.error('DB Insert Error:', err));

    broadcastLead(lead);
    res.json({ success: true, lead });
  });
}

export default router;
