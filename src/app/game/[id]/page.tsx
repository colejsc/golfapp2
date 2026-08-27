'use client'


import Layout from "@/app/layout"
import { Game, Hole, Player, SnakeFrequency } from "@/app/types"
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link';
// import { useSession } from "next-auth/react";
import * as _ from 'lodash';
import SummaryControl from "@/app/components/summary"
import GameSettingsControl from "@/app/components/gamesettings";
import { Button, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { GetLocalStorage } from "@/lib/localstorage";

// const storage = GetLocalStorage();

export default function GamePage() {
    const [storage, setStorage] = useState<ReturnType<
        typeof GetLocalStorage
    > | null>(null);

    const router = useRouter();
    const { id: gameId } = useParams(); 
    //const game = storage.get(`game${gameId}`) as Game;
    const [game, SetGame] = useState<Game>(null);

    const [showSnakeOffModal, setShowSnakeOffModal] = useState(false);

    const [snakeOffPlayers, setSnakeOffPlayers] = useState<Player[]>([]);
    const [snakeOffLoserOrder, setSnakeOffLoserOrder] = useState<number>(game?.snakeSettings?.snakeOffLoser?.order);

    const [snakeOffPlayersFrontNine, setSnakeOffPlayersFrontNine] = useState<Player[]>([]);
    const [snakeOffLoserFrontNineOrder, setSnakeOffLoserFrontNineOrder] = useState<number>(game?.snakeSettings?.snakeOffFrontNineLoser?.order);

    const [snakeOffPlayersBackNine, setSnakeOffPlayersBackNine] = useState<Player[]>([]);
    const [snakeOffLoserBackNineOrder, setSnakeOffLoserBackNineOrder] = useState<number>(game?.snakeSettings?.snakeOffBackNineLoser?.order);

    useEffect(() => {
        getSnakeOffPlayers();
        setStorage(GetLocalStorage());
        if(storage) {
         SetGame(storage.get(`game${gameId}`) as Game);
        }
    }, [gameId, storage, setStorage]);

    useEffect(() => {
        setSnakeOffLoserOrder(game?.snakeSettings?.snakeOffLoser?.order);
        setSnakeOffLoserFrontNineOrder(game?.snakeSettings?.snakeOffFrontNineLoser?.order);
        setSnakeOffLoserBackNineOrder(game?.snakeSettings?.snakeOffBackNineLoser?.order);
    }, [showSnakeOffModal]);

    const isHoleComplete = (holeIndex: number) => {
        let scores = game?.holes[holeIndex]?.playerScores;
        if (scores && scores.length === game?.players.length) {
            if (scores.filter(ps => ps.strokes > 0).length > 0) return true;
        }
        return false;
    }

    const getSnakeOffPlayers = () => {
        if (game?.snakeSettings?.enabled) {
            const lastHolePlayed = game?.holes?.reduce((max, hole) => {
                if (hole?.number > max?.number && hole?.playerScores?.length === game?.players?.length && hole?.playerScores !== undefined) {
                    return hole;
                } else {
                    return max;
                }
            }, game.holes[0]);

            if (game?.snakeSettings?.frequency === SnakeFrequency.perEighteen && lastHolePlayed.number === 18) {
                const threePuttHoles = game?.holes?.filter(h => h?.playerScores?.length > 0 && h?.playerScores?.filter(ps => ps?.putts > 2)?.length > 0);
                const lastThreePuttHole = threePuttHoles?.reduce((max, hole) => hole.number > max.number ? hole : max, threePuttHoles[0]);
                const snakePlayers = lastThreePuttHole?.playerScores.filter(ps => ps.putts > 2).map(ps => ps.player);
                if (snakePlayers?.length > 1) setSnakeOffPlayers(snakePlayers);
            } else if (game?.snakeSettings?.frequency === SnakeFrequency.perNine && lastHolePlayed?.number > 9) {
                const threePuttHolesOnFront9 = game?.holes?.filter(h => h?.number <= 9)?.filter(h => h?.playerScores?.length > 0 && h?.playerScores?.filter(ps => ps?.putts > 2)?.length > 0);
                const lastThreePuttHoleOnfont9 = threePuttHolesOnFront9?.reduce((max, hole) => hole.number > max.number ? hole : max, threePuttHolesOnFront9[0]);
                const snakePlayersOnFront9 = lastThreePuttHoleOnfont9?.playerScores?.filter(ps => ps.putts > 2).map(ps => ps.player);
                if (snakePlayersOnFront9?.length > 1) setSnakeOffPlayersFrontNine(snakePlayersOnFront9);
                const threePuttHolesOnBack9 = game?.holes?.filter(h => h?.number > 9)?.filter(h => h?.playerScores?.length > 0 && h?.playerScores?.filter(ps => ps?.putts > 2)?.length > 0);
                const lastThreePuttHoleOnBack9 = threePuttHolesOnBack9?.reduce((max, hole) => hole.number > max.number ? hole : max, threePuttHolesOnBack9[0]);
                const snakePlayersOnBack9 = lastThreePuttHoleOnBack9?.playerScores?.filter(ps => ps.putts > 2).map(ps => ps.player);
                if (snakePlayersOnBack9?.length > 1) setSnakeOffPlayersBackNine(snakePlayersOnBack9);
            }
            // console.log('snakeOffPlayers', snakeOffPlayers);
            // console.log('snakeOffPlayersFrontNine', snakeOffPlayersFrontNine);
            // console.log('snakeOffPlayersBackNine', snakeOffPlayersBackNine);
        }

    };

    const isSnakeOffSettled = (): boolean => {
        if (game?.snakeSettings?.frequency === SnakeFrequency.perEighteen) {
            if (snakeOffPlayers?.length > 1 && game?.snakeSettings?.snakeOffLoser === undefined) {
                return false;
            }
        } else if (game?.snakeSettings?.frequency === SnakeFrequency.perNine) {
            let frontNineSettled = true;
            let backNineSettled = true;
            // console.log('isSnakeOffSettled snakeOffPlayersFrontNine', snakeOffPlayersFrontNine);
            // console.log('isSnakeOffSettled game?.snakeSettings?.snakeOffFrontNineLoser', game?.snakeSettings?.snakeOffFrontNineLoser);
            if (snakeOffPlayersFrontNine?.length > 1 && !game?.snakeSettings?.snakeOffFrontNineLoser) {
                frontNineSettled = false;
            }
            if (snakeOffPlayersBackNine?.length > 1 && !game?.snakeSettings?.snakeOffBackNineLoser) {
                backNineSettled = false;
            }
            return frontNineSettled && backNineSettled;
        }
        return true;
    };

    const setSnakeOffWinners = () => {
        if (game?.snakeSettings?.frequency === SnakeFrequency.perEighteen) {
            game.snakeSettings.snakeOffLoser = snakeOffPlayers?.filter(p => p.order === snakeOffLoserOrder)[0];
        } else if (game?.snakeSettings?.frequency === SnakeFrequency.perNine) {
            game.snakeSettings.snakeOffFrontNineLoser = snakeOffPlayersFrontNine?.filter(p => p.order === snakeOffLoserFrontNineOrder)[0];
            game.snakeSettings.snakeOffBackNineLoser = snakeOffPlayersBackNine?.filter(p => p.order === snakeOffLoserBackNineOrder)[0];
        }
        setShowSnakeOffModal(false);
        storage.set(`game${gameId}`, game);
        
        // if (typeof window !== 'undefined') 
        //     window.location.href = `/game/${game.id}`;
        router.push(`/game/${game.id}`);
    };

    return (
        <div>
            <div className="backLink margin-bottom-15">
                <Link href='/'>&lt; Back to games</Link>
            </div>

            <h1 className="center">
                {game?.courseName}
            </h1>

            <SummaryControl game={game} />

            <div className="center">
                <div className='hole-links'>
                    {[...Array(18)].map((_, index) => (
                        <Link key={index}
                            className={`hole-link ${isHoleComplete(index) ? 'hole-complete' : 'hole-incomplete'}`}
                            href={`/game/${gameId}/hole/${index + 1}`}>
                            {index + 1}
                        </Link>
                    ))}
                </div>
            </div>
            {(snakeOffPlayers?.length > 1 || snakeOffPlayersFrontNine?.length > 1 || snakeOffPlayersBackNine?.length > 1)
                && <div className="show-snakeoff-button">
                    <Button
                        className={`button ${isSnakeOffSettled() ? 'snakeoff-settled' : 'snakeoff-not-settled'}`}
                        onClick={() => setShowSnakeOffModal(true)}>
                        {isSnakeOffSettled() ? 'Change Snake Off Result' : 'Set Snake Off Result'}
                    </Button>
                </div>}
            <br />
            <GameSettingsControl game={game} />
            <Modal open={showSnakeOffModal}
                onCancel={() => setShowSnakeOffModal(false)}
                onOk={setSnakeOffWinners}>
                <div>
                    <h2>Snake Off Results</h2>
                    <div className="snakeoff-section">
                        {game?.snakeSettings?.frequency === SnakeFrequency.perEighteen && (<>
                            {snakeOffPlayers?.length > 1 && (<>
                                <div className="snakeoff-label">Snake Off Loser:</div>
                                <div className="snakeoff-input">
                                    <Select size="large" style={{ minWidth: '180px' }}
                                        showSearch={false}
                                        onChange={(e) => setSnakeOffLoserOrder((e))}
                                        options={Object.values(snakeOffPlayers).map(p => ({ value: p.order, label: p.name }))}
                                        value={snakeOffLoserOrder}
                                        defaultValue={snakeOffLoserOrder}
                                    />
                                </div>
                            </>)}
                        </>)}
                        {game?.snakeSettings?.frequency === SnakeFrequency.perNine && (<div>
                            {snakeOffPlayersFrontNine?.length > 1 && (<>
                                <div className="snakeoff-label">Front 9 Snake Off Loser:</div>
                                <div className="snakeoff-input">
                                    <Select size="large" style={{ width: '100%' }}
                                        showSearch={false}
                                        onChange={(e) => setSnakeOffLoserFrontNineOrder((e))}
                                        options={Object.values(snakeOffPlayersFrontNine).map(p => ({ value: p.order, label: p.name }))}
                                        value={snakeOffLoserFrontNineOrder}
                                        defaultValue={snakeOffLoserFrontNineOrder}
                                    />
                                </div>
                                <br />
                            </>)}
                            {snakeOffPlayersBackNine?.length > 1 && (<>
                                <div className="snakeoff-label">Back 9 Snake Off Loser:</div>
                                <div className="snakeoff-input">
                                    <Select size="large" style={{ width: '100%' }}
                                        showSearch={false}
                                        onChange={(e) => setSnakeOffLoserBackNineOrder((e))}
                                        options={snakeOffPlayersBackNine && Object.values(snakeOffPlayersBackNine).map(p => ({ value: p.order, label: p.name }))}
                                        value={snakeOffLoserBackNineOrder}
                                        defaultValue={snakeOffLoserBackNineOrder}
                                    />
                                </div>
                            </>)}
                            <br />
                        </div>
                        )}

                    </div>
                </div>
            </Modal>
        </div >
    )
}

