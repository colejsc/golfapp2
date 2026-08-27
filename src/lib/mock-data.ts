import { Game, PlayerScore, SnakeFrequency } from '../app/types'

export function getMockGame(): Game {
    let game: Game = <Game>{};
    game.id = 1;
    game.courseName = 'mock course 1';
    game.name = 'mock game 1';
    game.players = [{ name: 'player1', order: 1 }, { name: 'player2', order: 2 }, { name: 'player3', order: 3 }, { name: 'player4', order: 4 }];
    game.skinValue = 1;
    game.snakeSettings = { enabled: true, value: 5, frequency: SnakeFrequency.perNine };
    game.walkSuccessValue = 20;
    game.walkFailValue = 5;
    game.dateCreated = new Date().toLocaleDateString();
    return game;
}

export function getMockGames(howMany: number): Game[] {

    const games: Game[] = [];

    if (howMany < 1) {
        howMany = 1
    } else if (howMany > 10) {
        howMany = 11;
    }

    for (let i = 1; i < howMany; i++) {
        let game: Game = <Game>{};
        game.id = i;
        game.courseName = `mock course ${i}`;
        game.name = `mock course ${i}`;
        game.players = [{ name: 'player1', order: 1 }, { name: 'player2', order: 2 }, { name: 'player3', order: 3 }, { name: 'player4', order: 4 }];
        game.skinValue = 1;
        game.snakeSettings = { enabled: true, value: 5, frequency: SnakeFrequency.perNine };
        game.walkSuccessValue = 20;
        game.walkFailValue = 5;
        game.dateCreated = new Date().toLocaleDateString();
        games.push(game);
    }

    return games;
}

