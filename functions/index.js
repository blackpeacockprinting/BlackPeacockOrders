const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();
const db = admin.firestore();

const N3D_API_KEY = 'n3d_sk_N49oAN4-H4bniv08z3-Y7D5UZl_W0DcR';
const N3D_BASE_URL = 'https://www.n3dmelbourne.com/api/v1';

exports.syncN3D = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const designs = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore && page <= 10) {
      const response = await axios.get(`${N3D_BASE_URL}/designs`, {
        headers: { 'Authorization': `Bearer ${N3D_API_KEY}` },
        params: { page: page, limit: 200, include: 'details' }
      });
      
      const pageDesigns = response.data.data || [];
      if (pageDesigns.length === 0) {
        hasMore = false;
      } else {
        designs.push(...pageDesigns);
        page++;
      }
    }
    
    const batch = db.batch();
    
    for (const design of designs) {
      const filamentBreakdown = [];
      if (design.filaments) {
        design.filaments.forEach(f => {
          filamentBreakdown.push({
            color: f.color || 'Unknown',
            grams: f.weight_grams || 0
          });
        });
      }
      
      const docRef = db.collection('n3dDesigns').doc(design.title || design.slug);
      batch.set(docRef, {
        name: design.title || design.slug,
        slug: design.slug,
        totalGrams: design.total_weight_grams || 50,
        filamentBreakdown: filamentBreakdown,
        category: design.category,
        imageUrl: design.image_url,
        source: 'n3d_api',
        lastSynced: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    }
    
    await batch.commit();
    
    await db.collection('syncMetadata').doc('n3d').set({
      lastSync: admin.firestore.FieldValue.serverTimestamp(),
      designsCount: designs.length
    });
    
    res.json({
      success: true,
      designsSynced: designs.length,
      message: 'Sync complete!'
    });
    
  } catch (error) {
    console.error('Sync failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
