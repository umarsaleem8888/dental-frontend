import api from './axios';

export const apiGet = async <T>(
  url: string,
  params?: any
): Promise<any> => {
  try {
    const res = await api.get(url, { params });
    console.log(" res in get", res);
    
    return res;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || 'GET request failed'
    );
  }
};

export const apiPost = async (
  url: string,
  data: any
): Promise<any> => {
  try {
    console.log('url : ',url);
    const res = await api.post<any>(url, data);
    
    const Data = res
    
    console.log(Data,'res into end point');

    return Data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || 'POST request failed'
    );
  }
};

export const apiPut = async (
  url: string,
  data: any
): Promise<any> => {
  try {
    const res = await api.put<any>(url, data);
    return res;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || 'PUT request failed'
    );
  }
};

export const apiDelete = async (
  url: string
): Promise<any> => {
  try {
    const res = await api.delete<any>(url);
    return res
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || 'DELETE request failed'
    );
  }
};
