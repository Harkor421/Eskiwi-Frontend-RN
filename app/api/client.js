import { create } from 'apisauce';
import authStorage from '../auth/storage';
import { API_BASE_URL } from '../config/constants';

const apiClient = create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request transform to include the Authorization header
apiClient.addAsyncRequestTransform(async (request) => {
  try {
    const authToken = await authStorage.getToken();
    if (authToken) {request.headers["Authorization"] = "Bearer " + authToken;
    }
  } catch (error) {
    console.error("Error adding Authorization header:", error);
  }
});

export default apiClient;
