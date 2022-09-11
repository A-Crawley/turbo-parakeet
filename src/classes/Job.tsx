export class Job {
  public id: number;
  private name: string;
  private progress: number;
  private progressMultiplyer: number;
  private progressBaseValue: number;
  private level: number;
  private progressNeededToLevel: number;
  private progressNeededToLevelMultiplyer: number;
  private baseIncomePerDay: number;
  private unlockAction: Function;
  private incomeMultiplier: number;
  private income: number;

  private levelUp = (levelIncrease: number) => {
    this.level += levelIncrease;
    this.progressNeededToLevel =
      this.level * this.progressNeededToLevelMultiplyer * 100;
    this.progress = 0;
    this.progressMultiplyer *= 1.15;
    this.income += this.baseIncomePerDay * this.incomeMultiplier;
    console.log({ data: this });
  };

  constructor(
    id: number,
    name: string,
    progressBaseValue: number,
    baseIncome: number,
    unlockAction: Function,
    incomeMultiplier: number
  ) {
    this.id = id;
    this.name = name;
    this.progress = 0;
    this.progressNeededToLevel = 100;
    this.progressMultiplyer = 1;
    this.progressBaseValue = progressBaseValue;
    this.level = 1;
    this.progressNeededToLevelMultiplyer = 2;
    this.baseIncomePerDay = baseIncome;
    this.incomeMultiplier = incomeMultiplier;
    this.income = baseIncome;
    this.unlockAction = unlockAction;
  }

  public increaseProgress = () => {
    const increase = this.progressBaseValue * this.progressMultiplyer;

    if (this.progress + increase > this.progressNeededToLevel) {
      this.levelUp(
        Math.floor((this.progress + increase) / this.progressNeededToLevel)
      );
      this.progress = (this.progress + increase) % this.progressNeededToLevel;
      return;
    }

    this.progress += increase;
  };

  public getProgress = (): number => this.progress;
  public getProgressPercentage = (): number =>
    (this.progress / this.progressNeededToLevel) * 100;
  public getProgressNeededToLevel = (): number => this.progressNeededToLevel;
  public getLevel = (): number => this.level;
  public getName = () => this.name;
  public getIncome = () => this.income;
  public unlocked = () => this.unlockAction() === true;
}