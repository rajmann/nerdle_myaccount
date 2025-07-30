import './badges.css'
import { enabledGameModes } from './EnabledGames';

type Props = {
    award: any;
    description: any;
    title? : string;
    measure: string;
    gameMode: string;
    handleBadgeClick: (largeImage: string) => void;
}

export const SmallBadge = ({ award, description, title, measure, gameMode, handleBadgeClick }: Props) => {

    var smallImage = award.award.smallImage
    var smallGrayImage = award.award.nextRule ? award.award.nextRule.smallImage : ""

    if (enabledGameModes.includes(gameMode) === false) {
        return <div />
    }

    // i want a div with two columns. The image is in the center of the left hand column, then we have text in right hand column
    return (
        <>
            <div className={"dark:text-[#D7DADC] mt-4 " + (!award.award.smallImage.includes('gray') ? 'cursor-pointer' : '')}
                onClick={() => { 
                    if (!award.award.smallImage.includes('gray')) {
                        handleBadgeClick(award.award.largeImage)
                    }
                }}
            >
                    {title && title=="nerdleverse" 
                        ? <span><span className="dark:text-white nerdle-name">{title}</span> <span className="dark:text-white nerdle-sub-name">points</span></span>
                        : title=="challenges" 
                            ? <span><span className="dark:text-white nerdle-sub-name">{title}</span></span>
                            : <span><span className="dark:text-white nerdle-sub-name">{gameMode}</span> <span className="dark:text-white nerdle-name">nerdle</span> <span className="dark:text-white nerdle-sub-name">straights</span></span>
                    }
 
                <div className="badge mt-2">
                    <div className="badge-image">
                        <img src={smallImage} alt={award.award.name} width={100}/>
                    </div>
                    <div className="badge-text">
                        <div className="badge-text-content">
                            <h3 className="font-bold">{award.award.name.replace("in 7 days","this week")}</h3> {/* MJT - replace hack with backend */}
                            <p>{description}</p>
                        </div>
                    </div>
                </div>
            </div>

            {smallGrayImage != "" && award.award.nextRuleDays && (
            <div className="mt-2 dark:text-[#D7DADC]">
                <div className="badge">
                    <div className="badge-image">
                        <img src={smallGrayImage} alt={award.award.nextRule.name} width={100}/>
                    </div>
                    <div className="badge-text">
                        <div className="badge-text-content">
                            <h3 className="font-bold">{award.award.nextRule.name.replace("in 7 days","this week")}</h3>{/* replace hack with backend */}
                            <p>{award.award.nextRuleDays} {measure} to go</p>
                        </div>
                    </div>
                </div>
            </div>)}

        </>

    )

}