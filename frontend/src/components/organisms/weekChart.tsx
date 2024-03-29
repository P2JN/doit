import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { useNavigate, useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { IconButton, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

import { statsService } from "services";
import { useActiveUser } from "store";
import { dateUtils } from "utils";
import { GoalTypes } from "types";

import { DataLoader } from "components/molecules";
import { StatCounter } from "components/atoms";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};

const weekDays = ["L", "M", "X", "J", "V", "S", "D"];

const WeekChart = (goal: GoalTypes.Goal) => {
  const { activeUser } = useActiveUser();
  const navigate = useNavigate();

  const { day } = useParams();
  const refDay = day || dateUtils.ISODateOnly(new Date());

  const { data, isLoading, error } = statsService.useWeekData(
    goal.id,
    activeUser?.id,
    refDay
  );

  const weekData = useMemo(() => {
    if (!data) return [];
    const { totalMonth, totalYear, ...rest } = data;
    return Object.values(rest);
  }, [data]);

  const weekLabels = useMemo(() => {
    if (!data) return [];
    const { totalMonth, totalYear, ...rest } = data;
    return Object.keys(rest).map(
      (key, index) => weekDays[index] + "-" + key.split("-")[2]
    );
  }, [data]);

  const showNextWeek = () =>
    navigate(`/goals/${goal.id}/stats/${dateUtils.ISODatePlusOneWeek(refDay)}`);
  const showPreviousWeek = () =>
    navigate(
      `/goals/${goal.id}/stats/${dateUtils.ISODateMinusOneWeek(refDay)}`
    );

  return (
    <>
      {goal && data && (
        <section>
          <div className="my-5 flex items-center justify-around ">
            <IconButton
              disabled={isLoading}
              onClick={showPreviousWeek}
              color="primary"
              size="large"
            >
              <ChevronLeft />
            </IconButton>

            <Typography variant="h5" className="w-full text-center">
              {weekLabels[0]}
            </Typography>

            <Typography variant="h4" className="w-full text-center">
              <strong>
                {dateUtils.beautifyMonth(Number(refDay.split("-")[1]))}
              </strong>
              <br />
              {refDay.split("-")[0]}
            </Typography>

            <Typography variant="h5" className="w-full text-center">
              {weekLabels[weekLabels.length - 1]}
            </Typography>

            <IconButton
              disabled={isLoading}
              onClick={showNextWeek}
              color="primary"
              size="large"
            >
              <ChevronRight />
            </IconButton>
          </div>
          <Bar
            options={options}
            data={{
              labels: weekLabels,
              datasets: [
                {
                  label: goal.unit || "unit",
                  data: weekData,
                  backgroundColor: "#93C08C",
                },
              ],
            }}
          />
          <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <StatCounter
              value={weekData.reduce((a, b) => a + b, 0)}
              label="Total semanal"
            />
            <StatCounter
              value={data?.totalMonth}
              label={
                "Total " + dateUtils.beautifyMonth(Number(refDay.split("-")[1]))
              }
            />
            <StatCounter
              value={data?.totalYear}
              label={"Total " + refDay.split("-")[0]}
            />
          </section>
        </section>
      )}
      <DataLoader
        hasData={weekData.length > 0}
        error={error}
        isLoading={isLoading}
      />
    </>
  );
};

export default WeekChart;
