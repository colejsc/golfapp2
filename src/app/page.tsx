'use client'

import '@ant-design/v5-patch-for-react-19';
import { useEffect, useState } from 'react';
// import { ClientSafeProvider, getProviders, signIn } from 'next-auth/react';
import { Button, Table } from 'antd';
import Link from 'next/link';
import { Game, Games } from '../app/types';
import { getMockGame, getMockGames } from '../lib/mock-data';
import { GetLocalStorage } from '../lib/localstorage';
import Layout from './layout';
import { useRouter } from "next/navigation";

//const storage = GetLocalStorage();

export default function IndexPage() {
  const router = useRouter();
  const [storage, setStorage] = useState<ReturnType<
    typeof GetLocalStorage
  > | null>(null);
  const [allGames, setAllGames] = useState<Array<Game>>([]);

  const createGame = (e) => {
    router.push(`/game/new`);
  }
  //allGames = getMockGames(7);

  useEffect(() => {
    setStorage(GetLocalStorage());
    let games = storage?.get('GolfAppGames') as Games;
    if (games) {
      let all: Array<Game> = [];
      for (let i = 1; i <= games.maxId; i++) {
        const game = storage.get(`game${i}`) as Game;
        if (game) all.push(game);
      }
      setAllGames(all);
    }
  }, [storage, setStorage]);

  const tableColumns = [
    {
      title: "Course",
      dataIndex: "courseName",
      key: "courseName",
      sorter: (a, b) => (a.courseName > b.courseName ? 1 : -1),
      render: (name, record) => {
        return (
          <Link href="/game/[id]" as={`/game/${record.id}`}>{name}</Link>
        )
      }
    },
    {
      title: "Date",
      dataIndex: "dateCreated",
      key: "dateCreated",
      sorter: (a, b) => (a.dateCreated > b.dateCreated ? 1 : -1),
      render: (name, record) => {
        const date = <>{new Date(name).toLocaleDateString()}</>;
        return (
          <Link href="/game/[id]" as={`/game/${record.id}`}>{name}</Link>
        )
      }
    },
  ];

  return (
    <div>
      <h1 className="center">Golf App</h1>
      <div className="center">
        <Button className="button" onClick={createGame}>New Game</Button>
      </div>
      <br /><br />
      {allGames?.length > 0 && (<Table
        rowKey={record => record.id}
        dataSource={allGames}
        columns={tableColumns}
      />)}
    </div>
  );
}