import { LinearProgress, Paper, Tooltip, Typography } from "@mui/material";

interface Props {
  setAsActive: Function;
}

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
  private maxLevel: number;

  private levelUp = (levelIncrease: number) => {
    this.level += levelIncrease;
    this.progressNeededToLevel = this.levelScale(this.level);
    this.progress = 0;
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
    this.maxLevel = 0;
  }

  public setRebirthMultiplier = () => {
    if (this.maxLevel < this.level) this.maxLevel = this.level;
    this.progress = 0;
    this.progressNeededToLevel = 100;
    this.progressMultiplyer = 1;
    this.level = 1;
    this.progressNeededToLevelMultiplyer = 2;
    this.income = this.baseIncomePerDay;
  };

  public increaseMultiplier = (value: number) => {
    this.progressMultiplyer += value;
  };

  // x = progress to level
  // t = max level
  // f(x) = ( x^2 ) + 100 - ( ( t / 10 ) * x )
  private levelScale = (x: number): number => {
    return Math.pow(x, 2) + 100 - (this.maxLevel / 10) * x;
  };

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

  public component = ({ setAsActive }: Props) => {
    return (
      <>
        <Tooltip title={`x${this.progressMultiplyer.toPrecision(3)}`}>
          <Paper
            sx={{ width: "200px", background: "#808080", p: 1, m: 2 }}
            onClick={() => setAsActive(this)}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: "2px",
              }}
            >
              <Typography>{this.getName()}</Typography>
              <Typography>Lvl: {this.getLevel()}</Typography>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <Typography
                fontSize={"0.7em"}
                sx={{
                  ml: "auto",
                  visibility: this.maxLevel <= 0 ? "hidden" : "visible",
                }}
              >
                Max Lvl: {this.maxLevel}
              </Typography>
            </div>
            <LinearProgress
              variant={"determinate"}
              value={this.getProgressPercentage()}
              sx={{ mb: 1 }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Typography>
                {this.getProgressPercentage().toFixed(0)}%
              </Typography>
              <Typography>{this.getIncome().toPrecision(1)}c</Typography>
            </div>
          </Paper>
        </Tooltip>
      </>
    );
  };
}
