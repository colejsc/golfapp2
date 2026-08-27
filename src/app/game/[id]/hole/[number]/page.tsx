'use client'

import { Game, Player, PlayerScore, Hole, WolfType, SnakeFrequency } from '@/app/types'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link';
import { Button, Card, Divider, InputNumber, Modal, Radio, Select, SelectProps, Spin, Switch } from "antd";
import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
import * as _ from 'lodash';
import { GetLocalStorage } from "@/lib/localstorage";
import SummaryControl from "@/app/components/summary";
import Image from 'next/image';
import SnakeIcon from "../../../../../../public/icon-snake.png";

//const storage = GetLocalStorage();

export default function HolePage() {
    const router = useRouter();
    const [storage, setStorage] = useState<ReturnType<
        typeof GetLocalStorage
    > | null>(null);
    const { id: gameId, number: gameNumber } = useParams(); 

    const [holeNumber, setHoleNumber] = useState<number>(parseInt(gameNumber as string));
    //const [game, setGame] = useState<Game>(storage.get(`game${gameId}`) as Game);
    const [game, setGame] = useState<Game>();
    // const [hole, setHole] = useState<Hole>(() => {
    //     let h = game?.holes[holeNumber - 1] || {
    //         number: holeNumber,
    //         par: 4,
    //         playerScores: new Array<PlayerScore>(),
    //     };
    //     return h;
    // });
    const [hole, setHole] = useState<Hole>();
    //const [par, setPar] = useState<number>(hole.par);
    const [par, setPar] = useState<number>();
    //const [playerScores, setPlayerScores] = useState<Array<PlayerScore>>(hole.playerScores);
    const [playerScores, setPlayerScores] = useState<Array<PlayerScore>>();
    //const [players, setPlayers] = useState<Player[]>(game?.players);
    const [players, setPlayers] = useState<Player[]>();

    const [playerScoreModal, setPlayerScoreModal] = useState<Player>(null);
    const [strokes, setStrokes] = useState<number>(null);
    const [putts, setPutts] = useState<number>(null);
    const [sandy, setSandy] = useState(false);
    const [kp, setKp] = useState(false);
    const [walked, setWalked] = useState(false);
    const [walkedBy, setWalkedBy] = useState<Array<number>>();
    const [walkedByOptions, setWalkedByOptions] = useState<Player[]>(null);
    const [showWolfTeamModal, setShowWolfTeamModal] = useState(false);
    const [wolfType, setWolfType] = useState<WolfType>(WolfType.none);
    const [wolfTeam1Options, setWolfTeam1Options] = useState<Player[]>(null);
    const [wolfTeam2Options, setWolfTeam2Options] = useState<Player[]>(null);
    const [wolfTeam1, setWolfTeam1] = useState<Player[]>(null);
    const [wolfTeam2, setWolfTeam2] = useState<Player[]>(null);
    const [openWolfTeamDropdown, setOpenWolfTeamDropdown] = useState<boolean>(false);
    const [wolfModalErrorMessage, setWolfModalErrorMessage] = useState<string>();
    const [scoreModalErrorMessage, setScoreModalErrorMessage] = useState<string>();
    const [holeErrorMessage, setHoleErrorMessage] = useState<string>();

    useEffect(() => {
        setStorage(GetLocalStorage());
        if(storage) {
            if(!game) setGame(storage.get(`game${gameId}`) as Game);
            if(game) {
                setPlayers(game.players)
                let currentHoleNumber = parseInt(gameNumber as string);
                setHoleNumber(currentHoleNumber);
                let h = game.holes[currentHoleNumber - 1] || {
                    number: currentHoleNumber,
                    par: 4,
                    playerScores: new Array<PlayerScore>(),
                };
                setHole(h);
                setPar(h.par);
                setPlayerScores(h.playerScores);
                setWolfType(h.wolfType);
                setWolfTeam1(h.wolfTeam1);
                setWolfTeam2(h.wolfTeam2);
            }
        }
    }, [setStorage, storage, setGame, gameId, game, gameNumber]);

    const showWolfModal = () => {
        setWolfTeam1Options(players);
        setWolfTeam2Options([]);
        setWolfTeam1(hole.wolfTeam1);
        setWolfTeam2(hole.wolfTeam2);
        setShowWolfTeamModal(true);
    };

    const selectWolfType = (wolfType: WolfType) => {
        setWolfModalErrorMessage(null);
        setWolfType(wolfType);
        setWolfTeam1([]);
        setWolfTeam2([]);
        setWolfTeam1Options(players);
        setWolfTeam2Options([]);
    };

    const wolfTeamDropdownSelected = () => {
        console.log('selected')
        setOpenWolfTeamDropdown(false);
    }

    const wolfTeamDropdownClicked = () => {
        console.log('clicked')
        if ((wolfType === WolfType.blind && wolfTeam1.length === 1) ||
            (wolfType === WolfType.team && wolfTeam1.length === 3)) setOpenWolfTeamDropdown(false);
        else setOpenWolfTeamDropdown(!openWolfTeamDropdown);
    }

    const selectWolfTeam1 = (selectProps: SelectProps[]) => {
        let team1: Player[] = selectProps.map(o => _.find(players, { order: o }));
        let team2: Player[] = players.filter((p) => !team1.includes(p));
        setWolfTeam1(team1);
        setWolfTeam2(team2);

        if (wolfType === WolfType.none) {
            setWolfTeam1Options([]);
            setWolfTeam1([]);
            setWolfTeam2([]);
        } else {
            if (team1.length === 0) {
                setWolfTeam1Options(players);
                setWolfTeam2([]);
            } else {
                switch (wolfType) {
                    case WolfType.team:
                        team1.length === 3 ? setWolfTeam1Options([]) : setWolfTeam1Options(players);
                        break;
                    case WolfType.blind:
                        team1.length === 1 ? setWolfTeam1Options([]) : setWolfTeam1Options(players);
                        break;
                }
            }
        }
    };

    const setWolfTeams = () => {
        if ((wolfType === WolfType.team || wolfType === WolfType.blind) && wolfTeam1.length < 1) {
            setWolfModalErrorMessage('Select wolf teams');
            return;
        }

        hole.wolfType = wolfType;
        hole.wolfTeam1 = wolfTeam1;
        hole.wolfTeam2 = wolfTeam2;
        setWolfModalErrorMessage(null);
        setShowWolfTeamModal(false);
        saveGame();
    };

    const getWolfTeamName = (player: Player) => {
        if (wolfTeam1?.filter(p => p.order === player.order)?.length > 0) {
            return wolfType === WolfType.blind ? 'Blind Wolf' : 'Team 1';
        } else if (wolfTeam2?.filter(p => p.order === player.order)?.length > 0) {
            return 'Team 2';
        }
    };

    const getTeamClassName = (teamName: string) => {
        switch (teamName) {
            case 'Team 1':
                return 'wolf-team-name-1';
            case 'Team 2':
                return 'wolf-team-name-2';
            case 'Blind Wolf':
                return 'wolf-team-name-blind';
            default:
                return '';
        }
    };

    const hasScore = (player: Player) => {
        let hasScore = false;
        let ps = playerScores.filter(ps => ps.player.order === player.order);
        if (ps && ps.length > 0) {
            hasScore = ps[0].strokes > 0 ? true : false;
            if (ps[0].walkedBy?.length > 0 && ps[0].putts < 1) return false;
        }
        return hasScore;
    };

    const hasSnake = (player: Player) => {
        let hasSnake = false;
        if (game?.snakeSettings?.enabled && playerScores?.length > 0) {
            const playerScore = playerScores?.filter(ps => ps.player.order === player.order);
            const threePuttHoles = game?.holes?.filter(h => h?.playerScores?.length > 0 && h?.playerScores?.filter(ps => ps?.putts > 2)?.length > 0);
            if (playerScore?.length > 0 && threePuttHoles?.length > 0) {
                if (game?.snakeSettings?.frequency === SnakeFrequency.perEighteen) {
                    const lastThreePuttHole = threePuttHoles?.reduce((max, hole) => hole.number > max.number ? hole : max, threePuttHoles[0]);
                    if (lastThreePuttHole?.number === holeNumber) {
                        hasSnake = playerScore[0].putts > 2 ? true : false;
                    }
                } else if (game?.snakeSettings?.frequency === SnakeFrequency.perNine) {
                    if (holeNumber <= 9) {
                        const lastThreePuttHoleOnFront9 = threePuttHoles?.filter(h => h.number <= 9)?.reduce((max, hole) => hole.number > max.number ? hole : max, threePuttHoles[0]);
                        if (lastThreePuttHoleOnFront9?.number === holeNumber) {
                            hasSnake = playerScore[0].putts > 2 ? true : false;
                        }
                    } else if (holeNumber > 9) {
                        const lastThreePuttHoleOnBack9 = threePuttHoles?.filter(h => h.number > 9)?.reduce((max, hole) => hole.number > max.number ? hole : max, threePuttHoles[0]);
                        if (lastThreePuttHoleOnBack9?.number === holeNumber) {
                            hasSnake = playerScore[0].putts > 2 ? true : false;
                        }
                    }
                }
            }
        }

        return hasSnake;
    };

    const checkSetSandy = () => {
        if (sandy) {
            setSandy(!sandy);
            setScoreModalErrorMessage(null);
        }
        kp ? setScoreModalErrorMessage(`Impossible to have both a Sandy and KP`) : setSandy(!sandy);
    };

    const checkSetKp = () => {
        let ps = hole.playerScores.filter(ps => ps.kp === true);
        if (kp) {
            setKp(!kp);
            setScoreModalErrorMessage(null);
        } else {
            if (ps.length > 0 && ps[0].player.order !== playerScoreModal.order) {
                setScoreModalErrorMessage(`${ps[0].player.name} already has a KP`)
                setKp(false);
            }
            else {
                sandy ? setScoreModalErrorMessage(`Impossible to have both a KP and sandy`) : setKp(!kp);
            }
        }
    };

    const showScoreModal = (player: Player) => {
        setHoleErrorMessage(null);
        setStrokes(0);
        setPutts(0);
        setSandy(false);
        setKp(false);
        setWalked(false);
        setWalkedBy([]);

        player && playerScores?.map((ps) => {
            if (ps.player?.order === player.order) {
                setStrokes(ps.strokes);
                setPutts(ps.putts);
                ps.sandy && setSandy(ps.sandy);
                ps.kp && setKp(ps.kp);
                setWalked(ps.walkedBy.length > 0);
                let walkedBy = [];
                ps.walkedBy.map((p) => walkedBy.push(p.order));
                setWalkedBy(walkedBy);
            }
        });

        let otherPlayers: Player[] = [];
        players && player && players.map((p) => { if (p.order !== player.order) otherPlayers.push(p) });
        setWalkedByOptions(otherPlayers);

        setPlayerScoreModal(player);
    };

    const hideScoreModal = () => {
        setScoreModalErrorMessage(null);
        setPlayerScoreModal(null);
        saveGame();
    };

    const setPlayerScore = (player: Player) => {
        if (!strokes || strokes < 1) {
            setScoreModalErrorMessage('Enter number of strokes');
            return;
        }

        if (walked) {
            if (walkedBy.length < 1) {
                setScoreModalErrorMessage('Enter walked by players');
                return;
            }
        }

        let scores = playerScores || Array<PlayerScore>();
        _.remove(scores, { player: player });
        if (game?.snakeSettings?.enabled) { /* if snake off losers are already set, reset them when a score is updated */
            game.snakeSettings.snakeOffLoser = null;
            game.snakeSettings.snakeOffFrontNineLoser = null;
            game.snakeSettings.snakeOffBackNineLoser = null;
        }

        let playerScore: PlayerScore = {
            player,
            holeNumber,
            strokes,
            putts,
            sandy,
            kp,
            walkedBy: [],
        };
        if (walked) {
            walkedBy?.map((playerOrder) => {
                let walkedByPlayer = _.find(players, { order: playerOrder });
                playerScore.walkedBy.push(walkedByPlayer);
            });
        } else {
            setWalkedBy([]);
        }

        scores.push(playerScore);
        setPlayerScores(scores);

        showScoreModal(null);
        setScoreModalErrorMessage(null);
        saveGame();
    };

    const backToHoles = () => {
        saveGame();
        router.push(`/game/${game.id}`);
    };

    const previousHole = () => {
        saveGame();
        router.push(`/game/${game.id}/hole/${holeNumber - 1}`);
    };

    const nextHole = () => {
        saveGame();
        router.push(`/game/${game.id}/hole/${holeNumber + 1}`);
    };

    const saveGame = () => {
        if (!game?.holes[holeNumber - 1]) game.holes[holeNumber - 1] = hole;
        setGame(game);
        storage.set(`game${gameId}`, game);
    }

    return (
        <div>
            <div className="backLink margin-bottom-15">
                <Link href="#"   onClick={(event) => {
                    event.preventDefault();
                    backToHoles();
                }}>&lt; Back to holes</Link>
            </div>
            <SummaryControl game={game} />
            <div className="center-title">
                Hole {holeNumber}
            </div>

            <div className="par-input">
                <div>Par </div>
                <div>
                    <InputNumber type="number"
                        onChange={(e) => {
                            setPar(e);
                            hole.par = e;
                            setHole(hole);
                        }}
                        onFocus={(e) => e.target.select()}
                        onKeyPress={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                        value={par}
                        defaultValue={hole?.par}
                        size="large"
                        min={3} max={5}
                    />
                </div>
            </div>

            <div className="set-wolf-teams">
                {wolfTeam1?.length > 0 ? <Button className='button' onClick={showWolfModal}>
                    Edit Wolf Teams
                </Button> : <Button className='button dark-blue' onClick={showWolfModal}>
                    Set Wolf Teams
                </Button>}
            </div>

            <div className="margin-bottom-25">
                {players?.map((player, index) => (
                    <div key={index} className="score-input-button-section">
                        <div className="score-input-button-container">
                            {getWolfTeamName(player) && <div className={getTeamClassName(getWolfTeamName(player))}>{getWolfTeamName(player)}</div>}
                            <div className="score-input-player-name">
                                {player.name}
                                {hasSnake(player) && <div className="score-input-snake"><Image src={SnakeIcon} alt="snake" /></div>}
                            </div>
                            <div>
                                {hasScore(player) ?
                                    <Button className='button' onClick={() => showScoreModal(player)}>
                                        {playerScores?.filter(ps => ps.player.order === player.order)[0].strokes} Strokes
                                    </Button> :
                                    <Button className='button dark-blue' onClick={() => showScoreModal(player)}>
                                        Enter Score
                                    </Button>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {holeErrorMessage && <div className="center errorMessage">{holeErrorMessage}</div>}

            <div className="center margin next-button-container">
                {hole?.number > 1 && (<Button className='button previous-hole' onClick={previousHole}>Back</Button>)}
                &nbsp;&nbsp;&nbsp;&nbsp;
                {hole?.number < 18 && (<Button className='button next-hole' onClick={nextHole}>Next</Button>)}
            </div>

            <Modal open={showWolfTeamModal}
                onCancel={() => setShowWolfTeamModal(false)}
                onOk={setWolfTeams}>
                <div className="center wolf-modal">
                    <div className="center-title">Wolf Settings</div>
                    <Radio.Group size="large"
                        defaultValue={WolfType.none}
                        value={wolfType}
                        onChange={(e) => selectWolfType(e.target.value)}>
                        <Radio.Button value={WolfType.team}>Team</Radio.Button>
                        <Radio.Button value={WolfType.blind}>Blind</Radio.Button>
                        <Radio.Button value={WolfType.none}>No Wolf</Radio.Button>
                    </Radio.Group>
                    {wolfType && (wolfType === WolfType.team || wolfType === WolfType.blind) && <>
                        <div className="margin-top-15">
                            {wolfType !== WolfType.blind && <>Team 1:&nbsp;</>}
                            {wolfType === WolfType.blind && <>Blind Wolf:&nbsp;</>}
                            <Select mode="multiple" style={{ width: '60%' }} size="large"
                                showSearch={false}
                                options={wolfTeam1Options?.map((p) => ({ label: p.name, value: p.order }))}
                                onChange={selectWolfTeam1}
                                open={openWolfTeamDropdown}
                                onSelect={wolfTeamDropdownSelected}
                                onClick={wolfTeamDropdownClicked}
                                value={wolfTeam1?.map((p) => ({ label: p.name, value: p.order }))} /></div><div className="margin-top-15">Team 2:&nbsp;
                            <Select mode="multiple" style={{ width: '60%' }} size="large"
                                disabled={true}
                                options={wolfTeam2Options?.map((p) => ({ label: p.name, value: p.order }))}
                                value={wolfTeam2?.map((p) => ({ label: p.name, value: p.order }))} />
                        </div>
                    </>}
                    {wolfModalErrorMessage && <div className="errorMessage">{wolfModalErrorMessage}</div>}
                </div>
            </Modal>

            <Modal open={playerScoreModal !== null}
                onCancel={hideScoreModal}
                onOk={() => setPlayerScore(playerScoreModal)}>
                <br /><br />
                <div className="center score-modal">
                    <div className="center-title">Hole {holeNumber}</div>
                    <div className="center-title">{playerScoreModal?.name} Score</div>
                    <div className="score-inputs">
                        <div className="label">Strokes:</div>
                        <div className="input">
                            <InputNumber type="number"
                                //onChange={setStrokes}
                                onChange={(e) => setStrokes(e)}
                                onFocus={(e) => e.target.select()}
                                onKeyPress={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                                defaultValue={strokes}
                                value={strokes}
                                size="large"
                                min={1} />
                        </div>
                        <br />
                        <div className="label">Putts:</div>
                        <div className="input">
                            <InputNumber type="number" size="large"
                                //onChange={(e) => setPutts(parseInt(e))}
                                onChange={(e) => setPutts(e)}
                                onFocus={(e) => e.target.select()}
                                onKeyPress={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                                defaultValue={putts}
                                value={putts}
                                min={0}
                            />
                        </div><br />
                        <div className="label">Walked</div>
                        <div className="input"><Switch checked={walked} onChange={() => setWalked(!walked)} /></div>
                        <br />
                        {walked && (<div>
                            <div className="label">Walked By:</div>
                            <Select mode="multiple" size="large"
                                showSearch={false}
                                style={{ width: '100px' }}
                                options={walkedByOptions?.map((p) => ({ label: p.name, value: p.order }))}
                                onChange={setWalkedBy} value={walkedBy} />
                            <br />
                        </div>)}
                        <br />
                        <div className="label">Sandy</div>
                        <div className="input"><Switch checked={sandy} onChange={checkSetSandy} /></div>
                        <br /><br />
                        <div className="label">KP</div>
                        <div className="input"><Switch checked={kp} onChange={checkSetKp} /></div>
                        <br /><br />
                        {scoreModalErrorMessage && <div className="errorMessage">{scoreModalErrorMessage}</div>}
                    </div>
                </div>
            </Modal>
        </div>
    )
}
