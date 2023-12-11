import { useEffect, useState } from 'react';

import { Bar } from 'react-chartjs-2';
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from 'chart.js/auto';


function Metrics({ token, userTimelogs }) {
  const [ convertedTimelogs, setConvertedTimelogs ] = useState([]);
  const [ selectedYear, setSelectedYear ] = useState(null);
  const [ selectedWeek, setSelectedWeek ] = useState(null);
  const [ years, setYears ] = useState([]);
  const [ weeks, setWeeks ] = useState([]);
  const [ listOfWeekDates, setListOfWeekDates ] = useState([]);
  const [ logsForThisWeek, setLogsForThisWeek ] = useState([]);
  const [ totalMinutes, setTotalMinutes] = useState(0);
  const [ totalGoal, setTotalGoal ] = useState(0);


  // Date
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

  function getWeekDates() {
    const today = new Date();
    const dayOfWeek = today.getDay()
    const daysToSubtract = (dayOfWeek + 7 - 0) % 7;
    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - daysToSubtract);
    const weekDates = [];
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(lastSunday);
      currentDate.setDate(lastSunday.getDate() + day);
      const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
      weekDates.push(formattedDate);
    }
    return weekDates;
  }

  // Data Fetching

  function getWeekOfYear(timelogDate) {
    const currentDate = new Date(timelogDate);
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil(days / 7);
    return weekNumber;
  }

  function convertAndFilterTimelogsDates(timelogs) {
    const convertedTimelogs = [];

    for (const timelog of timelogs) {
      let convertedTimelog = {}
      const convertedDate = {};

      const date = new Date(timelog.date);
      const year = date.getFullYear();

      convertedDate["year"] = parseInt(year);
      convertedDate["week"] = parseInt(getWeekOfYear(timelog.date));
      convertedDate["time_outside"] = timelog.time_outside;
      convertedTimelog = convertedDate;

      convertedTimelogs.push(convertedTimelog);
    }

    const unfilteredYears = [];
    const unfilteredWeeks = [];
    const filteredYears = [];
    const filteredWeeks = [];

    for (const timelog of convertedTimelogs) {
      unfilteredYears.push(timelog.year);
      unfilteredWeeks.push(timelog.week);
    }

    for (const year of unfilteredYears) {
      if (!filteredYears.includes(year)) {
        filteredYears.push(year);
      }
    }

    for (const week of unfilteredWeeks) {
      if (!filteredWeeks.includes(week)) {
        filteredWeeks.push(week);
      }
    }

    setYears(filteredYears);
    setWeeks(filteredWeeks);
    setConvertedTimelogs(convertedTimelogs);

  }

  function weekAverage(weekNumber, year) {
    let numOfLogs = 0;
    let sumOfLogs = 0;

    for (const timelog of convertedTimelogs) {
      if (timelog.week === weekNumber && timelog.year === year) {
        numOfLogs++;
        sumOfLogs += timelog.time_outside;
      }
    }

    if (numOfLogs === 0 && sumOfLogs === 0) {
      return 0
    } else {
      const currentWeekAverage = sumOfLogs / numOfLogs;
      return currentWeekAverage.toFixed(3);
    }
  }

  function currentWeekAverage() {
    const today = new Date();
    const year = today.getFullYear();
    const weekNumber = getWeekOfYear(today);
    return weekAverage(weekNumber, year);
  }

  function previousWeekAverage() {
    const today = new Date();
    const year = today.getFullYear();
    const weekNumber = getWeekOfYear(today) - 1;
    return weekAverage(weekNumber, year);
  }

  // Chart Data & Options

  const currentAverage = {
    labels: [""],
    datasets: [{
      backgroundColor: '#99C3E9',
      borderRadius: 5,
      indexAxis: 'y',
      label: "Average Minutes Outside",
      data: [currentWeekAverage()]
    }]
  };

  const previousAverage = {
    labels: [""],
    datasets: [{
      backgroundColor: '#99C3E9',
      borderRadius: 5,
      indexAxis: 'y',
      label: "Average Minutes Outside",
      data: [previousWeekAverage()]
    }]
  };

  const selectedAverage = {
    labels: [""],
    datasets: [{
      backgroundColor: '#99C3E9',
      borderRadius: 5,
      indexAxis: 'y',
      label: "Average Minutes Outside",
      data: [weekAverage(selectedWeek, selectedYear)]
    }]
  };

  const chartLabels = listOfWeekDates.map(date => date);
  const graphOfLogsData = listOfWeekDates.map((date) => {
  const logForDate = logsForThisWeek.find((log) => log.date === date);
  return logForDate ? logForDate.time_outside / 60 : 0;
  });

  const data = {
    labels: chartLabels,
    datasets: [{
      backgroundColor: '#8AFF8A',
        borderRadius: 5,
        label: "Hours Outside",
        data: graphOfLogsData,
    }]
  };

  const options = {
    barThickness : 70,
      plugins: {
        legend: {
          position: 'top',
          labels: {
          },
        },
      },
  };


  // Selection Handling

  const handleChangeYear = (event) => {
    event.preventDefault();
    const year = parseInt(event.target.value);
    setSelectedYear(year);
  };

  const handleChangeWeek = (event) => {
    event.preventDefault();
    const week = parseInt(event.target.value);
    setSelectedWeek(week);
  };

  // Date Formatting
  const dateParts = formattedDate.split('-');
  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];
  const formattedLongDate = `${new Date(year, month - 1, day).toLocaleString('default', { month: 'long' })} ${parseInt(day, 10)}, ${year}`;



  function totalMinutesForThisWeek(timelogs) {
    let totalMinutes = 0
    for (const timelog of timelogs) {
      totalMinutes += timelog.time_outside;
    }
    setTotalMinutes(totalMinutes)
  }


  function goalForThisWeek(timelogs) {
    let totalGoal = 0
    for (const timelog of timelogs) {
      totalGoal += timelog.goal;
    }
    setTotalGoal(totalGoal)
  }

  const totalHoursDisplay = Math.floor(totalMinutes / 60)
  const totalMinutesDisplay = totalMinutes % 60
  const totalHoursDisplayForGoal = Math.floor(totalGoal / 60)
  const totalMinutesDisplayForGoal = totalGoal % 60

  // Rendering

  useEffect(() => {
    convertAndFilterTimelogsDates(userTimelogs);
    setListOfWeekDates(getWeekDates());
    // eslint-disable-next-line
  }, [token, userTimelogs]);

  useEffect(() => {
    setLogsForThisWeek(userTimelogs.filter((log) => listOfWeekDates.includes(log.date)));
    // eslint-disable-next-line
  }, [listOfWeekDates]);

  useEffect(() => {
    totalMinutesForThisWeek(logsForThisWeek);
    goalForThisWeek(logsForThisWeek);
  }, [logsForThisWeek]);


    return (
      <>
        <div style={{ marginLeft: '70px', color: '#2E4053', paddingTop: '50px'}}>
          <h1>My Metrics</h1>
        </div>
        <div style={{ marginLeft: '70px', marginRight: '70px', marginTop: '35px', marginBottom: '35px'}}>
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}>
              <div style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff', padding: '30px', borderRadius: '35px', flex: 2}}>
                <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Today is {formattedLongDate}</p>
                <p style={{ marginBottom: '5px' }}>To reach your goal for this week, your current time spent getting fresh air should be <span style={{ fontWeight: 'bold', fontSize: '1em' }}>{totalHoursDisplayForGoal}</span> hr <span style={{ fontWeight: 'bold', fontSize: '1em' }}>{totalMinutesDisplayForGoal}</span> min</p>
                <p style={{ marginBottom: '5px' }}><span style={{ fontWeight: 'bold', fontSize: '2em' }}>{totalHoursDisplay}</span> hr <span style={{ fontWeight: 'bold', fontSize: '2em' }}>{totalMinutesDisplay}</span> min spent getting fresh air this week</p>
              </div>
            </div>
          </>
            <div style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff', paddingTop: '20px', paddingLeft: '50px', paddingRight: '50px', borderRadius: '35px' }}>
              <h2>My week</h2>
              <div>
                <div className="my week" style={{ height: 300, display: 'flex', justifyContent: 'center', paddingBottom: "20px" }}>
                  <Bar data={data} options={options} />
                </div>
              </div>
              <h2>Averages</h2>
              <div>
                <p style={{ fontSize: '1.2em', paddingLeft: '10px' }}>This Week</p>
                <div className="current_average" style={{ height: 300, display: 'flex', justifyContent: 'center', paddingBottom: "20px" }}>
                  <Bar data={currentAverage} />
                </div>
              </div>
            <div>
              <p style={{ fontSize: '1.2em', paddingTop: '15px', paddingLeft: '10px' }}>Last Week</p>
              <div className="previous_average" style={{ height: 300, display: 'flex', justifyContent: 'center', paddingBottom: "20px" }}>
                <Bar data={previousAverage} />
             </div>
            </div>
            <div>
              <p style={{ fontSize: '1.2em', paddingTop: '15px', paddingLeft: '10px' }}>Selected Week</p>
                <select onChange={handleChangeYear} name="year_selector" id="year_selector" required>
                  <option value="">Select A Year</option>
                  {years.map(year => {
                    return (
                      <option key={year} value={year}>{year}</option>
                    );
                  })}
                </select>
                <select onChange={handleChangeWeek} name="week_selector" id="week_selector" required>
                  <option value="">Select A Week</option>
                  {weeks.map(week => {
                    return (
                      <option key={week} value={week}>{week}</option>
                    );
                  })}
                </select>
                <div className="selected_average" style={{ height: 300, display: 'flex', justifyContent: 'center', paddingBottom: "20px" }}>
                  <Bar data={selectedAverage} />
                </div>
            </div>
          </div>
      </div>
    </>
  );
}

export default Metrics;
