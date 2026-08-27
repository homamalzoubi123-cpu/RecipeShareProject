import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Following from "./Following";
import "./FollowingList.scss";

const API_BASE_URL = "http://localhost:5082";

interface FollowingUser {
    followingId: number;
    username: string;
}

const FollowingList = () => {
   
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();

    const [followingList, setFollowingList] = useState<FollowingUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        fetch(`${API_BASE_URL}/api/follow/${userId}`)
            .then((res) => res.json())
            .then((data: FollowingUser[]) => {
                setFollowingList(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching following list:", err);
                setLoading(false);
            });
    }, [userId]);

    const handleToggleFollow = (unfollowedUserId: number, newStatus: boolean) => {
        if (!newStatus) {
            // Bei Unfollow: Person aus der Liste entfernen
            setFollowingList((prev) =>
                prev.filter((f) => f.followingId !== unfollowedUserId)
            );
        }
    };

    if (loading) return <p>Loading...</p>;
    console.log("Following List:", followingList);
    return (
        <div className="following-page">
            <div className="following-page__header">
                <button className="following-page__back" onClick={() => navigate(-1)}>
                     Zurück
                </button>
                <h2>Gefolgt</h2>
            </div>

            <div className="following-list">
                {followingList.length === 0 ? (
                    <p>Noch niemandem gefolgt.</p>
                ) : (
                    followingList.map((followingUser) => (
                        <div
                            key={followingUser.followingId}
                            className="following-list__item"
                        >
                            <span>{followingUser.username}</span>
                            <Following
                                targetUserId={followingUser.followingId}
                                isFollowing={true}
                                onToggleFollow={handleToggleFollow}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FollowingList;
