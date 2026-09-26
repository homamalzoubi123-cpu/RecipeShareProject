import { useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";
import { AuthContext, AuthContextType } from "../../context/AuthContext";
import type { Recipe, UserProfile } from "./Profile.types";

interface UseProfileDataProps {
  userId?: string;
  isOwnProfile: boolean;
}

/**
 * Lädt Profil, Rezepte sowie Follower-/Following-Zähler.
 * Hält nur den Lese-Zustand der Profilseite.
 */
export const useProfileData = ({
  userId,
  isOwnProfile,
}: UseProfileDataProps) => {
  const { token } = useContext(AuthContext) as AuthContextType;
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    imageUrl: null,
    username: "",
  });
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const storedToken = localStorage.getItem("token") || token;
    const headers = {
      Authorization: `Bearer ${storedToken}`,
      "Content-Type": "application/json",
    };

    const userEndpoint = isOwnProfile
      ? `${API_BASE_URL}/api/users/me`
      : `${API_BASE_URL}/api/users/${userId}`;

    const recipesEndpoint = isOwnProfile
      ? `${API_BASE_URL}/api/recipes/my-recipes`
      : `${API_BASE_URL}/api/recipes/user/${userId}`;

    Promise.all([
      fetch(recipesEndpoint, { headers }),
      fetch(userEndpoint, { headers }),
    ])
      .then(async ([recipesRes, userRes]) => {
        if (!recipesRes.ok) throw new Error("Fehler beim Laden der Rezepte.");
        if (!userRes.ok)
          throw new Error("Fehler beim Laden des Benutzerprofils.");

        const recipesData: Recipe[] = await recipesRes.json();
        const userData: UserProfile = await userRes.json();

        setRecipes(recipesData);
        setUserProfile(userData);

        if (userData.id) {
          const followersRes = await fetch(
            `${API_BASE_URL}/api/Follow/followers/${userData.id}`,
            { headers },
          );
          if (followersRes.ok) {
            const followersData = await followersRes.json();
            setFollowersCount(followersData.length);
          }
        }

        if (userData.id) {
          const followingRes = await fetch(
            `${API_BASE_URL}/api/follow/${userData.id}`,
            { headers },
          );
          if (followingRes.ok) {
            const followingData = await followingRes.json();
            setFollowingCount(followingData.length);
          }
        }

        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error("Profil-Fehler:", err);
        setError(err instanceof Error ? err.message : "Unbekannter Fehler");
        setLoading(false);
      });
  }, [userId, isOwnProfile, token]);

  return {
    recipes,
    setRecipes,
    userProfile,
    setUserProfile,
    followersCount,
    followingCount,
    loading,
    error,
  };
};
