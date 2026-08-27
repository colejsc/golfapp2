'use client'
import { Button, Card, Input } from "antd";
// import Layout from "@/app/components/layout"
import { DefaultValues, Game, Games, Hole, Player, SnakeFrequency } from '@/app/types';
import { useEffect, useState } from "react";
import _ from 'lodash';
import { GetLocalStorage } from "@/lib/localstorage";

import { useRouter } from "next/navigation";

// const storage = GetLocalStorage();   

export default function NewGamePage() {
    const router = useRouter();
    const [storage, setStorage] = useState<ReturnType<
        typeof GetLocalStorage
    > | null>(null);
    const [players, setPlayers] = useState<Player[]>(new Array(4).fill(null).map((_, i) => ({
        order: i + 1,
        name: 'Player ' + (i + 1)
    })));
    const [course, setCourse] = useState<string>('course1');

    let defaultValues: DefaultValues;

    useEffect(() => {
        setStorage(GetLocalStorage());
        fetch(`/api/defaults`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', },
        }).then((res) => {
            if (res.status === 200) {
                res.json().then(res => {
                    defaultValues = res as DefaultValues
                    if (defaultValues) {
                        setPlayers([
                            { order: 1, name: defaultValues.player1Name } as Player,
                            { order: 2, name: defaultValues.player2Name } as Player,
                            { order: 3, name: defaultValues.player3Name } as Player,
                            { order: 4, name: defaultValues.player4Name } as Player
                        ]);
                        setCourse(defaultValues.courseName);
                    }
                });
            }
        });
    }, [setStorage]);

    const addPlayer = (e: any) => {
        let p = [...players];
        p.push({ order: players.length + 1, name: 'Player ' + Number(players.length + 1) });
        setPlayers(p);
    };

    const setPlayerName = (e: any, player: Player) => {
        let ps = [...players];
        let p = _.find(ps, { order: player.order });
        p.name = e.target.value;
        setPlayers(ps);
    };

    const removePlayer = (player: Player) => {
        let p = [...players];
        _.remove(p, { order: player.order });
        for (let i = 0; i < p.length; i++) p[i].order = i + 1;
        setPlayers(p);
    };

    const begin = (e: any) => {
        let games = storage.get('GolfAppGames') as Games;
        const id = games ? games.maxId + 1 : 1;
        let game: Game = {
            id,
            players: players,
            courseName: course,
            name: course + ' on ' + new Date().toLocaleDateString(),
            holes: new Array<Hole>(18),
            skinValue: 1,
            snakeSettings: { enabled: true, value: 5, frequency: SnakeFrequency.perNine },
            walkSuccessValue: 20,
            walkFailValue: 5,
            dateCreated: new Date().toLocaleString()
        };
        storage.set(`GolfAppGames`, { maxId: id });
        storage.set(`game${game.id}`, game);
        // if (typeof window !== 'undefined') 
        //     window.location.href = `/game/${game.id}`;
         router.push(`/game/${game.id}`);
        // useEffect(() => {
        //     location.href = `/game/${game.id}`;
        // }, []);
    };

    return (
        <div>
            {players.length <= 3 && <div><Button className='button' onClick={addPlayer}>Add Player</Button><br /><br /><br /></div>}
            {players.map(function (player, key) {
                return (
                    <div key={key} className="margin-bottom-15">
                        Player {key + 1}:&nbsp;&nbsp;
                        <span className="player-input">
                            <Input defaultValue={player.name} value={player.name} onChange={(e) => setPlayerName(e, player)} />
                            <Button onClick={() => removePlayer(player)}>X</Button>
                        </span>
                    </div>
                )
            })}

            Course Name: <Input defaultValue={course} value={course} onChange={(e) => setCourse(e.target.value)} /><br /><br />
            <div className="center">
                <Button className='button' onClick={begin}>Start Game</Button>
            </div>
        </div>
    )
}