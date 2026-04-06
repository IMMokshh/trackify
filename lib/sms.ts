// SMS sending functionality with retry logic

const MAX_RETRIES = 1;
const RETRY_DELAY_MS = 1500;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function sendSMSOnce(to: string, message: string): Promise<{ success: boolean; error?: string }> {
  const response = await fetch('/api/send-sos-sms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, message }),
  });
  const data = await response.json();
  if (data.success) return { success: true };
  throw new Error(data.error || 'Failed to send SMS');
}

export const sendSOSSMS = async (
  phoneNumber: string,
  senderName: string,
  flatNumber: string,
  location: string,
  message: string
) => {
  const smsMessage = `SOS! ${senderName} Flat ${flatNumber} needs help. ${location ? 'Location: ' + location + '.' : ''} ${message || 'Emergency!'} -Trackify`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await sendSMSOnce(phoneNumber, smsMessage);
      return result;
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`SMS attempt ${attempt} failed:`, error.message);
      }
      if (attempt < MAX_RETRIES) await sleep(RETRY_DELAY_MS * attempt);
      else return { success: false, error: error.message };
    }
  }
  return { success: false, error: 'Max retries exceeded' };
};

// AI-powered emergency text enhancer
export async function enhanceEmergencyText(input: string): Promise<string> {
  try {
    const response = await fetch('/api/aria', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: input }],
        systemPrompt: `You are an emergency message formatter. Convert the user's short emergency description into a clear, formal, structured emergency message in 1-2 sentences. Be concise and action-oriented. Include the nature of the emergency and that immediate assistance is required. Do NOT add any preamble or explanation — output ONLY the formatted emergency message.`,
      }),
    });
    const data = await response.json();
    return data.content || input;
  } catch {
    return input;
  }
}
