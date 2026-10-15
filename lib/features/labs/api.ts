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

export const injectPowerApi = async (labId: string, blockchainId: string, hashAmount: number, currentLife: number) => {
  const response = await api.put(`/labs/${labId}/inject-hash`, {
    blockchainId,
    hashAmount,
    currentLife
  });
  return response.data;
};

export const createLabApi = async (payload: { slotsCapacity?: number; userId?: string } = {}) => {
  const response = await api.post('/labs/create', payload);
  return response.data;
};

export const repairEquipmentApi = async (labId: string, blockchainId: string, blocksToRepair: number) => {
  const response = await api.post(`/labs/${labId}/repair`, {
    blockchainId,
    blocksToRepair
  });
  return response.data;
};

export const getRepairQuoteApi = async (labId: string, blockchainId: string) => {
  const response = await api.get(`/labs/${labId}/repair-quote?blockchainId=${blockchainId}`);
  return response.data;
};

