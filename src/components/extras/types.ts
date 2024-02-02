export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiConfig {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
}

export interface ApiState {
  data: any;
  error: any;
  loading: boolean;
}

export interface ApiCallFunction {
  (data?: any): Promise<void>;
}


export type ApiContextType = {
  apiCallFunctions: { [key: string]: () => Promise<void> };
  states: { [key: string]: { data: any; error: any; loading: boolean; } };
};

export interface ApiProviderProps {
  children: React.ReactNode;
  apiConfig: ApiConfig[];
}
