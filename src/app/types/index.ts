import * as _ from 'lodash';

export type Games = {
  maxId: number;
}

export type DefaultValues = {
  player1Name: string;
  player2Name: string;
  player3Name: string;
  player4Name: string;
  courseName: string;
}

export type Game = {
  id: number;
  name: string;
  courseName: string;
  players: Array<Player>;
  holes: Array<Hole>;
  skinValue: number;
  snakeSettings?: SnakeSettings
  walkSuccessValue: number;
  walkFailValue: number;
  dateCreated: string;
}

export type SnakeSettings = {
  enabled: boolean;
  value?: number;
  frequency?: SnakeFrequency;
  snakeOffLoser?: Player;
  snakeOffFrontNineLoser?: Player;
  snakeOffBackNineLoser?: Player;
}

export type Hole = {
  number: number;
  par: number;
  playerScores: Array<PlayerScore>;
  wolfType?: WolfType;
  wolfTeam1?: Array<Player>;
  wolfTeam2?: Array<Player>;
}

export type PlayerScore = {
  player: Player;
  holeNumber: number;
  strokes: number;
  putts?: number
  sandy?: boolean;
  kp?: boolean;
  walkedBy?: Array<Player>;
}

export function GetEmptyPlayerScore(player: Player, holenumber: number): PlayerScore {
  return { player, holeNumber: holenumber, strokes: 0, putts: 0, walkedBy: [] };
}

export type Player = {
  order: number;
  name: string;
}

export enum WolfType {
  none = 'none',
  team = 'team',
  blind = 'blind',
}

export enum SnakeFrequency {
  perNine = 'Per 9',
  perEighteen = 'Per 18',
}

export class GameResult {
  player1Skins: number = 0;
  player2Skins: number = 0;
  player3Skins: number = 0;
  player4Skins: number = 0;

  walk_player1OwesPlayer2: number = 0;
  walk_player1OwesPlayer3: number = 0;
  walk_player1OwesPlayer4: number = 0;
  walk_player2OwesPlayer3: number = 0;
  walk_player2OwesPlayer4: number = 0;
  walk_player3OwesPlayer4: number = 0;

  snake_player1OwesPlayer2: number = 0;
  snake_player1OwesPlayer3: number = 0;
  snake_player1OwesPlayer4: number = 0;
  snake_player2OwesPlayer3: number = 0;
  snake_player2OwesPlayer4: number = 0;
  snake_player3OwesPlayer4: number = 0;

  log: string = '';

  constructor() {
  }

  addSkin = (player: Player, wolfType: WolfType) => {
    switch (player?.order) {
      case 1: {
        this.player1Skins++;
        if (wolfType === WolfType.blind) this.player1Skins++;
        break;
      }
      case 2: {
        this.player2Skins++;
        if (wolfType === WolfType.blind) this.player2Skins++;
        break;
      }
      case 3: {
        this.player3Skins++;
        if (wolfType === WolfType.blind) this.player3Skins++;
        break;
      }
      case 4: {
        this.player4Skins++;
        if (wolfType === WolfType.blind) this.player4Skins++;
        break;
      }
    }
  };

  calculateWalk = (game: Game, player: Player, walkedBy: Array<Player>, putts: number) => {
    walkedBy.forEach((walkedByPlayer) => {
      if (putts === 1) { /* player gets 20 from each in walkedBy */
        this.log += `${walkedByPlayer.name} walked ${player.name} and must pay $${game.walkSuccessValue}<br>`;
        switch (player.order) {
          case 1: {
            if (walkedByPlayer.order === 2) {
              this.walk_player1OwesPlayer2 -= game.walkSuccessValue;
            } else if (walkedByPlayer.order === 3) {
              this.walk_player1OwesPlayer3 -= game.walkSuccessValue;
            } else if (walkedByPlayer.order === 4) {
              this.walk_player1OwesPlayer4 -= game.walkSuccessValue;
            }
            break;
          }
          case 2: {
            if (walkedByPlayer.order === 1) {
              this.walk_player1OwesPlayer2 += game.walkSuccessValue;
            } else if (walkedByPlayer.order === 3) {
              this.walk_player2OwesPlayer3 -= game.walkSuccessValue;
            } else if (walkedByPlayer.order === 4) {
              this.walk_player2OwesPlayer4 -= game.walkSuccessValue;
            }
            break;
          }
          case 3: {
            if (walkedByPlayer.order === 1) {
              this.walk_player1OwesPlayer3 += game.walkSuccessValue;
            } else if (walkedByPlayer.order === 2) {
              this.walk_player2OwesPlayer3 += game.walkSuccessValue;
            } else if (walkedByPlayer.order === 4) {
              this.walk_player3OwesPlayer4 -= game.walkSuccessValue;
            }
            break;
          }
          case 4: {
            if (walkedByPlayer.order === 1) {
              this.walk_player1OwesPlayer4 += game.walkSuccessValue;
            } else if (walkedByPlayer.order === 2) {
              this.walk_player2OwesPlayer4 += game.walkSuccessValue;
            } else if (walkedByPlayer.order === 3) {
              this.walk_player3OwesPlayer4 += game.walkSuccessValue;
            }
            break;
          }
        }
      } else if (putts >= 3) { /* player pays 5 to each in walkedBy */
        this.log += `${walkedByPlayer.name} walked ${player.name} and collects $${game.walkFailValue}<br>`
        switch (player.order) {
          case 1: {
            if (walkedByPlayer.order === 2) {
              this.walk_player1OwesPlayer2 += game.walkFailValue;
            } else if (walkedByPlayer.order === 3) {
              this.walk_player1OwesPlayer3 += game.walkFailValue;
            } else if (walkedByPlayer.order === 4) {
              this.walk_player1OwesPlayer4 += game.walkFailValue;
            }
            break;
          }
          case 2: {
            if (walkedByPlayer.order === 1) {
              this.walk_player1OwesPlayer2 -= game.walkFailValue;
            } else if (walkedByPlayer.order === 3) {
              this.walk_player2OwesPlayer3 += game.walkFailValue;
            } else if (walkedByPlayer.order === 4) {
              this.walk_player2OwesPlayer4 += game.walkFailValue;
            }
            break;
          }
          case 3: {
            if (walkedByPlayer.order === 1) {
              this.walk_player1OwesPlayer3 -= game.walkFailValue;
            } else if (walkedByPlayer.order === 2) {
              this.walk_player2OwesPlayer3 -= game.walkFailValue;
            } else if (walkedByPlayer.order === 4) {
              this.walk_player3OwesPlayer4 += game.walkFailValue;
            }
            break;
          }
          case 4: {
            if (walkedByPlayer.order === 1) {
              this.walk_player1OwesPlayer4 -= game.walkFailValue;
            } else if (walkedByPlayer.order === 2) {
              this.walk_player2OwesPlayer4 -= game.walkFailValue;
            } else if (walkedByPlayer.order === 3) {
              this.walk_player3OwesPlayer4 -= game.walkFailValue;
            }
            break;
          }
        }
      }
    });
  };
}

const birdieCheckWolf = (result: GameResult, hole: Hole) => {
  /* if one player gets a birdie or less all players on team get a skin */
  const birdiePlayers = hole?.playerScores?.filter(ps => ps.strokes < hole?.par && hole?.playerScores?.includes(ps))?.map(ps => ps.player);
  if (birdiePlayers?.length > 0) {
    const birdiePlayersOnTeam1 = hole?.wolfTeam1.filter(wp => birdiePlayers.some(p => p.order === wp.order));
    if (birdiePlayersOnTeam1?.length > 0) {
      hole?.wolfTeam1.forEach(p => result.addSkin(p, hole?.wolfType));
      result.log += `${birdiePlayersOnTeam1.map(p => p.name).join(', ')} got a birdie, ${hole?.wolfType === WolfType.blind ? '2' : '1'} skin${hole?.wolfType === WolfType.blind ? 's' : ''} to ${hole?.wolfTeam1?.map(p => p.name).join(', ')}<br>`;
    }
    const birdiePlayersOnTeam2 = hole?.wolfTeam2.filter(wp => birdiePlayers.some(p => p.order === wp.order));
    if (birdiePlayersOnTeam2?.length > 0) {
      hole?.wolfTeam2.forEach(p => result.addSkin(p, hole?.wolfType));
      result.log += `${birdiePlayersOnTeam2.map(p => p.name).join(', ')} got a birdie, ${hole?.wolfType === WolfType.blind ? '2' : '1'} skin${hole?.wolfType === WolfType.blind ? 's' : ''} to ${hole?.wolfTeam2?.map(p => p.name).join(', ')}<br>`;
    }
  }
};
/* extra skin for sandy for all on winning team */
const sandyCheckWolf = (result: GameResult, hole: Hole, winningTeam: Player[]) => {
  const sandyPlayers = hole?.playerScores?.filter(ps => ps.sandy && winningTeam?.some(p => p.order === ps.player.order))?.map(ps => ps.player);
  if (sandyPlayers?.length > 0) {
    if (winningTeam.length === 1) { /* solo gets 1 skin for each player on other team */
      let otherTeamSize = (hole.playerScores?.length - 1);
      result.log += `${winningTeam[0].name} got a sandy, ${hole?.wolfType === WolfType.blind ? otherTeamSize * 2 : otherTeamSize} skins to ${winningTeam.map(p => p.name).join(', ')}<br>`;
      new Array(otherTeamSize).fill(null).forEach(() => result.addSkin(winningTeam[0], hole?.wolfType));
    } else {
      result.log += `${sandyPlayers.map(p => p.name).join(', ')} got a sandy, ${hole?.wolfType === WolfType.blind ? '2' : '1'} skin${hole?.wolfType === WolfType.blind ? 's' : ''} to ${winningTeam.map(p => p.name).join(', ')}<br>`;
      winningTeam?.forEach(p => result.addSkin(p, hole?.wolfType));
    }
  }
};

/* extra skin for kp for all on winning team */
const kpCheckWolf = (result: GameResult, hole: Hole, winningTeam: Player[]) => {
  const kpPlayers = hole?.playerScores?.filter(ps => ps.kp && winningTeam?.some(p => p.order === ps.player.order))?.map(ps => ps.player);
  if (kpPlayers?.length > 0) {
    if (winningTeam.length === 1) { /* solo gets 1 skin for each player on other team */
      let otherTeamSize = (hole.playerScores?.length - 1);
      result.log += `${winningTeam[0].name} got a kp, ${hole?.wolfType === WolfType.blind ? otherTeamSize * 2 : otherTeamSize} skins to ${winningTeam.map(p => p.name).join(', ')}<br>`;
      new Array(otherTeamSize).fill(null).forEach(() => result.addSkin(winningTeam[0], hole?.wolfType));
    } else {
      result.log += `${kpPlayers.map(p => p.name).join(', ')} got a kp, ${hole?.wolfType === WolfType.blind ? '2' : '1'} skin${hole?.wolfType === WolfType.blind ? 's' : ''} to ${winningTeam.map(p => p.name).join(', ')}<br>`;
      winningTeam?.forEach(p => result.addSkin(p, hole?.wolfType));
    }
  }
};

const calculateWolfSkins = (result: GameResult, hole: Hole) => {
  if (hole?.wolfTeam1?.length === 0 || hole?.wolfTeam2?.length === 0) {
    //console.log('Wolf teams not set, cannot calculate skins');
  }
  if (hole?.wolfTeam1?.length === hole?.wolfTeam2?.length) {/* each team has 2 players */
    const sumWolfTeam1Strokes = hole?.wolfTeam1?.reduce((sum, player) => {
      const playerScore = hole?.playerScores?.find(ps => ps.player.order === player.order);
      return sum + (playerScore ? playerScore?.strokes : 0);
    }, 0);

    const sumWolfTeam2Strokes = hole?.wolfTeam2?.reduce((sum, player) => {
      const playerScore = hole?.playerScores?.find(ps => ps.player.order === player.order);
      return sum + (playerScore ? playerScore?.strokes : 0);
    }, 0);

    result.log += `Team 1 has ${sumWolfTeam1Strokes} strokes, Team 2 has ${sumWolfTeam2Strokes} strokes<br>`;

    birdieCheckWolf(result, hole);
    if (sumWolfTeam1Strokes < sumWolfTeam2Strokes) { /* team 1 won */
      result.log += `Team 1 wins, skin to ${hole?.wolfTeam1?.map(p => p.name).join(', ')}<br>`;
      hole?.wolfTeam1?.forEach(p => result.addSkin(p, hole?.wolfType));
      sandyCheckWolf(result, hole, hole?.wolfTeam1);
      kpCheckWolf(result, hole, hole?.wolfTeam1);
    }
    else if (sumWolfTeam1Strokes > sumWolfTeam2Strokes) { /* team 2 won */
      result.log += `Team 2 wins, skin to ${hole?.wolfTeam2?.map(p => p.name).join(', ')}<br>`;
      hole?.wolfTeam2?.forEach(p => result.addSkin(p, hole?.wolfType));
      sandyCheckWolf(result, hole, hole?.wolfTeam2);
      kpCheckWolf(result, hole, hole?.wolfTeam2);
    }
    else { /* tie */
      result.log += 'Tie, no skins awarded<br>';
    }
  } else { /* solo or blind wolf */
    if (hole?.wolfTeam1?.length === 1) { /* team 1 is solo player */
      const soloPlayerScore = hole?.playerScores?.find(ps => ps.player.order === hole?.wolfTeam1[0].order);
      const team2Scores = hole?.playerScores?.filter(ps => hole?.wolfTeam2?.some(player => player.order === ps.player.order));
      const lowestPlayerScoreinTeam2 = team2Scores.reduce((minScore, ps) => ps.strokes < minScore.strokes ? ps : minScore, team2Scores[0]);

      result.log += `${soloPlayerScore?.player.name} is ${hole?.wolfType === WolfType.blind ? `blind` : `solo`} with ${soloPlayerScore?.strokes} strokes<br>`;
      result.log += `On Team 2, ${lowestPlayerScoreinTeam2?.player.name} had the best score with ${lowestPlayerScoreinTeam2?.strokes} strokes<br>`;

      birdieCheckWolf(result, hole);
      if (lowestPlayerScoreinTeam2?.strokes < soloPlayerScore?.strokes) { /* team 2 wins */
        result.log += `Team 2 wins, ${hole?.wolfType === WolfType.blind ? '2' : '1'} skin${hole?.wolfType === WolfType.blind ? 's' : ''} to ${hole?.wolfTeam2?.map(p => p.name).join(', ')}<br>`;
        hole?.wolfTeam2?.forEach(p => result.addSkin(p, hole?.wolfType));
        sandyCheckWolf(result, hole, hole?.wolfTeam2);
        kpCheckWolf(result, hole, hole?.wolfTeam2);
      }
      else if (lowestPlayerScoreinTeam2?.strokes > soloPlayerScore?.strokes) { /* solo player wins */
        result.log += `${soloPlayerScore?.player.name} wins, gets ${hole?.wolfType === WolfType.blind ? team2Scores.length * 2 : team2Scores.length} skins<br>`;
        team2Scores.forEach(() => result.addSkin(soloPlayerScore.player, hole?.wolfType));
        sandyCheckWolf(result, hole, hole?.wolfTeam1);
        kpCheckWolf(result, hole, hole?.wolfTeam1);
      } else {
        result.log += 'Tie, no skins awarded<br>';
      }
    } else if (hole?.wolfTeam2?.length === 1) { /* team 2 is solo player */
      const soloPlayerScore = hole?.playerScores?.find(ps => ps.player.order === hole?.wolfTeam2[0].order);
      const team1Scores = hole?.playerScores?.filter(ps => hole?.wolfTeam1?.some(player => player.order === ps.player.order));
      const lowestPlayerScoreinTeam1 = team1Scores.reduce((minScore, ps) => ps.strokes < minScore.strokes ? ps : minScore, team1Scores[0]);

      result.log += `${soloPlayerScore?.player.name} is ${hole?.wolfType === WolfType.blind ? `blind` : `solo`} with ${soloPlayerScore?.strokes} strokes<br>`;
      result.log += `On Team 1, ${lowestPlayerScoreinTeam1.player.name} had the best score with ${lowestPlayerScoreinTeam1.strokes} strokes<br>`;

      birdieCheckWolf(result, hole);
      if (lowestPlayerScoreinTeam1.strokes < soloPlayerScore?.strokes) { /* team 1 wins */
        result.log += `Team 1 wins, ${hole?.wolfType === WolfType.blind ? '2' : '1'} skin${hole?.wolfType === WolfType.blind ? 's' : ''} to ${hole?.wolfTeam1?.map(p => p.name).join(', ')}<br>`;
        hole?.wolfTeam1?.forEach(p => result.addSkin(p, hole?.wolfType));
        sandyCheckWolf(result, hole, hole?.wolfTeam1);
        kpCheckWolf(result, hole, hole?.wolfTeam1);
      }
      else if (lowestPlayerScoreinTeam1.strokes > soloPlayerScore?.strokes) { /* solo player wins */
        result.log += `${soloPlayerScore?.player.name} wins, gets ${hole?.wolfType === WolfType.blind ? team1Scores.length * 2 : team1Scores.length} skins<br>`;
        team1Scores.forEach(() => result.addSkin(soloPlayerScore.player, hole?.wolfType));
        sandyCheckWolf(result, hole, hole?.wolfTeam2);
        kpCheckWolf(result, hole, hole?.wolfTeam2);
      } else {
        result.log += 'Tie, no skins awarded<br>';
      }
    }
  }
};

const calculateRegularSkins = (result: GameResult, hole: Hole) => {
  /* birdie or less gets a skin regardless of win */
  const playersWithBirdie = hole?.playerScores?.filter(ps => ps.strokes < hole?.par);
  if (playersWithBirdie.length > 0) {
    result.log += `${playersWithBirdie.map(ps => ps.player.name).join(', ')} got a birdie, 1 skin to ${playersWithBirdie.map(ps => ps.player.name).join(', ')}<br>`;
    playersWithBirdie.forEach(ps => result.addSkin(ps.player, hole?.wolfType));
  }

  const lowestPlayerScore = hole?.playerScores?.reduce((minScore, ps) => ps.strokes < minScore.strokes ? ps : minScore, hole?.playerScores[0]);
  const isLowestDuplicate = hole?.playerScores?.filter(ps => ps.strokes === lowestPlayerScore?.strokes).length > 1;
  if (isLowestDuplicate) { /* tie */

    // TODO: implement carry over skins

    result.log += `Hole ${hole?.number} is a tie, no skins awarded<br>`;
  } else {  /* lowest strokes wins */
    if (lowestPlayerScore?.player) {
      if (lowestPlayerScore?.sandy) { /* extra skin for sandy */
        result.log += `${lowestPlayerScore?.player?.name} got a sandy, gets 1 skin<br>`;
        result.addSkin(lowestPlayerScore?.player, hole?.wolfType);
      }

      if (lowestPlayerScore?.kp) { /* extra skin for kp */
        result.log += `${lowestPlayerScore?.player?.name} got a kp, gets 1 skin<br>`;
        result.addSkin(lowestPlayerScore?.player, hole?.wolfType);
      }

      result.log += `${lowestPlayerScore?.player?.name} won with ${lowestPlayerScore?.strokes} strokes and gets 1 skin<br>`;
      result.addSkin(lowestPlayerScore?.player, hole?.wolfType);
    }
  }
};

const setSnakeOwed = (result: GameResult, loser: Player, game: Game) => {
  switch (loser.order) {
    case 1: {
      result.snake_player1OwesPlayer2 += game?.snakeSettings?.value;
      result.snake_player1OwesPlayer3 += game?.snakeSettings?.value;
      result.snake_player1OwesPlayer4 += game?.snakeSettings?.value;
      break;
    }
    case 2: {
      result.snake_player1OwesPlayer2 += -game?.snakeSettings?.value;
      result.snake_player2OwesPlayer3 += game?.snakeSettings?.value;
      result.snake_player2OwesPlayer4 += game?.snakeSettings?.value;
      break;
    }
    case 3: {
      result.snake_player1OwesPlayer3 += -game?.snakeSettings?.value;
      result.snake_player2OwesPlayer3 += -game?.snakeSettings?.value;
      result.snake_player3OwesPlayer4 += game?.snakeSettings?.value;
      break;
    }
    case 4: {
      result.snake_player1OwesPlayer4 += -game?.snakeSettings?.value;
      result.snake_player2OwesPlayer4 += -game?.snakeSettings?.value;
      result.snake_player3OwesPlayer4 += -game?.snakeSettings?.value;
      break;
    }
  }
};

const calculateSnake = (game: Game, result: GameResult) => {
  if (game?.snakeSettings?.enabled) {
    if (game?.snakeSettings?.frequency === SnakeFrequency.perEighteen) {
      let snakeLoser = game?.snakeSettings?.snakeOffLoser;
      if (!snakeLoser) {
        const threePuttHoles = game?.holes?.filter(h => h?.playerScores?.length > 0 && h?.playerScores?.filter(ps => ps?.putts > 2)?.length > 0);
        const lastThreePuttHole = threePuttHoles?.reduce((max, hole) => hole.number > max.number ? hole : max, threePuttHoles[0]);
        const snakePlayers = lastThreePuttHole?.playerScores.filter(ps => ps.putts > 2).map(ps => ps.player);
        if (snakePlayers?.length === 1) snakeLoser = snakePlayers[0];
        /* if multiple players have snake, need to do a snake off and set game.snakeSettings.snakeOffLoser, cannot calculate until it is settled */
      }

      if (snakeLoser) {
        // result.log += `<b>Snake</b><br>`;
        // result.log += `${snakeLoser.name} has the snake and owes each player $${game?.snakeSettings?.value}<br>`;
        setSnakeOwed(result, snakeLoser, game);
      }

    } else if (game?.snakeSettings?.frequency === SnakeFrequency.perNine) {
      let snakeLoserFrontNine = game?.snakeSettings?.snakeOffFrontNineLoser;
      if (!snakeLoserFrontNine) {
        const threePuttHolesOnFront9 = game?.holes?.filter(h => h?.number <= 9)?.filter(h => h?.playerScores?.length > 0 && h?.playerScores?.filter(ps => ps?.putts > 2)?.length > 0);
        const lastThreePuttHoleOnfont9 = threePuttHolesOnFront9?.reduce((max, hole) => hole.number > max.number ? hole : max, threePuttHolesOnFront9[0]);
        const snakePlayersOnFront9 = lastThreePuttHoleOnfont9?.playerScores?.filter(ps => ps.putts > 2).map(ps => ps.player);
        if (snakePlayersOnFront9?.length === 1) snakeLoserFrontNine = snakePlayersOnFront9[0];
        /* if multiple players have snake, need to do a snake off and set game.snakeSettings.snakeOffFrontNineLoser, cannot calculate until it is settled */
      }
      if (snakeLoserFrontNine) {
        // result.log += `<b>Snake - Front Nine</b><br>`;
        // result.log += `${snakeLoserFrontNine.name} has the snake on the front nine and owes each player $${game?.snakeSettings?.value}<br>`;
        setSnakeOwed(result, snakeLoserFrontNine, game);
      }

      let snakeLoserBackNine = game?.snakeSettings?.snakeOffBackNineLoser;
      if (!snakeLoserBackNine) {
        const threePuttHolesOnBack9 = game?.holes?.filter(h => h?.number > 9)?.filter(h => h?.playerScores?.length > 0 && h?.playerScores?.filter(ps => ps?.putts > 2)?.length > 0);
        const lastThreePuttHoleOnBack9 = threePuttHolesOnBack9?.reduce((max, hole) => hole.number > max.number ? hole : max, threePuttHolesOnBack9[0]);
        const snakePlayersOnBack9 = lastThreePuttHoleOnBack9?.playerScores?.filter(ps => ps.putts > 2).map(ps => ps.player);
        if (snakePlayersOnBack9?.length === 1) snakeLoserFrontNine = snakePlayersOnBack9[0];
        /* if multiple players have snake, need to do a snake off and set game.snakeSettings.snakeOffBackNineLoser, cannot calculate until it is settled */
      }

      if (snakeLoserBackNine) {
        // result.log += `<br><b>Snake - Back Nine</b><br>`;
        // result.log += `${snakeLoserBackNine.name} has the snake on the back nine and owes each player $${game?.snakeSettings?.value}<br>`;
        setSnakeOwed(result, snakeLoserBackNine, game);
      }
    }
  }

};

export const calculateScore = (game: Game): GameResult => {
  let result: GameResult = new GameResult();

  game?.holes?.forEach(hole => {
    if (hole && hole?.playerScores?.length === game?.players.length) {
      result.log += `<b>Hole ${hole?.number}</b><br>`;

      if (hole?.wolfType === WolfType.team || hole?.wolfType === WolfType.blind) {
        result.log += `${hole?.wolfType === WolfType.blind ? `Blind Wolf` : `Wolf team 1`} (${hole?.wolfTeam1?.map(p => p.name).join(', ')})<br>`;
        result.log += `Wolf team 2 (${hole?.wolfTeam2?.map(p => p.name).join(', ')})<br>`;
        calculateWolfSkins(result, hole);
      } else { /* no wolf, regular skins */
        calculateRegularSkins(result, hole);
      }

      hole?.playerScores?.forEach(ps => {
        ps.walkedBy?.length > 0 && result.calculateWalk(game, ps.player, ps.walkedBy, ps.putts);
      });



      result.log += '<br>';
    }
  });

  calculateSnake(game, result);

  return result;
}