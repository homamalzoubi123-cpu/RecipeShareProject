import acaunt from "../../assets/account.svg";
import "./ProfileHeader.scss";
import ProfileStats from "./ProfileStats";
import {UserProfile} from "./Profile"


interface ProfileHeaderProps {
    userProfile: UserProfile;
    recipesCount: number;
    followersCount: number;
    followingCount: number;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onImageUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRecipesClick: () => void;
    onFollowersClick: () => void;
    onFollowingClick: () => void;
    getImageUrl: (imagePath: string | null) => string;
}
 
const ProfileHeader = ({
    userProfile,
    recipesCount,
    followersCount,
    followingCount,
    fileInputRef,
    onImageUpload,
    onRecipesClick,
    onFollowersClick,
    onFollowingClick,
    getImageUrl}: ProfileHeaderProps) => {
    const isOwnProfile = !!onImageUpload; // إذا فيه function، معناها بروفايلي أنا

    
    return (
        <div className="profile-header-wrapper">
            <div className="profile-header">
                {isOwnProfile && (
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={onImageUpload}
                        style={{ display: "none" }}
                    />
                )}

                <div className="profile-image-wrapper">
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

                    {isOwnProfile && (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="change-image-btn"
                            title="Klicken zum Ändern des Profilbilds"
                        >
                            <span className="change-image-text"></span>
                        </button>
                    )}
                </div>

                <div className="profile-info">
                    <div className="username">{userProfile.username || "Benutzer"}</div>

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