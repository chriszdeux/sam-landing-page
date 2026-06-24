import api from '../../api';

export const getLabApi = async (labId: string) => {
  const response = await api.get(`/labs/${labId}`);
  // Handle different response formats observed in components
  return response.data.laboratory || response.data;
};

export const updateLabStatusApi = async (labId: string, status: 'ACTIVE' | 'INACTIVE') => {
  const response = await api.put(`/labs/${labId}/status`, { status });
  return response.data;
};

export const injectPowerApi = async (labId: string, blockchainId: string, hashAmount: number) => {
  const response = await api.put(`/labs/${labId}/inject-hash`, {
    blockchainId,
    hashAmount
  });
  return response.data;
};

export const createLabApi = async (payload: { slotsCapacity?: number; userId?: string } = {}) => {
  const response = await api.post('/labs/create', payload);
  return response.data;
};
