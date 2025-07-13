export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://autograde-server.koyeb.app',
  },
} as const; 