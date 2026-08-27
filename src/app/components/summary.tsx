import { Select, Button, Spin, Modal } from 'antd'
import { JSX, use, useEffect, useState } from 'react';
import { Game, GameResult, Hole, Player, SnakeFrequency, calculateScore } from '../types';
import '@ant-design/v5-patch-for-react-19';

export default function SummaryControl(
    props: {
        game: Game,
    }): JSX.Element {
    const { game } = props;
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [showLogModal, setShowLogModal] = useState(false);
    const [showSkinTable, setShowSkinTable] = useState(false);
    const [showWalkTable, setShowWalkTable] = useState(false);
    const result: GameResult = calculateScore(game);

    const player1 = game?.players.filter((p) => p.order === 1)[0];
    const player2 = game?.players.filter((p) => p.order === 2)[0];
    const player3 = game?.players.filter((p) => p.order === 3)[0];
    const player4 = game?.players.filter((p) => p.order === 4)[0];

    // TODO: show birdie, sandys, kp

    const getPlayerTotalStrokes = (player: Player): number => {
        return game?.holes.reduce((total, hole) => {
            if (hole) {
                let s = hole?.playerScores.find(score => score.player.order === player.order);
                total += s?.strokes || 0;
            }
            return total;
        }, 0);
    }

    const getSkins = (playerOrder: number): number => {
        switch (playerOrder) {
            case 1:
                return result?.player1Skins;
            case 2:
                return result?.player2Skins;
            case 3:
                return result?.player3Skins;
            default:
                return result?.player4Skins;
        }
    }

    const snakePerEighteenText = (lastHolePlayed: Hole): string => {
        let text = "";
        const threePuttHoles = game?.holes?.filter(h => h?.playerScores?.length > 0 && h?.playerScores?.filter(ps => ps?.putts > 2)?.length > 0);
        const lastThreePuttHole = threePuttHoles?.reduce((max, hole) => hole.number > max.number ? hole : max, threePuttHoles[0]);
        const snakePlayers = lastThreePuttHole?.playerScores.filter(ps => ps.putts > 2).map(ps => ps.player);
        if (snakePlayers?.filter(p => p.order == game?.snakeSettings?.snakeOffLoser?.order).length > 0) { /* loser has already been set in snake off */
            snakePlayers.splice(0, snakePlayers.length);
            snakePlayers.push(game.snakeSettings.snakeOffLoser);
        }
        if (snakePlayers?.length > 0) {
            text += `${snakePlayers.map(p => p.name).join(', ')}`;
            if (snakePlayers.length > 1) {
                text += ` have the snake<br />(hole ${lastThreePuttHole.number}).  `;
                if (lastHolePlayed.number === 18) text += `<b>Snake off!!!</b><br />`;
            } else {
                text += ` has the snake<br />(hole ${lastThreePuttHole.number}) `;
                // if (game?.snakeSettings?.snakeOffLoser) text += `<b>(Snake off settled)</b>`;
                text += `<br />`;
            }
        }

        return text;
    };

    const snakePerNineText = (lastHolePlayed: Hole): string => {
        let text = "";
        const threePuttHolesOnFront9 = game?.holes?.filter(h => h?.number <= 9)?.filter(h => h?.playerScores?.length > 0 && h?.playerScores?.filter(ps => ps?.putts > 2)?.length > 0);
        const lastThreePuttHoleOnfont9 = threePuttHolesOnFront9?.reduce((max, hole) => hole.number > max.number ? hole : max, threePuttHolesOnFront9[0]);
        const snakePlayersOnFront9 = lastThreePuttHoleOnfont9?.playerScores?.filter(ps => ps.putts > 2).map(ps => ps.player);
        if (snakePlayersOnFront9?.filter(p => p.order == game?.snakeSettings?.snakeOffFrontNineLoser?.order)?.length > 0) { /* loser has already been set in snake off */
            snakePlayersOnFront9.splice(0, snakePlayersOnFront9.length);
            snakePlayersOnFront9.push(game.snakeSettings.snakeOffFrontNineLoser);
        }
        if (snakePlayersOnFront9?.length > 0) {
            text += `${snakePlayersOnFront9.map(p => p.name).join(', ')}`;
            if (snakePlayersOnFront9.length > 1) {
                text += ` have the snake on the front 9<br />(hole ${lastThreePuttHoleOnfont9.number})<br />`
                if (lastHolePlayed.number >= 9) text += `<b>Snake off!!!</b><br />`;
            } else {
                text += ` has the snake on the front 9<br />(hole ${lastThreePuttHoleOnfont9.number}) `;
                // if (lastHolePlayed.number >= 9 && game?.snakeSettings?.snakeOffFrontNineLoser) text += `<b>(Snake off settled)</b>`;
                text += `<br />`;
            }
        }

        const threePuttHolesOnBack9 = game?.holes?.filter(h => h?.number > 9)?.filter(h => h?.playerScores?.length > 0 && h?.playerScores?.filter(ps => ps?.putts > 2)?.length > 0);
        const lastThreePuttHoleOnBack9 = threePuttHolesOnBack9?.reduce((max, hole) => hole.number > max.number ? hole : max, threePuttHolesOnBack9[0]);
        const snakePlayersOnBack9 = lastThreePuttHoleOnBack9?.playerScores?.filter(ps => ps.putts > 2).map(ps => ps.player);
        if (snakePlayersOnBack9?.filter(p => p.order == game?.snakeSettings?.snakeOffBackNineLoser?.order)?.length > 0) { /* loser has already been set in snake off */
            snakePlayersOnBack9.splice(0, snakePlayersOnBack9.length);
            snakePlayersOnBack9.push(game.snakeSettings.snakeOffBackNineLoser);
        }
        if (snakePlayersOnBack9?.length > 0) {
            text += `<br />${snakePlayersOnBack9.map(p => p.name).join(', ')}`;
            if (snakePlayersOnBack9.length > 1) {
                text += ` have the snake on the back 9<br />(hole ${lastThreePuttHoleOnBack9.number})<br />`;
                if (lastHolePlayed.number === 18) text += `<b>Snake off!!!</b><br />`;
            } else {
                text += ` has the snake on the back 9<br />(hole ${lastThreePuttHoleOnBack9.number})`;
                // if (lastHolePlayed.number === 18 && game?.snakeSettings?.snakeOffBackNineLoser) text += `(Snake off settled)`;
                text += `<br />`;
            }
        }

        return text;
    };

    const getSnakePlayersText = () => {
        let text = "";
        if (game?.snakeSettings?.enabled) {
            const lastHolePlayed = game?.holes?.reduce((max, hole) => {
                if (hole?.number > max?.number && hole?.playerScores?.length === game?.players?.length && hole?.playerScores !== undefined) {
                    return hole;
                } else {
                    return max;
                }
            }, game.holes[0]);

            if (game?.snakeSettings?.frequency === SnakeFrequency.perEighteen) {
                text = snakePerEighteenText(lastHolePlayed);
            } else {
                text = snakePerNineText(lastHolePlayed);
            }
        }
        return text;
    };

    const getWalkText = () => {
        let text = "";
        if (result) {
            if (result.walk_player1OwesPlayer2 > 0) {
                text += `${player1?.name} owes ${player2?.name} <b>$${result.walk_player1OwesPlayer2}</b><br />`;
            } else if (result.walk_player1OwesPlayer2 < 0) {
                text += `${player2?.name} owes ${player1?.name} <b>$${-result.walk_player1OwesPlayer2}</b><br />`;
            }

            if (result.walk_player1OwesPlayer3 > 0) {
                text += `${player1?.name} owes ${player3?.name} <b>$${result.walk_player1OwesPlayer3}</b><br />`;
            } else if (result.walk_player1OwesPlayer3 < 0) {
                text += `${player3?.name} owes ${player1?.name} <b>$${-result.walk_player1OwesPlayer3}</b><br />`;
            }

            if (result.walk_player1OwesPlayer4 > 0) {
                text += `${player1?.name} owes ${player4?.name} <b>$${result.walk_player1OwesPlayer4}</b><br />`;
            } else if (result.walk_player1OwesPlayer4 < 0) {
                text += `${player4?.name} owes ${player1?.name} <b>$${-result.walk_player1OwesPlayer4}</b><br />`;
            }

            if (result.walk_player2OwesPlayer3 > 0) {
                text += `${player2?.name} owes ${player3?.name} <b>$${result.walk_player2OwesPlayer3}</b><br />`;
            } else if (result.walk_player2OwesPlayer3 < 0) {
                text += `${player3?.name} owes ${player2?.name} <b>$${-result.walk_player2OwesPlayer3}</b><br />`;
            }

            if (result.walk_player2OwesPlayer4 > 0) {
                text += `${player2?.name} owes ${player4?.name} <b>$${result.walk_player2OwesPlayer4}</b><br />`;
            } else if (result.walk_player2OwesPlayer4 < 0) {
                text += `${player4?.name} owes ${player2?.name} <b>$${-result.walk_player2OwesPlayer4}</b><br />`;
            }

            if (result.walk_player3OwesPlayer4 > 0) {
                text += `${player3?.name} owes ${player4?.name} <b>$${result.walk_player3OwesPlayer4}</b><br />`;
            } else if (result.walk_player3OwesPlayer4 < 0) {
                text += `${player4?.name} owes ${player3?.name} <b>$${-result.walk_player3OwesPlayer4}</b><br />`;
            }
        }
        return text;
    }

    const getSkinsText = () => {
        let player1SkinValue = result.player1Skins * game?.skinValue;
        let player2SkinValue = result.player2Skins * game?.skinValue;
        let player3SkinValue = result.player3Skins * game?.skinValue;
        let player4SkinValue = result.player4Skins * game?.skinValue;

        let skins_player1OwesPlayer2 = (player2SkinValue - player1SkinValue);
        let skins_player1OwesPlayer3 = (player3SkinValue - player1SkinValue);
        let skins_player1OwesPlayer4 = (player4SkinValue - player1SkinValue);
        let skins_player2OwesPlayer3 = (player3SkinValue - player2SkinValue);
        let skins_player2OwesPlayer4 = (player4SkinValue - player2SkinValue);
        let skins_player3OwesPlayer4 = (player4SkinValue - player3SkinValue);

        let text = "";
        if (result) {
            if (skins_player1OwesPlayer2 > 0) {
                text += `${player1?.name} owes ${player2?.name} <b>$${skins_player1OwesPlayer2}</b><br />`;
            } else if (skins_player1OwesPlayer2 < 0) {
                text += `${player2?.name} owes ${player1?.name} <b>$${-skins_player1OwesPlayer2}</b><br />`;
            }

            if (skins_player1OwesPlayer3 > 0) {
                text += `${player1?.name} owes ${player3?.name} <b>$${skins_player1OwesPlayer3}</b><br />`;
            } else if (skins_player1OwesPlayer3 < 0) {
                text += `${player3?.name} owes ${player1?.name} <b>$${-skins_player1OwesPlayer3}</b><br />`;
            }

            if (skins_player1OwesPlayer4 > 0) {
                text += `${player1?.name} owes ${player4?.name} <b>$${skins_player1OwesPlayer4}</b><br />`;
            } else if (skins_player1OwesPlayer4 < 0) {
                text += `${player4?.name} owes ${player1?.name} <b>$${-skins_player1OwesPlayer4}</b><br />`;
            }

            if (skins_player2OwesPlayer3 > 0) {
                text += `${player2?.name} owes ${player3?.name} <b>$${skins_player2OwesPlayer3}</b><br />`;
            } else if (skins_player2OwesPlayer3 < 0) {
                text += `${player3?.name} owes ${player2?.name} <b>$${-skins_player2OwesPlayer3}</b><br />`;
            }

            if (skins_player2OwesPlayer4 > 0) {
                text += `${player2?.name} owes ${player4?.name} <b>$${skins_player2OwesPlayer4}</b><br />`;
            } else if (skins_player2OwesPlayer4 < 0) {
                text += `${player4?.name} owes ${player2?.name} <b>$${-skins_player2OwesPlayer4}</b><br />`;
            }

            if (skins_player3OwesPlayer4 > 0) {
                text += `${player3?.name} owes ${player4?.name} <b>$${skins_player3OwesPlayer4}</b><br />`;
            } else if (skins_player3OwesPlayer4 < 0) {
                text += `${player4?.name} owes ${player3?.name} <b>$${-skins_player3OwesPlayer4}</b><br />`;
            }
        }
        return text;
    }

    const getTotalsText = () => {
        let text = "";
        if (result) {
            /* skins */
            let player1SkinValue = result.player1Skins * game?.skinValue;
            let player2SkinValue = result.player2Skins * game?.skinValue;
            let player3SkinValue = result.player3Skins * game?.skinValue;
            let player4SkinValue = result.player4Skins * game?.skinValue;

            /* walks */
            let total_player1OwesPlayer2 = result.walk_player1OwesPlayer2 + (player2SkinValue - player1SkinValue);
            let total_player1OwesPlayer3 = result.walk_player1OwesPlayer3 + (player3SkinValue - player1SkinValue);
            let total_player1OwesPlayer4 = result.walk_player1OwesPlayer4 + (player4SkinValue - player1SkinValue);
            let total_player2OwesPlayer3 = result.walk_player2OwesPlayer3 + (player3SkinValue - player2SkinValue);
            let total_player2OwesPlayer4 = result.walk_player2OwesPlayer4 + (player4SkinValue - player2SkinValue);
            let total_player3OwesPlayer4 = result.walk_player3OwesPlayer4 + (player4SkinValue - player3SkinValue);

            /* snake */
            total_player1OwesPlayer2 = total_player1OwesPlayer2 + result.snake_player1OwesPlayer2;
            total_player1OwesPlayer3 = total_player1OwesPlayer3 + result.snake_player1OwesPlayer3;
            total_player1OwesPlayer4 = total_player1OwesPlayer4 + result.snake_player1OwesPlayer4;
            total_player2OwesPlayer3 = total_player2OwesPlayer3 + result.snake_player2OwesPlayer3;
            total_player2OwesPlayer4 = total_player2OwesPlayer4 + result.snake_player2OwesPlayer4;
            total_player3OwesPlayer4 = total_player3OwesPlayer4 + result.snake_player3OwesPlayer4;

            if (total_player1OwesPlayer2 > 0) {
                text += `${player1?.name} owes ${player2?.name} <b>$${total_player1OwesPlayer2}</b><br />`;
            } else if (total_player1OwesPlayer2 < 0) {
                text += `${player2?.name} owes ${player1?.name} <b>$${-total_player1OwesPlayer2}</b><br />`;
            }

            if (total_player1OwesPlayer3 > 0) {
                text += `${player1?.name} owes ${player3?.name} <b>$${total_player1OwesPlayer3}</b><br />`;
            } else if (total_player1OwesPlayer3 < 0) {
                text += `${player3?.name} owes ${player1?.name} <b>$${-total_player1OwesPlayer3}</b><br />`;
            }

            if (total_player1OwesPlayer4 > 0) {
                text += `${player1?.name} owes ${player4?.name} <b>$${total_player1OwesPlayer4}</b><br />`;
            } else if (total_player1OwesPlayer4 < 0) {
                text += `${player4?.name} owes ${player1?.name} <b>$${-total_player1OwesPlayer4}</b><br />`;
            }

            if (total_player2OwesPlayer3 > 0) {
                text += `${player2?.name} owes ${player3?.name} <b>$${total_player2OwesPlayer3}</b><br />`;
            } else if (total_player2OwesPlayer3 < 0) {
                text += `${player3?.name} owes ${player2?.name} <b>$${-total_player2OwesPlayer3}</b><br />`;
            }

            if (total_player2OwesPlayer4 > 0) {
                text += `${player2?.name} owes ${player4?.name} <b>$${total_player2OwesPlayer4}</b><br />`;
            } else if (total_player2OwesPlayer4 < 0) {
                text += `${player4?.name} owes ${player2?.name} <b>$${-total_player2OwesPlayer4}</b><br />`;
            }

            if (total_player3OwesPlayer4 > 0) {
                text += `${player3?.name} owes ${player4?.name} <b>$${total_player3OwesPlayer4}</b><br />`;
            } else if (total_player3OwesPlayer4 < 0) {
                text += `${player4?.name} owes ${player3?.name} <b>$${-total_player3OwesPlayer4}</b><br />`;
            }
        }

        if (text === "") {
            return "All players are even";
        }
        return text;
    }

    return (
        <div className="summary-control">
            <div className="show-summary-button">
                <Button className='button' onClick={() => setShowSummaryModal(true)}>View Score</Button>
            </div>

            <Modal open={showSummaryModal}
                onCancel={() => setShowSummaryModal(false)}
                onOk={() => setShowSummaryModal(false)}
                cancelButtonProps={{ style: { display: 'none' } }}>
                <div className="center">
                    <div className="summary-link">
                        <span onClick={() => setShowLogModal(true)}>Scoring Log</span>
                    </div>
                    <div className="clear"></div>
                    <div className="summary-tables">
                        <div className="flex">
                            <table className="margin-right-20">
                                <thead>
                                    <tr>
                                        <th colSpan={2}>Strokes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {game?.players?.map((player) => {
                                        return <tr key={player.order}>
                                            <td className="summary-player-name">{player.name}</td>
                                            <td className="summary-player-data">{getPlayerTotalStrokes(player)}</td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                            <table>
                                <thead>
                                    <tr>
                                        <th colSpan={2}>Skins</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {game?.players?.map((player) => {
                                        return <tr key={player.order}>
                                            <td className="summary-player-name">{player.name}</td>
                                            <td className="summary-player-data">{getSkins(player.order)}</td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {game?.snakeSettings?.enabled && getSnakePlayersText() !== "" && (<div className="snake-summary" dangerouslySetInnerHTML={{ __html: getSnakePlayersText() }}></div>)}
                        <table className="summary-detail-table">
                            <thead>
                                <tr>
                                    <th>Totals</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td dangerouslySetInnerHTML={{ __html: getTotalsText() }}></td>
                                </tr>
                            </tbody>
                        </table>
                        {getSkinsText() && (
                            <div className="summary-toggle">
                                <div className="summary-link">
                                    <span onClick={() => setShowSkinTable(!showSkinTable)}>Skin Details</span>
                                </div>
                                {showSkinTable && (<table className="summary-detail-table">
                                    <thead>
                                        <tr>
                                            <th>Skins</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td dangerouslySetInnerHTML={{ __html: getSkinsText() }}></td>
                                        </tr>
                                    </tbody>
                                </table>)}
                            </div>)}
                        {getWalkText() && (
                            <div>
                                <div className="summary-link">
                                    <span onClick={() => setShowWalkTable(!showWalkTable)}>Walk Details</span>
                                </div>
                                {showWalkTable && (<table className="summary-detail-table">
                                    <thead>
                                        <tr>
                                            <th>Walks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td dangerouslySetInnerHTML={{ __html: getWalkText() }}></td>
                                        </tr>
                                    </tbody>
                                </table>)}
                            </div>)}
                    </div>
                </div>
                <br />
            </Modal>

            <Modal open={showLogModal}
                onCancel={() => setShowLogModal(false)}
                onOk={() => setShowLogModal(false)}
                cancelButtonProps={{ style: { display: 'none' } }}>
                <div dangerouslySetInnerHTML={{ __html: result.log }}></div>
            </Modal>
        </div>
    )
}
