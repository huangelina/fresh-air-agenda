import { useEffect, useState } from 'react';
import { useAuthContext } from "@galvanize-inc/jwtdown-for-react";

import { Bar } from 'react-chartjs-2';
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from 'chart.js/auto';


function Metrics() {
  const { token } = useAuthContext();
  const [ userId, setUserId ] = useState();
  const [ userTimelogs, setUserTimelogs ] = useState([]);
  const [ selectedYear, setSelectedYear ] = useState(null);
  const [ selectedWeek, setSelectedWeek ] = useState(null);
  const [ years, setYears ] = useState([]);
  const [ weeks, setWeeks ] = useState([]);

  // Average Calculations

  function getWeekOfYear(timelogDate) {
    const currentDate = new Date(timelogDate);
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil(days / 7);
    return weekNumber;
  }

  function weekAverage(weekNumber, year) {
    let numOfLogs = 0;
    let sumOfLogs = 0;

    for (const timelog of userTimelogs) {
      if (timelog.date.week === weekNumber && timelog.date.year === year) {
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

  // Rendering

  useEffect(() => {
    async function getUserId() {
      if (token) {
        const tokenUrl = 'http://localhost:8000/token';
        const response = await fetch(tokenUrl, {
          headers: { Authorization:  `Bearer ${token}` },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          const id = data.user.id;
          setUserId(id);
        }
      }
    }

    async function fetchData() {
      if (token && userId) {
        const logUrl = `http://localhost:8000/users/${userId}/logs`;
        const response = await fetch(logUrl, { headers: { Authorization: `Bearer ${token}` } });
        if (response.ok) {
          const timelogs = await response.json();
          const convertedTimelogs = convertAndFilterTimelogsDates(timelogs);
          setUserTimelogs(convertedTimelogs);
        } else {
          console.error('An error occurred fetching the data')
        }
      }
    }

    function convertAndFilterTimelogsDates(timelogs) {
      const convertedTimelogs = [];

      for (const timelog of timelogs) {
        const convertedDate = {};

        const date = new Date(timelog.date);
        const year = date.getFullYear();

        convertedDate["year"] = parseInt(year);
        convertedDate["week"] = parseInt(getWeekOfYear(timelog.date));
        convertedDate["string"] = timelog.date;
        timelog.date = convertedDate;

        convertedTimelogs.push(timelog);
      }

      const unfilteredYears = [];
      const unfilteredWeeks = [];
      const filteredYears = [];
      const filteredWeeks = [];

      for (const timelog of convertedTimelogs) {
        unfilteredYears.push(timelog.date.year);
        unfilteredWeeks.push(timelog.date.week);
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

      return convertedTimelogs;
    }

    fetchData();
    getUserId();
  }, [userId, token])

    return (
      <>
        <div className='justify-content-center'>
          <h1>Metrics</h1>
          <div>
            <h2>Average This Week</h2>
              <div className="current_average" style={{height: 300}}>
                <Bar data={currentAverage} />
              </div>
          </div>
          <div>
            <h2>Average Last Week</h2>
              <div className="previous_average" style={{height: 300}}>
                <Bar data={previousAverage} />
              </div>
          </div>
          <div>
            <h2>Average of Selected Week</h2>
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
              <div className="selected_average" style={{height: 300}}>
                <Bar data={selectedAverage} />
              </div>
          </div>
        </div>
      </>
    );
  }

  export default Metrics;
