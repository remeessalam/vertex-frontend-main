import { useQuery } from '@tanstack/react-query';
import { AuthApi } from '@/lib/api';
import { getToken, getUserInfo, setUserInfo } from '@/lib/auth';

// Query key factory
const authKeys = {
  profile: ['auth', 'profile'],
};

// Get user profile
export const useProfileQuery = () => {
  return useQuery({
    queryKey: authKeys.profile,
    queryFn: async () => {
      const token = getToken();
      
      // If no token, don't fetch
      if (!token) {
        return null;
      }
      
      // First try to get user info from localStorage
      const userInfo = getUserInfo();
      
      if (userInfo && userInfo.id && userInfo.name && userInfo.email) {
        return userInfo;
      }
      
      // If we can't get complete user info from storage, fetch from API
      const response = await AuthApi.getProfile();
      
      // Check for success status
      if (response.data.success === false) {
        throw new Error(response.data.message || "Failed to fetch user profile");
      }
      
      // Extract user data, handling the case where it might be in a nested property
      const userData = response.data.user || response.data;
      
      if (userData && userData._id) {
        const userObj = {
          id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
        };
        
        // Save the user info to localStorage for future use
        setUserInfo(userObj);
        return userObj;
      }
      
      throw new Error("Invalid user data from API");
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};