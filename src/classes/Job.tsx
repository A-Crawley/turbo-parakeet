export class Job {

    private name: string;
    private progress: number;
    private progressMultiplyer: number;
    private progressBaseValue: number;
    private level: number;
    private progressNeededToLevel: number;
    private progressNeededToLevelMultiplyer: number;
  
    private levelUp = (levelIncrease: number) => {
      this.level += levelIncrease;
      this.progressNeededToLevel = (this.level * this.progressNeededToLevelMultiplyer) * 100;
      this.progress = 0;
    }
  
    constructor(name: string){
      this.name = name;
      this.progress=0;
      this.progressNeededToLevel=100;
      this.progressMultiplyer=1;
      this.progressBaseValue=5;
      this.level=0;
      this.progressNeededToLevelMultiplyer = 2;
    }
  
    public increaseProgress = () => {
      const increase = this.progressBaseValue * this.progressMultiplyer;
  
      if ((this.progress + increase) > this.progressNeededToLevel) {
        this.levelUp(Math.floor((this.progress + increase) / this.progressNeededToLevel));
        this.progress = (this.progress + increase) % this.progressNeededToLevel;
        return;
      }
  
      this.progress += increase;
  
    }
  
    public getProgress = () : number => this.progress;
    public getProgressPercentage = () : number => (this.progress / this.progressNeededToLevel) * 100;
    public getProgressNeededToLevel = () : number => this.progressNeededToLevel;
    public getLevel = (): number => this.level;
    public getName = () => this.name;
  }
  