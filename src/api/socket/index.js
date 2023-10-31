const io = require('../../config/socket')
const { contesDetail } = require("../../constants/staticData");
const { verifyIoToken } = require("../middlewares/auth");
const { ContestModel } = require("../models/Contest");
const { CardModel } = require("../models/Crad");
const { UserModel } = require("../models/User");

function shuffle(statList) {
  for (let i = 0; i < statList.length; i++) {
    let j = Math.floor(Math.random() * statList.length);
    let temp = statList[i];
    statList[i] = statList[j];
    statList[j] = temp;
  }
  return statList;
}
const create = async (user, contestData, socket, cards) => {
  try {
    if (user.coins < contestData.betamount) {
      throw new Error("Not enough amount");
    }
    const contest = await ContestModel.create({
      ...contestData,
      status: "open",
      users: [{ ...user, rank: 0 }],
    });
    const ack = await UserModel.updateOne(
      { userID: user.userID },
      {
        $push: {
          contestHistory: { contestID: contest.contestID, rank: 0 },
        },
        $inc: {
          coins: -contestData?.betamount,
        },
      }
    );
    socket.emit("join", {
      success: true,
      response: { status: "open", myTurn: true, contest, cards },
    });
    socket.join(contest.contestID);
  } catch (error) {
    console.log("error - ", error);
    socket.emit("error", error);
  }
};

const addUser = async (user, contestData, socket, cards, oc) => {
  try {
    console.log("contestdata in add - ", contestData, " and user - ", user);
    if (user.coins < contestData.betamount) {
      throw new Error("Not enough amount");
    }
    const contestID = contestData.contestID;
    const oppID = contestData.users[0].userID;
    const myID = user.userID;
    const opp = await UserModel.findOne({
      userID: contestData.users[0].userID,
    });

    const contest = await ContestModel.findOneAndUpdate(
      { contestID },
      {
        $push: { users: { ...user, rank: 0 } },
        $set: { status: "full" },
      },
      { returnDocument: "after" }
    );
    const ack = await UserModel.updateOne(
      { userID: user.userID },
      {
        $push: {
          contestHistory: { contestID: contest.contestID, rank: 0 },
        },
        $inc: {
          coins: -contestData?.betamount,
        },
      }
    );

    socket.join(contestID);
    console.log("contestID - ", contestID);
    socket.emit("join", {
      success: true,
      response: {
        status: "full",
        myTurn: false,
        contest,
        cards,
        opponent: opp,
        oppCards: oc,
      },
    });
    socket.broadcast
      .to(contestID)
      .emit("OPP_JOIN", {
        success: true,
        response: {
          status: "full",
          cards: oc,
          opponent: user,
          oppCards: cards,
        },
      });
  } catch (error) {
    console.log("error in add user - ", error);
    socket.emit("error", error);
    socket.broadcast.to(contestData.contestID).emit("error", error);
  }
};
io
    .on('connection', (socket) => {
        try {
            socket.on('join', async ({ userID, contestType }) => {
                console.log('join event triggered - ', userID, contestType);
                console.log('socket id - ', socket.id);
                let currContest = contesDetail[contestType];
                const user = await UserModel.findOne({ userID });
                if (user.contestHistory.find(e => e.rank === 0)) {
                    console.log('user already in contest');
                    return socket.emit('error', { status: 'failed', message: 'user already in contest' })
                }
                const contest = await ContestModel.findOne({ constestName: currContest.constestName, status: 'open' });

                if (!contest) {
                    create(user, currContest, socket);
                } else {
                    if (contest.users.length < 2) {
                        let cards = await CardModel.find();
                        cards = shuffle(cards).slice(0, 6);
                        console.log('mycards - ', cards.slice(3));
                        console.log('oppcards - ', cards.slice(0, 3));
                        addUser(user, contest, socket, cards.slice(3), cards.slice(0, 3))
                    } else {
                        console.log('invalid unhandled case..')
                    }
                }
            })
        } catch (error) {
            socket.emit('error', 'invalid payload')
        }
        try {
            socket.on('PLAY', async ({ myStat, myCard, oppStat, oppCard, isStarting, contestID, myCards, oppCards, myLife, oppLife }) => {
                console.log('incoming datas - ', myStat, myCard, oppStat, oppCard, isStarting, contestID, myLife, oppLife);
                if (isStarting) {
                    socket.broadcast.to(contestID).emit('ROUND_START_BY_OPP', { oppStat: myStat, card: myCard, myTurn: true, myCards, oppLife: myLife, myLife: oppLife });
                    socket.emit('ROUND_START_BY_ME', { myTurn: false, myLife, oppLife });
                } else {
                    if (myStat.name !== oppStat.name) {
                        socket.emit('error', { status: 'failed', message: 'Mismatch stat' });
                    } else {
                        let newMyCards = myCards;
                        let newOppCards = oppCards;
                        if (myStat.value > oppStat.value) {
                            let temp = newMyCards.shift();
                            newMyCards.push(temp, oppCard);
                            newOppCards.shift()
                            socket.emit('ROUND_END_BY_ME', { winner: true, myTurn: true, card: oppCard, myCards: newMyCards, oppCards: newOppCards, myLife, oppLife });
                            socket.broadcast.to(contestID).emit('ROUND_END_BY_OPP', { oppStat: myStat, oppCard: myCard, winner: false, myTurn: false, card: myCard, myCards: newOppCards, oppCards: newMyCards, oppLife: myLife, myLife: oppLife });
                        } else if (myStat.value < oppStat.value) {
                            let temp = newOppCards.shift();
                            newOppCards.push(temp, myCard);
                            newMyCards.shift()
                            socket.emit('ROUND_END_BY_ME', { winner: false, myTurn: false, card: oppCard, myCards: newMyCards, oppCards: newOppCards, myLife, oppLife });
                            socket.broadcast.to(contestID).emit('ROUND_END_BY_OPP', { oppStat: myStat, oppCard: myCard, winner: true, myTurn: true, card: myCard, myCards: newOppCards, oppCards: newMyCards, oppLife: myLife, myLife: oppLife })
                        } else {
                            newMyCards = shuffle(newMyCards);
                            newOppCards = shuffle(newOppCards)
                            socket.emit('ROUND_END_BY_ME', { tie: true, myTurn: false, card: oppCard, myCards: newMyCards, oppCards: newOppCards, myLife, oppLife });
                            socket.broadcast.to(contestID).emit('ROUND_END_BY_OPP', { oppStat: myStat, oppCard: myCard, tie: true, myTurn: true, card: myCard, myCards: newOppCards, oppCards: newMyCards, oppLife: myLife, myLife: oppLife })
                        }
                    }
                }
            })
        } catch (error) {
            socket.emit('error', 'invalid payload')
        }
        try {
            socket.on('END', async ({ winnerID, looserID, contestID, won }) => {
                try {
                    if (!winnerID || !looserID || !contestID) {
                        console.log('miising field');
                        return socket.broadcast.to(contestID).emit('end', 'invalid field')
                    }
                    const oldContest = await ContestModel.findOne({ contestID });
                    if (oldContest.status === 'closed') {
                        throw new Error("closed contest can't update")
                    }
                    // const winner = await UserModel.find({userID:winnerID});
                    // const looser = await UserModel.find({userID:looserID});
                    const contest = await ContestModel.findOneAndUpdate({ contestID }, {
                        $set: {
                            users: [{ userID: winnerID, rank: 1 }, { userID: looserID, rank: 2 }],
                            status: 'closed'
                        }
                    }, { returnDocument: "after" });
                    console.log(' after setting contest - ', contesDetail);
                    let winner = await UserModel.updateOne(
                        { userID: winnerID },
                        {
                            $inc: { "contests.played": 1, "contests.won": 1 , coins : contest.winningamount}
                        },
                    )
                    winner = await UserModel.updateOne(
                        { userID: winnerID, "contestHistory.contestID": contestID },
                        {
                            $set: {
                                'contestHistory.$[xxx].rank': 1,
                            }
                        },
                        {
                            arrayFilters: [
                                { "xxx.contestID": contestID }
                            ]
                        }
                    )
                    console.log(' after setting winner - ', winner);
                    let looser = await UserModel.updateOne(
                        { userID: looserID },
                        {
                            $inc: { "contests.played": 1, "contests.lost": 1 },
                        }
                    )
                    looser = await UserModel.updateOne(
                        { userID: looserID, "contestHistory.contestID": contestID },
                        {
                            $set: {
                                'contestHistory.$[xxx].rank': 2,
                            }
                        },
                        {
                            arrayFilters: [
                                { "xxx.contestID": contestID }
                            ]
                        }
                    )
                    socket.emit('END_GAME', { contest, won: !!won })
                    socket.broadcast.to(contestID).emit('END_GAME', { contest, won: !won })

                } catch (error) {
                    console.log('end errorr - ', error);
                    socket.emit('error', { message: error })
                }

            })
        } catch (error) {
            socket.emit('error', { message: 'invalid payload' })
        }

        socket.on('disconnect', async (param) => {
            const disconnectedUser = UserModel.findOne({ socketID: socket.id });
            console.log('disconnected user ')
        })

    })

