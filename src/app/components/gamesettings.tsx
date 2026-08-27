import { Select, Button, Spin, Modal, Input, Switch, InputNumber } from 'antd'
import { JSX, useEffect, useState } from 'react';
import { Game, Player, SnakeFrequency, calculateScore } from '@/app/types'
import { useParams, useRouter } from 'next/navigation';
import { GetLocalStorage } from '@/lib/localstorage';


export default function GameSettingsControl(
    props: {
        game: Game,
    }): JSX.Element {
    const { game } = props;
    const router = useRouter();
    const { id: gameId } = useParams(); 
    const [showGameSettingsModal, setShowGameSettingsModal] = useState(false);
    const [courseName, setCourseName] = useState(game?.courseName);
    const [skinValue, setSkinValue] = useState(game?.skinValue);
    const [snakeEnabled, setSnakeEnabled] = useState(game?.snakeSettings?.enabled);
    const [snakeValue, setSnakeValue] = useState(game?.snakeSettings?.value);
    const [snakeFrequency, setSnakeFrequency] = useState(game?.snakeSettings?.frequency);
    const [walkSuccessValue, setWalkSuccessValue] = useState(game?.walkSuccessValue);
    const [walkFailValue, setWalkFailValue] = useState(game?.walkFailValue);

    useEffect(() => {
        setCourseName(game?.courseName);
        setSkinValue(game?.skinValue);
        setSnakeEnabled(game?.snakeSettings?.enabled);
        setSnakeValue(game?.snakeSettings?.value);
        setSnakeFrequency(game?.snakeSettings?.frequency);
        setWalkSuccessValue(game?.walkSuccessValue);
        setWalkFailValue(game?.walkFailValue);
    }, [game]);

    const updateGameSettings = () => {
        game.courseName = courseName;
        game.skinValue = skinValue;
        game.snakeSettings = { enabled: snakeEnabled, value: snakeValue, frequency: snakeFrequency };
        game.walkSuccessValue = walkSuccessValue;
        game.walkFailValue = walkFailValue;

        const storage = GetLocalStorage();
        storage.set(`game${gameId}`, game);
        setShowGameSettingsModal(false);
        //router.reload();
    };


    return (
        <div className="game-settings">
            <div className="game-settings-link">
                <span onClick={() => setShowGameSettingsModal(true)}>Game Settings</span>
            </div>

            <Modal open={showGameSettingsModal}
                onCancel={() => setShowGameSettingsModal(false)}
                onOk={updateGameSettings}>
                <div className="center game-settings">
                    <h2>Game Settings</h2>
                    <div className="game-settings-section">
                        <div className="game-settings-label">Course Name:</div>
                        <div className="game-settings-input">
                            <Input
                                onChange={(e) => setCourseName(e.target.value)}
                                onFocus={(e) => e.target.select()}
                                onKeyPress={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                                value={courseName} />
                        </div>
                    </div>
                    <div className="game-settings-section">
                        <div className="game-settings-label">Skin Value:</div>
                        <div className="game-settings-input">
                            <span className="dollar-sign-input">$</span>
                            <InputNumber type="number" size="large"
                                //onChange={(e) => setSkinValue(parseInt(e))}
                                onChange={(e) => setSkinValue(e)}
                                onFocus={(e) => e.target.select()}
                                onKeyPress={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                                defaultValue={skinValue}
                                value={skinValue}
                                min={1}
                            />
                        </div>
                    </div>
                    <div className="game-settings-section">
                        <div className="game-settings-label">Snake Enabled</div>
                        <div className="game-settings-input"><Switch checked={snakeEnabled} onChange={() => setSnakeEnabled(!snakeEnabled)} /></div>
                    </div>
                    {snakeEnabled && (<div>
                        <div className="game-settings-section">
                            <div className="game-settings-label">Snake Value</div>
                            <div className="game-settings-input">
                                <span className="dollar-sign-input">$</span>
                                <InputNumber type="number" size="large"
                                    //onChange={(e) => setSnakeValue(parseInt(e))}
                                    onChange={(e) => setSnakeValue(e)}
                                    onFocus={(e) => e.target.select()}
                                    onKeyPress={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                                    defaultValue={snakeValue}
                                    value={snakeValue}
                                    min={0}
                                />
                            </div>
                        </div>
                        <div className="game-settings-section">
                            <div className="game-settings-label">Snake Frequency:</div>
                            <div className="game-settings-input">
                                <Select size="large"
                                    showSearch={false}
                                    onChange={(e) => setSnakeFrequency((e))}
                                    options={Object.values(SnakeFrequency).map(value => ({ value, label: value }))}
                                    value={snakeFrequency}
                                    defaultValue={snakeFrequency}
                                />
                            </div>
                        </div>
                    </div>)}
                    <div className="game-settings-section">
                        <div className="game-settings-label">Walk Fail<br />(3+ putts)</div>
                        <div className="game-settings-input">
                            <span className="dollar-sign-input">$</span>
                            <InputNumber type="number" size="large"
                                //onChange={(e) => setWalkFailValue(parseInt(e))}
                                onChange={(e) => setWalkFailValue(e)}
                                onFocus={(e) => e.target.select()}
                                onKeyPress={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                                defaultValue={walkFailValue}
                                value={walkFailValue}
                                min={0} />
                        </div>
                    </div>
                    <div className="game-settings-section">
                        <div className="game-settings-label">Walk Success<br />(1 putt)</div>
                        <div className="game-settings-input">
                            <span className="dollar-sign-input">$</span>
                            <InputNumber type="number" size="large"
                                //onChange={(e) => setWalkSuccessValue(parseInt(e))}
                                onChange={(e) => setWalkSuccessValue(e)}
                                onFocus={(e) => e.target.select()}
                                onKeyPress={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                                defaultValue={walkSuccessValue}
                                value={walkSuccessValue}
                                min={0} />
                        </div>
                    </div>
                    <br />
                </div>
            </Modal>
        </div>
    )
}
