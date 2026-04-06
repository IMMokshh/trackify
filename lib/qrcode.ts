import QRCode from 'qrcode';

export async function generateQRCode(data: string): Promise<string> {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return qrCodeDataURL;
  } catch (error) {
    // Log error in development only
    if (process.env.NODE_ENV === 'development') {
      console.error('Error generating QR code:', error);
    }
    throw error;
  }
}

export function generateVisitorQRData(visitor: any): string {
  return JSON.stringify({
    id: visitor.id,
    name: visitor.name,
    phone: visitor.phone,
    host: visitor.host_id,
    date: visitor.visit_date,
    time: new Date().toISOString(),
  });
}
