import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  sub: string; // userId
  email: string;
  exp: number;
  [key: string]: any;
}

export function useAuthToken(): {
  userId: string | null;
  email: string | null;
  role: string | null;
  isExpired: boolean;
} {
  const token = localStorage.getItem('token');

  console.log("🪪 Raw token from localStorage:", token);

  if (!token) {
    console.warn("❌ No token found in localStorage.");
    return { userId: null, email: null, role: null, isExpired: true };
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);

    const userId = decoded.sub;
    const email = decoded.email;

    // ✅ Extract and normalize role
    const rawRole =
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      decoded["role"];
    const role = Array.isArray(rawRole)
      ? rawRole[0].toLowerCase()
      : rawRole?.toLowerCase() || null;

    const now = Date.now() / 1000;
    const exp = decoded.exp || 0;
    const isExpired = exp < now;

    console.log("🧠 Decoded Token:", { userId, email, role, exp, now, isExpired });

    return { userId, email, role, isExpired };
  } catch (error) {
    console.error("❌ Failed to decode token:", error);
    console.warn("🪪 Bad token content:", token);
    return { userId: null, email: null, role: null, isExpired: true };
  }
}
