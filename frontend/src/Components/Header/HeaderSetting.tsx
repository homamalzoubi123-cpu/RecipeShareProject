import React from "react";
import "./HeaderSetting.scss";
interface HeaderSettingProps { 
	handleLsetting: () => void;
	isSettingOpen: boolean;
}
const HeaderSetting: React.FC<HeaderSettingProps> = ({
	handleLsetting,
	isSettingOpen
}: HeaderSettingProps) => { 
	return (
		<div className={`header__container__setting${isSettingOpen ? ' header__container__setting--open' : ''}`}
			onClick={handleLsetting}
		>

			<div className="header__container__setting__Liste" >

				<button
					className="header__container__setting__Close"
					onClick={handleLsetting}
				>
					X
				</button>

				<button
					className="header__container__setting__button"
				>
					Settings
				</button>

				<button
					className="header__container__setting__button"
				>
					Settings
				</button>

				<button
					className="header__container__setting__button"
				>
					Profile Settings
				</button>

				<button
					className="header__container__setting__button"
				>
					Help
				</button>

				<button
					className="header__container__setting__button"
				>
					About
				</button>

				<button
					className="header__container__setting__button"
				>
					Logout
				</button>

			</div>

		</div>
	)
}
export default HeaderSetting;