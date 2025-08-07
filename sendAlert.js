const axios = require('axios');

const webhookUrl = 'https://homecareforyou.webhook.office.com/webhookb2/58b982f5-c16a-4baf-b826-389b14a32221@305c0c1c-18a3-4327-a372-a1f36bf12b21/IncomingWebhook/806e69cedbcd458bae435835de802861/fb074111-7e90-437d-8ea8-16253f0f0633/V2oBMs9J_fHEudvB0tTI7pQxSKWzT96LnR4FgPz20139E1';

const sendAlertToTeams = async (message) => {
  try {
    let color = 'FF0000'
    const mode = process.env.MODE?.toLowerCase(); // safely handle undefined
    let title = '🚨 Mannkaa UAT Error';

    if (mode === 'prod') {
      title = '🚨 Mannkaa Live Error';
    }

    const payload = {
      "@type": "MessageCard",
      "@context": "https://schema.org/extensions",
      summary: title,
      themeColor: color,
      title: title,
      text: message,
    };

    // const webhookUrl =webhookUrl;
    if (!webhookUrl) {
      throw new Error('Missing TEAMS_WEBHOOK_URL in environment variables');
    }

    await axios.post(webhookUrl, payload);
    console.log('✅ Rich alert sent to Teams');
  } catch (error) {
    console.error('❌ Failed to send Teams alert:', error.message);
  }
};

// Example: send an alert

module.exports = sendAlertToTeams