import React, { createContext, useContext, useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { ApiContextType,ApiProviderProps,ApiState } from '../extras';

const ApiContext = createContext<ApiContextType>({} as ApiContextType);

export const ApiProvider = ({ children, apiConfig }: ApiProviderProps) => {
  const [states, setStates] = useState<{ [key: string]: ApiState }>({});
 
  useEffect(() => {
    apiConfig.forEach(({ name }:{name:string}) => {
      setStates(prevState => ({
        ...prevState,
        [name]: { data: null, error: null, loading: false }
      }));
    });
  }, [apiConfig]);
  

  const callApi = async <T,>(name: string, method: string, path: string, data?: any) => {
    setStates(prev => ({ ...prev, [name]: { data: null, error: null, loading: true } }));

    try {
      let response: AxiosResponse<T>;
      switch (method) {
        case 'GET':
          response = await axios.get<T>(path, { params: data });
          break;
        case 'POST':
          response = await axios.post<T>(path, data);
          break;
        case 'PUT':
          response = await axios.put<T>(path, data);
          break;
        case 'DELETE':
          response = await axios.delete<T>(path, { params: data });
          break;
        case 'PATCH':
          response = await axios.patch<T>(path, data);
          break;
        default:
          throw new Error('Unsupported method');
      }
      setStates(prev => ({ ...prev, [name]: { data: response.data, error: null, loading: false } }));
    } catch (error: any) {
      const errorMessage = error.response ?
        `${error.response.status}: ${error.response.data}` :
        error.message;
      setStates(prev => ({
        ...prev,
        [name]: {
          data: null,
          error: { message: errorMessage, ...error },
          loading: false
        }
      }));
    }
  };


    const apiCallFunctions = apiConfig.reduce((acc, api) => {
      acc[api.name] = <T,>(data?: any) => callApi<T>(api.name, api.method, api.path, data);
      return acc;
    }, {} as { [key: string]: () => Promise<void> } );

    const contextValue = {apiCallFunctions, states}


  return <ApiContext.Provider value={contextValue}>
    {children}
  </ApiContext.Provider>;
};

export const useApi = () => useContext(ApiContext);


