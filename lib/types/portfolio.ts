// 1-Definir interfaz del activo del portafolio

//# 1-Definir interfaz del activo del portafolio
export interface Asset {
    id: string;
    name: string;
    value: number;
    color: string;
    quantity: number;
    symbol: string;
}
