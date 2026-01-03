// services/auth.service.ts
import API from "./api";
import { auth } from "./firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset
} from "firebase/auth";

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country: string;
  referralId?: string;
}

export interface VerifyEmailData {
  email: string;
  code: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ResetRequestData {
  email: string;
}

export interface ResetConfirmData {
  email: string;
  code: string;
  newPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    referralId: string;
    emailVerified: string;
    profile?: any;
  };
}

let pendingRefreshRequest: Promise<{ token: string; refreshToken: string }> | null = null;

export const authService = {
  register: async (data: RegisterData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      // We still call our backend to sync the user profile and data
      return API.post<AuthResponse>("/auth/register", {
        ...data,
        firebaseUid: userCredential.user.uid
      });
    } catch (error) {
      console.error("Firebase registration error:", error);
      throw error;
    }
  },
    
  verifyEmail: (data: VerifyEmailData) =>
    API.post<AuthResponse>("/auth/verify-email", data),
    
  login: async (data: LoginData): Promise<{ data: AuthResponse }> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const idToken = await userCredential.user.getIdToken();
      
      const response = await API.post<AuthResponse>("/auth/login", {
        ...data,
        firebaseToken: idToken
      });
   
      if (response.data.success && response.data.token) {
        authService.storeTokens(response.data);
        console.log("Login successful, tokens stored");
      }
      
      return response;
    } catch (error) {
      console.error("Firebase login error:", error);
      throw error;
    }
  },
  
  resetRequest: async (data: ResetRequestData) => {
    try {
      await sendPasswordResetEmail(auth, data.email);
      return { data: { success: true, message: "Password reset email sent" } };
    } catch (error) {
      console.error("Firebase reset request error:", error);
      throw error;
    }
  },
    
  resetConfirm: async (data: ResetConfirmData) => {
    try {
      await confirmPasswordReset(auth, data.code, data.newPassword);
      return API.post<AuthResponse>("/auth/reset-confirm", data);
    } catch (error) {
      console.error("Firebase reset confirm error:", error);
      throw error;
    }
  },
    
  refreshToken: async (): Promise<{ token: string; refreshToken: string }> => {
    console.log("Refresh token called");
    
    // If there's already a pending refresh request, return it
    if (pendingRefreshRequest) {
      console.log("Returning pending refresh request");
      return pendingRefreshRequest;
    }
    
    const refreshToken = localStorage.getItem("refreshToken");

    
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    
    try {
      // Create the refresh promise
      pendingRefreshRequest = (async () => {
        try {
          const response = await API.post<AuthResponse>("/auth/refresh-token", { 
            refreshToken 
          });
          
          if (response.data.success && response.data.token && response.data.refreshToken) {
            console.log("Token refresh successful");
            
            // Store the new tokens
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            
            return {
              token: response.data.token,
              refreshToken: response.data.refreshToken
            };
          } else {
            console.error("Token refresh failed:", response.data.message);
            throw new Error(response.data.message || "Token refresh failed");
          }
        } catch (error) {
          console.error("Refresh token API error:", error);
          
          // Clear tokens on refresh failure
          authService.clearAuthData();
          
          // Redirect to login if not already there
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          
          throw error;
        } finally {
          pendingRefreshRequest = null;
        }
      })();
      
      return await pendingRefreshRequest;
    } catch (error) {
      pendingRefreshRequest = null;
      throw error;
    }
  },
  
  logout: async () => {
    console.log("Logging out, clearing localStorage");
    
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Firebase signout error:", error);
    }

    authService.clearAuthData();
    window.location.href = "/login";
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    
    if (!userStr) {
      console.log("No user found in localStorage");
      return null;
    }
    
    try {
      const user = JSON.parse(userStr);
    
      return user;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  },
  
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
 
    
 
    
    // Check if token exists
    if (!token) {
      console.log("No access token found");
      return false;
    }

    
    return true;
  },
  

  getAuthHeader: () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
  
  // Helper method to store tokens and user data
  storeTokens: (authResponse: AuthResponse) => {
    if (authResponse.token) {
      localStorage.setItem("token", authResponse.token);
      console.log("Access token stored");
    }
    
    if (authResponse.refreshToken) {
      localStorage.setItem("refreshToken", authResponse.refreshToken);
      console.log("Refresh token stored");
    }
    
    if (authResponse.user) {
      console.log("Backend returned user:", authResponse.user);
      

      const userData = {
        id: authResponse.user.id,
        email: authResponse.user.email,
        firstName: authResponse.user.firstName || "",
        lastName: authResponse.user.lastName || "",
        role: authResponse.user.role || "CUSTOMER",
        referralId: authResponse.user.referralId || "",
        emailVerified: authResponse.user.emailVerified || false,
        profile: authResponse.user.profile || null
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
     
    } else {
      console.warn("No user data returned in auth response");
    }
  },
  
  // Helper method to clear all auth data
  clearAuthData: () => {
    console.log("Clearing all auth data");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },
  
  
  isTokenExpiringSoon: (minutesBefore = 5): boolean => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    
    try {
  
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return false;
      
    
      const payload = JSON.parse(atob(tokenParts[1]));
      if (!payload.exp) return false;
      
      const expiresAt = payload.exp * 1000;
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;
      
 
      return timeUntilExpiry < (minutesBefore * 60 * 1000);
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return false;
    }
  },
  

  refreshTokenIfNeeded: async (): Promise<boolean> => {
    if (authService.isTokenExpiringSoon()) {
      console.log("Token expiring soon, refreshing proactively");
      try {
        await authService.refreshToken();
        return true;
      } catch (error) {
        console.error("Proactive token refresh failed:", error);
        return false;
      }
    }
    return false;
  }
};