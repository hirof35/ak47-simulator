// セレクターの状態定義
type SelectorMode = 'Safe' | 'Auto' | 'Semi';

class AK47Simulator {
  private selector: SelectorMode = 'Safe';
  private ammo: number = 30;
  private maxAmmo: number = 30;
  private isTriggerPulled: boolean = false;
  private fireIntervalId: any = null;
  private isSemiFired: boolean = false; // セミオートで1発撃ったかどうかのフラグ

  // 発射サイクル（600発/分 = 100msに1発）
  private fireRateMs: number = 100;

  constructor() {
    console.log("AK-47 初期化完了。マガジン: 30発。現在のモード: 安全装置");
  }

  // セレクターの切り替え
  public switchSelector(mode: SelectorMode): void {
    this.selector = mode;
    console.log(`セレクターを [${mode}] に切り替えました。`);
    // モード切り替え時にトリガーの状態を一度リセット
    this.releaseTrigger();
  }

  // トリガーを引く（長押し開始、またはクリック）
  public pullTrigger(): void {
    if (this.isTriggerPulled) return; // 既に引かれているなら何もしない
    this.isTriggerPulled = true;

    switch (this.selector) {
      case 'Safe':
        console.log("【安全装置】トリガーがロックされています。発射できません。");
        break;

      case 'Semi':
        this.fireSingleRound();
        break;

      case 'Auto':
        // フルオートはタイマーを起動して連射
        this.fireSingleRound(); // 最初の1発
        this.fireIntervalId = setInterval(() => {
          this.fireSingleRound();
        }, this.fireRateMs);
        break;
    }
  }

  // トリガーを離す
  public releaseTrigger(): void {
    this.isTriggerPulled = false;
    if (this.fireIntervalId) {
      clearInterval(this.fireIntervalId);
      this.fireIntervalId = null;
    }
  }

  // 1発発射する内部処理
  private fireSingleRound(): void {
    if (this.ammo <= 0) {
      console.log("「カチッ！」 残弾がありません。リロードしてください。");
      this.releaseTrigger();
      return;
    }

    this.ammo--;
    console.log(`🔥 バン！ [残弾: ${this.ammo}/${this.maxAmmo}]`);
  }

  // リロード
  public reload(): void {
    this.ammo = this.maxAmmo;
    console.log("リロード完了。マガジン: 30発");
  }
}

// --- 使用例 ---
const myAK47 = new AK47Simulator();

// 1. 安全装置のままトリガーを引く
myAK47.pullTrigger(); 

// 2. フルオート（連射）に切り替えてトリガーを引く
myAK47.switchSelector('Auto');
myAK47.pullTrigger(); // 連射が始まる

// 1秒後にトリガーを離す（約10発発射される）
setTimeout(() => {
  myAK47.releaseTrigger();
  
  // 3. セミオート（単射）に切り替えてみる
  myAK47.switchSelector('Semi');
  myAK47.pullTrigger(); // 1発だけ発射
  myAK47.releaseTrigger();
}, 1000);