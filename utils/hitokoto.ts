import axios from 'axios'

interface HitokotoData {
  id: number;
  type: string;
  hitokoto: string;
  from: string;
  from_who: string;
  creator: string;
  creator_uid: number;
  reviewer: number;
  commit_from: string;
  created_at: number;
}

export class Hitokoto {
  // constructor(parameters) {

  // }

  getHitokoto() {
    return new Promise<HitokotoData>((resolve, reject) => {
      axios.get('https://v1.hitokoto.cn')
        .then(({ data }) => resolve(data))
        .catch(reject)
    })
  }
}
