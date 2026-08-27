import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5082";

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

    return (
        <div className="followers-Container">
            <div className="followers-page__header">
                <button className="followers-page__back" onClick={() => navigate(-1)}>
                    Zurück
                </button>
                <h2>Follower</h2>
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
                                    {follower.isFollowedByMe ? "Gefolgt" : "Nicht gefolgt"}
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
