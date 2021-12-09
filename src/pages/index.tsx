import useSWR from "swr";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Footer from "../components/Footer";
import Title from "../components/Title";
import { Training } from "../types";

export default function Overview() {
  const { data: trainings } = useSWR(
    `https://customerrest.herokuapp.com/gettrainings`
  );

  if (!trainings) {
    return <></>;
  }

  const allViews = Object.keys(Views).map((k) => Views[k]);

  // Format events to right format for the calendar
  const events = trainings.map((training: Training) => {
    return {
      start: moment(training.date).toDate(),
      end: moment(training.date).add(training.duration, "minutes"),
      title: `${training.activity} / ${training.customer.firstname} ${training.customer.lastname}`,
    };
  });

  // Format trainings to right format for the chart
  const chartSummary = trainings.reduce((acc, training) => {
    acc[training.activity] =
      acc[training.activity] + training.duration || training.duration;
    return acc;
  }, {});

  const chartData = Object.keys(chartSummary).map((key) => {
    return {
      name: key,
      duration: chartSummary[key],
    };
  });

  return (
    <div className="container-fluid">
      <Title pageName="Etusivu" />
      <main role="main">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Kalenteri</h5>
                <Calendar
                  localizer={momentLocalizer(moment)}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  views={allViews}
                  style={{ height: "60vh" }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <aside className="col-md-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Yhteenveto aktiviteeteistä</h5>
                <div style={{ height: "25vh" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="duration" fill="#4287f5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
