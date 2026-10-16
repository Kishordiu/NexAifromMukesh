const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(method, path, body = null) {
  const token = localStorage.getItem('nexai_token');
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, options);
    
    if (response.status === 401) {
      localStorage.removeItem('nexai_token');
      window.location.href = '/login';
      const error = new Error('Unauthorized');
      error.status = 401;
      throw error;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error(data?.message || 'API request failed');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (!error.status) {
      error.status = 500;
      error.message = error.message || 'Network error';
    }
    throw error;
  }
}

export const api = {
  auth: {
    login: (email, password) => request('POST', '/auth/login', { email, password }),
    register: (email, password) => request('POST', '/auth/register', { email, password }),
    me: () => request('GET', '/auth/me'),
  },
  patient: {
    getProfile: () => request('GET', '/patient/profile'),
    saveProfile: (data) => request('POST', '/patient/profile', data),
    getMeasurements: () => request('GET', '/patient/measurements'),
    getLatestMeasurements: () => request('GET', '/patient/measurements/latest'),
    saveMeasurement: (data) => request('POST', '/patient/measurements', data),
    getLabReports: () => request('GET', '/patient/lab-reports'),
    saveLabReport: (data) => request('POST', '/patient/lab-reports', data),
  },
  triage: {
    submit: (text, language) => request('POST', '/triage', { text, language }),
  },
  risk: {
    assess: () => request('POST', '/risk/assess'),
  },
  reports: {
    list: () => request('GET', '/reports'),
    generate: () => request('POST', '/reports/generate'),
    get: (id) => request('GET', `/reports/${id}`),
    verify: (verificationId) => request('POST', '/reports/verify', { verificationId }),
  },
  clinician: {
    getPatients: () => request('GET', '/clinician/patients'),
    verifyReport: (id) => request('POST', `/clinician/verify-report/${id}`),
  }
};
