import acaunt from "../../assets/account.svg";
import ProfileStats from "./ProfileStats";

interface UserProfile {
    id?: number;
    imageUrl: string | null;
    username: string;
}

interface ProfileHeaderProps {
    userProfile: UserProfile;
    recipesCount: number;
    followersCount: number;
    followingCount: number;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRecipesClick: () => void;
    onFollowersClick: () => void;
    onFollowingClick: () => void;
    getImageUrl: (imagePath: string | null) => string;
}

function ProfileHeader({
    userProfile,
    recipesCount,
    followersCount,
    followingCount,
    fileInputRef,
    onImageUpload,
    onRecipesClick,
    onFollowersClick,
    onFollowingClick,
    getImageUrl
}: ProfileHeaderProps) {

    return (
        <div className="profile-header-wrapper">

            <div className="profile-header">

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={onImageUpload}
                    style={{ display: "none" }}
                />

                <div className="profile-image-wrapper">

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        style={{ cursor: "pointer" }}
                        title="Klicken zum Ändern des Profilbilds"
                    >

                        {!userProfile.imageUrl ? (
                            <img
                                className="header__container__account"
                                src={acaunt}
                                alt="account"
                            />
                        ) : (
                            <img
                                src={getImageUrl(userProfile.imageUrl)}
                                alt="Profilbild"
                                className="profile-image"
                            />
                        )}

                    </button>

                </div>

                <div className="profile-info">

                    <div className="username">
                        {userProfile.username || "Benutzer"}
                    </div>

                    <ProfileStats
                        recipesCount={recipesCount}
                        followersCount={followersCount}
                        followingCount={followingCount}
                        onRecipesClick={onRecipesClick}
                        onFollowersClick={onFollowersClick}
                        onFollowingClick={onFollowingClick}
                    />

                </div>

            </div>

        </div>
    );
}

export default ProfileHeader;