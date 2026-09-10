import React, { useContext, useState } from "react";
import { AuthContext, AuthContextType } from "../../context/AuthContext";
import "./Following.scss";
import { API_BASE_URL } from "../../config";
interface FollowingProps {
    targetUserId: number;
    isFollowing: boolean;
    onToggleFollow: (targetUserId: number, newStatus: boolean) => void;
}

const Following = ({
    targetUserId,
    isFollowing,
    onToggleFollow
}: FollowingProps) => {

    const { user } = useContext(AuthContext) as AuthContextType;
    const [loading, setLoading] = useState(false);

    const handleFollowToggle = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to follow users.");
            return;
        }

        setLoading(true);

        try {
            if (isFollowing) {
                // إلغاء المتابعة DELETE
                const response = await fetch(`${API_BASE_URL}/api/follow/${targetUserId}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    onToggleFollow(targetUserId, false); // إعلام الصفحة الرئيسية بالنتائج
                }
            } else {
                // إضافة متابعة POST
                const response = await fetch(`${API_BASE_URL}/api/follow`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(targetUserId)
                });
                if (response.ok) {
                    onToggleFollow(targetUserId, true); // إعلام الصفحة الرئيسية بالنتائج
                }
            }
        } catch (error) {
            console.error("Error updating follow status:", error);
        } finally {
            setLoading(false);
        }
    };


    if (user && user.id === targetUserId) {
        return null;
    }

    return (
        <div className="follow-container">
            <button
                className={"follow__btn"}
                onClick={handleFollowToggle}
                disabled={loading}
            >
                {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
            </button>
        </div>
    );
};

export default Following;