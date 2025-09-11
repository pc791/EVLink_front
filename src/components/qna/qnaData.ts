export interface QnaVO {
  board_id?: number;
  title: string;
  user_id: string;
  content: string;
  hit?: number;
  reg_dt?: string;
  upd_dt?: string;
  emotion?: string;
  score?: number;
}
export interface VO {
    count: number;
    results: [{
        pred_index: number,
        pred_label: string,
        probabilities: number[]
    }];
}
