import { Avatar, Tooltip } from "@mui/material";
import { LineChart, Line } from "recharts";
import { useEffect, useState } from "react";
import "./index.css";

interface fieldsObj {
  Id: number;
  Name: string;
  avatar: string;
  occupation: string;
}

interface CardProps {
  createdTime: string;
  fields: fieldsObj;
  id: string;
  totalRevenue: number;
  userConversionsCount: number;
  userImpressionsCount: number;
  sortedChartData: any[];
}

const Card = (Props: CardProps) => {
  const [firstMonthDayDate, setFirstMonthDayDate] = useState("");
  const [lastMonthDayDate, setLastMonthDayDate] = useState("");
  const {
    fields,
    totalRevenue,
    userConversionsCount,
    userImpressionsCount,
    sortedChartData,
  } = Props;

  useEffect(() => {
    const firstDate = sortedChartData[0].date;
    const lastDate = sortedChartData[sortedChartData.length - 1].date;

    firstDate && setFirstMonthDayDate(firstDate.slice(5).replace("-", "/"));
    lastDate && setLastMonthDayDate(lastDate.slice(5).replace("-", "/"));
  }, [sortedChartData]);

  return (
    <section>
      <div>
        <div className="card-header">
          <figure>
            <Avatar
              sx={{ bgcolor: "grey" }}
              alt={fields.Name}
              src={fields.avatar ?? "/"}
            />
          </figure>
          <div className="card-name">
            <h3>{fields?.Name}</h3>
            <Tooltip title={fields?.occupation} arrow>
              <h5>{fields?.occupation}</h5>
            </Tooltip>
          </div>
        </div>

        <div className="card-body">
          <div className="chart">
            <LineChart width={150} height={100} data={sortedChartData}>
              <Line
                type="monotone"
                dataKey="countNum"
                stroke="#515151"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
            <p>{`Conversions ${firstMonthDayDate} - ${lastMonthDayDate}`}</p>
          </div>
          <div>
            <div>
              <div className="impressions">
                <strong>{userImpressionsCount ?? 0}</strong>
                <p>impressions</p>
              </div>
              <div className="conversions">
                <strong>{userConversionsCount ?? 0}</strong>
                <p>conversions</p>
              </div>
            </div>
            <div className="card-footer">
              <strong>${totalRevenue?.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Card;
