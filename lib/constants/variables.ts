interface EnvVariables {
  project: string;
  coin1: string;
  coin2: string;
  coin3: string;
  connect: string;
}

export const EnvVariables: EnvVariables = {
  project: process.env.NEXT_PUBLIC_PROJECT_NAME || '',
  coin1: process.env.NEXT_PUBLIC_COIN1 || '',
  coin2: process.env.NEXT_PUBLIC_COIN2 || '',
  coin3: process.env.NEXT_PUBLIC_COIN3 || '',
  connect: process.env.NEXT_PUBLIC_API_URL || '',
}