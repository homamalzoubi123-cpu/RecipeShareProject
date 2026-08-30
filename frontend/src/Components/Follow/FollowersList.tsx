import { use, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./FollowersList.scss";
const API_BASE_URL = "http://localhost:5082";
import { NavLink } from "react-router-dom";
// Typ für jedes einzelne Element in der Liste (kommt vom Backend)
interface FollowerUser {
    followerId: number;
    username: string;
    isFollowedByMe: boolean;
}

const FollowersList = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [followersList, setFollowersList] = useState<FollowerUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingId, setLoadingId] = useState<number | null>(null);

    useEffect(() => {
        if (!userId) return;

        const token = localStorage.getItem("token");

        fetch(`${API_BASE_URL}/api/Follow/followers/${userId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.status === 404) {
                    // Kein Follower gefunden — kein Fehler, einfach leere Liste
                    setFollowersList([]);
                    setLoading(false);
                    return null;
                }
                if (!response.ok) {
                    throw new Error(`Fehler: ${response.status}`);
                }
                return response.json();
            })
            .then((data: FollowerUser[] | null) => {
                if (data) {
                    setFollowersList(data);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.error("Error fetching followers:", err);
                setLoading(false);
            });
    }, [userId]);

    const handleToggleFollow = async (followerId: number, currentStatus: boolean) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to follow users.");
            return;
        }

        setLoadingId(followerId);
        try {
            if (currentStatus) {
                const response = await fetch(`${API_BASE_URL}/api/Follow/${followerId}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (response.ok) {

                    setFollowersList((prev) =>
                        prev.map((f) =>
                            f.followerId === followerId ? { ...f, isFollowedByMe: false } :
                                f
                        )
                    );
                }
            } else {
                const response = await fetch(`${API_BASE_URL}/api/Follow`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(followerId)
                });
                if (response.ok) {
                    setFollowersList((prev) =>
                        prev.map((f) =>
                            f.followerId === followerId ? { ...f, isFollowedByMe: true } : f
                        )
                    );
                }
            }
        }
        catch (error) {
            console.error("Error toggling follow:", error);
        } finally {
            setLoadingId(null);
        }


    };

    return (
        <div className="followers-Container">
            <div className="followers-page__header">
                <button className="followers-page__back" onClick={() => navigate("/Profile")}>
                    Zurück
                </button>
                <div className="followers-page__titles">
                    <NavLink to={`/profile/${userId}/followers`}
                        className={({ isActive }) => isActive ? "follow-link follow-link--active" : "follow-link"}>
                        <h2>Follower</h2>
                    </NavLink>
                    <NavLink to={`/profile/${userId}/following`}
                        className={({ isActive }) => isActive ? "follow-link follow-link--active" : "follow-link"}>
                        <h2>Gefolgt</h2>
                    </NavLink>
                </div>
            </div>
            <div className="followers-List">
                {loading ? (
                    <p>Loading...</p>
                ) : followersList.length === 0 ? (
                    <p>Noch keine Follower.</p>
                ) : (
                    <div>
                        {followersList.map((follower) => (
                            <div key={follower.followerId} className="followers-List__item">
                                <span className="followers-List__id">{follower.username}</span>
                                <span
                                    className={`follow-status ${follower.isFollowedByMe ? "follow-status--following" : ""
                                        }`}
                                >
                                    <button
                                        className="follow-button"
                                        disabled={loadingId === follower.followerId}
                                        onClick={() =>
                                            handleToggleFollow(follower.followerId, follower.isFollowedByMe)
                                        }
                                    >
                                        {loadingId === follower.followerId
                                            ? "..."
                                            : follower.isFollowedByMe
                                                ? "Gefolgt"
                                                : "Auch Folgen"}
                                    </button>
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FollowersList;