import { Paper, Tooltip, Typography } from "@mui/material";
import { getCurrenyDivisions, prettyPrintCurrency } from "../Utils";

interface Props {
  withdraw: Function;
}

export default class Item {
  public id: number;
  private purchaseFunction: Function;
  private removeFunction: Function;
  private name: string;
  private isPurchased: boolean;
  private cost: number;

  constructor(
    id: number,
    name: string,
    cost: number,
    purchaseFunction: Function,
    removeFunction: Function
  ) {
    this.id = id;
    this.purchaseFunction = purchaseFunction;
    this.isPurchased = false;
    this.name = name;
    this.cost = cost;
    this.removeFunction = removeFunction;
  }

  public rebirth = () => {
    this.isPurchased = false;
  };

  public purchase = (withdraw: Function) => {
    if (this.isPurchased) {
      this.removeFunction();
      this.isPurchased = false;
      return;
    }
    if (!withdraw(this.cost)) return;
    this.purchaseFunction();
    this.isPurchased = true;
  };

  public component = ({ withdraw }: Props) => (
    <>
      <Tooltip title={``}>
        <Paper
          sx={{
            width: "200px",
            background: this.isPurchased ? "#404040" : "#808080",
            p: 1,
            m: 2,
          }}
          onClick={() => this.purchase(withdraw)}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <Typography>{this.name}</Typography>
            <Typography>
              {prettyPrintCurrency(getCurrenyDivisions(this.cost))}
            </Typography>
          </div>
        </Paper>
      </Tooltip>
    </>
  );
}
