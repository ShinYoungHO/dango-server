import { Schema } from 'mongoose';
import { Request, Response } from 'express';
import UserModel from '../../../models/user';

export default async (req: Request, res: Response) => {
  const userId = req.params.userid;
  console.log(req.params.userId);

  try {
    const talentData = await UserModel.getTalents(userId)
    if (talentData) {
      const devided = talentData.reduce(
        (acc: any[], cur: any) => {
          return {
            ...acc,
            [cur.type]: [
              ...acc[cur.type],
              {
                ...cur.talent[0],
                _id: cur._id,
                reviews: cur.talent[0].reviews.filter((el: any) => {
                  return el._id.toString() === userId;
                }),
              },
            ],
          };
        },
        { unreviewed: [], reviewed: [], selling: [] },
      );
      res.json({ message: '데이터 응답에 성공했습니다.', data: devided });
    } else {
      res.json({ m: '' });
    }
  } catch (err) {
    res.status(500).json({ message: '서버 응답에 실패했습니다.' });
  }
};
