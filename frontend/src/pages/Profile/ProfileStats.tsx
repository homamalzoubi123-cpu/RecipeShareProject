interface ProfileStatsProps {
    recipesCount: number;
    followersCount: number;
    followingCount: number;
    onRecipesClick: () => void;
    onFollowersClick: () => void;
    onFollowingClick: () => void;
}

function ProfileStats({
    recipesCount,
    followersCount,
    followingCount,
    onRecipesClick,
    onFollowersClick,
    onFollowingClick
}: ProfileStatsProps) {

    return (
        <div className="profile-stats">

            <div
                className="profile-stats__item"
                onClick={onRecipesClick}
                style={{ cursor: "pointer" }}
            >
                <span>{recipesCount}</span>
                <strong>Beiträge</strong>
            </div>

            <div className="profile-stats__item">
                <button
                    className="following-button"
                    onClick={onFollowersClick}
                >
                    <span>{followersCount}</span>
                    <strong>Follower</strong>
                </button>
            </div>

            <div className="profile-stats__item">
                <button
                    className="following-button"
                    onClick={onFollowingClick}
                >
                    <span>{followingCount}</span>
                    <strong>Gefolgt</strong>
                </button>
            </div>

        </div>
    );
}

export default ProfileStats;