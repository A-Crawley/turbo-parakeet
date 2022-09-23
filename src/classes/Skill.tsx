import { LinearProgress, Paper, Tooltip, Typography } from "@mui/material";

interface Props {
  setAsActive: Function;
}

export class Skill {
  public id: number;
  private name: string;
  private progress: number;
  private progressMultiplyer: number;
  private progressBaseValue: number;
  private level: number;
  private progressNeededToLevel: number;
  private progressNeededToLevelMultiplyer: number;
  private unlockAction: Function;
  private levelUpAction: Function;
  private maxLevel: number;

  private levelUp = (levelIncrease: number) => {
    this.level += levelIncrease;
    this.progressNeededToLevel = this.levelScale(this.level);
    this.progress = 0;
    this.levelUpAction();
    console.log({ data: this });
  };

  constructor(
    id: number,
    name: string,
    progressBaseValue: number,
    unlockAction: Function,
    levelUpAction: Function
  ) {
    this.id = id;
    this.name = name;
    this.progress = 0;
    this.progressNeededToLevel = 100;
    this.progressMultiplyer = 1;
    this.progressBaseValue = progressBaseValue;
    this.level = 1;
    this.progressNeededToLevelMultiplyer = 1.5;
    this.unlockAction = unlockAction;
    this.levelUpAction = levelUpAction;
    this.maxLevel = 0;
  }

  // x = progress to level
  // t = max level
  // f(x) = ( x^2 ) + 100 - ( ( t / 10 ) * x )
  private levelScale = (x: number): number => {
    return Math.pow(x, 2) + 100 - (this.maxLevel / 10) * x;
  };

  public setRebirthMultiplier = () => {
    if (this.maxLevel < this.level) this.maxLevel = this.level;
    this.progress = 0;
    this.progressNeededToLevel = 100;
    this.progressMultiplyer = 1;
    this.level = 1;
    this.progressNeededToLevelMultiplyer = 1.5;
  };

  public increaseMultiplier = (value: number) => {
    this.progressMultiplyer += value;
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
            </div>
          </Paper>
        </Tooltip>
      </>
    );
  };
}
