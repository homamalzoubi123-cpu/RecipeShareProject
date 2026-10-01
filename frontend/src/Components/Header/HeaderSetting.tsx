import React, { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, AuthContextType } from "../../context/AuthContext";
import "./HeaderSetting.scss";

interface HeaderSettingProps {
	handleLsetting: () => void;
	isSettingOpen: boolean;
}

const HeaderSetting: React.FC<HeaderSettingProps> = ({
	handleLsetting,
	isSettingOpen
}: HeaderSettingProps) => {
	const { user, logout } = useContext(AuthContext) as AuthContextType;
	const navigate = useNavigate();
	const closeRef = useRef<HTMLButtonElement>(null);

	const handleLogout = () => {
		logout();
		handleLsetting();
		navigate("/");
	};

	useEffect(() => {
		if (!isSettingOpen) {
			return;
		}
		closeRef.current?.focus();

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				handleLsetting();
			}
		};
		window.addEventListener("keydown", onKeyDown);

		return () => window.removeEventListener("keydown", onKeyDown);
	}, [isSettingOpen, handleLsetting]);

	return (
		<div
			className={`set${isSettingOpen ? " set--open" : ""}`}
			role="dialog"
			aria-modal="true"
			aria-label="Settings"
			aria-hidden={!isSettingOpen}
			inert={!isSettingOpen}
		>
			<div className="set__head">
				<h2 className="set__title">Settings</h2>
				<button
					ref={closeRef}
					type="button"
					className="set__close"
					onClick={handleLsetting}
					aria-label="Close settings"
				>
					<span className="ic-close" />
				</button>
			</div>

			<div className="set__list">
				<button type="button" className="set__item">
					<span className="ic-setting" />
					Settings
				</button>

				<button type="button" className="set__item">
					<span className="ic-profile" />
					Profile
				</button>

				<button type="button" className="set__item">
					<span className="ic-help" />
					Help
				</button>

				<button type="button" className="set__item">
					<span className="ic-about" />
					About
				</button>

				{user && (
					<button type="button" className="set__item set__item--logout" onClick={handleLogout}>
						<span className="ic-logout" />
						Logout
					</button>
				)}
			</div>
		</div>
	);
};

export default HeaderSetting;
