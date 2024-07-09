import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import './CSS/style.css';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import accessibility from 'highcharts/modules/accessibility';
import Dashboardimg from './image/Dashboard-active.svg';
import projectlist from './image/Project-list.svg';
import createprojectactive from './image/create-project.svg';
import logo from './image/Logo.svg';
import { useNavigate } from 'react-router-dom';
import logout from './image/Logout.svg';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

accessibility(Highcharts);
const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [counters, setCounters] = useState({});
  const [runningDelayed, setRunningDelayed] = useState(0);
  const navigate = useNavigate();

  const counterNavigate = ()=>{
    navigate('/dashboard');
  }
  const counterNavigate2 = ()=>{
    navigate('/projectlist');
  }

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    navigate('/'); // Redirect to login page
  };


  useEffect(() => {
    const fetchCounters = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/projects/counter');
        setCounters(response.data);
      } catch (error) {
        console.error('Error fetching counters', error);
      }
    };

    const fetchRunningDelayed = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/projects/counter/delay');
        setRunningDelayed(response.data.running_delayed_projects);
      } catch (error) {
        console.error('Error fetching running delayed projects', error);
      }
    };

    const projetChart = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/projects/chartdata');
        setChartData(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCounters();
    fetchRunningDelayed();
    projetChart();
  }, []);

  const options = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Department Wise - Total vs Closed'
    },
    xAxis: {
      categories: chartData.map(d => d.department),
      crosshair: true,
      labels: {
        //rotation: -45, // Rotate labels for better readability
        formatter: function() {
          // Find corresponding success percentage for the current category
          const department = this.value;
          const departmentData = chartData.find(d => d.department === department);
          if (departmentData) {
            return `<span style="font-weight:bold">${departmentData.successPercentage.toFixed(1)}% </span> <br/> <span>${department}</span>`;
          }
          return this.value;
        }
      }
    },
    yAxis: [
      {
        title: {
          text: ''
        },
        min:0,
        tickInterval: 5,
        labels: {
          format: '{value}' // Display format for yAxis labels
        }
      },
      {
        title: {
          text: ''
        },
        opposite: false
      }
    ],
    
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          inside: true,
          style: {
            fontWeight: 'bold'
          }
        }
      }
    },

    series: [
      {
        name: 'Total Projects',
        type: 'column',
        data: chartData.map(data => data.totalProjects),
        tooltip: {
          valueSuffix: ' '
        },
        color: '#7cb5ec' // Blue color for total projects
      },
      {
        name: 'Closed Projects',
        type: 'column',
        data: chartData.map(data => data.closedProjects),
        tooltip: {
          valueSuffix: ' '
        },
        color: '#93c572' // Gray color for closed projects
      },
      // {
      //   name: 'Total/Closed Projects Ratio',
      //   type: 'line',
      //   yAxis: 1,
      //   data: chartData.map(data => (data.totalProjects !== 0 ? data.closedProjects / data.totalProjects : 0)),
      //   tooltip: {
      //     valueSuffix: ' Ratio'
      //   },
      //   color: '#90ed7d' // Green color for ratio line
      // },
      
      {
        name: 'Success Percentage',
        type: 'line',
       
        data: chartData.map(data => data.successPercentage),
        tooltip: {
          valueSuffix: ' %'
        },
       
        color: '#f7a35c', // Orange color for success percentage line
        dashStyle: 'shortdot', // Dotted line style for percentage
        lineWidth: 0, // Make the line invisible
       
      },

      
    ],
    tooltip: {
      shared: true
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      borderWidth: 0
    },
    accessibility: {
      enabled: true // Enable accessibility module
    }
  };

  return (
    <div className="container">
      <div className='row'>
        <div className='col-md-1'>
          <div className="img-proj">
            <img src={Dashboardimg} alt="Dashboardimg" style={{ cursor: 'pointer' }} className="img-proj1" />
            <img src={projectlist} alt="projectlist" className="img-proj1" style={{ cursor: 'pointer' }} onClick={counterNavigate2}/>
            <img src={createprojectactive} alt="createproject" className="img-proj1" style={{ cursor: 'pointer' }} onClick={counterNavigate}/>
            <img src={logout} alt="logout" className="img-proj1" style={{ cursor: 'pointer' }} onClick={handleLogout} />
          </div>
        </div>

        <div className='col-md-11 headerbg'>
        <div className='logoimg1'>
        <h6 className='text-white left-text'>Dashboard</h6>
        <img src={logo} alt="logo" className='center-image my-3' />
      </div>
      <div className='counter_card'>
        <Card className='p-3 count_card_style'>Total Projects<br /> <span className="text-bold">{counters.total_projects}</span></Card>
        <Card className='p-3 count_card_style'>Closed<br /> <span className="text-bold">{counters.closed_projects}</span></Card>
        <Card className='p-3 count_card_style'>Running<br /> <span className="text-bold">{counters.running_projects}</span></Card>
        <Card className='p-3 count_card_style'>Closure Delay<br />  <span className="text-bold">{runningDelayed}</span></Card>
        <Card className='p-3 count_card_style'>Cancelled<br /> <span className="text-bold">{counters.cancelled_projects}</span></Card>
      </div>

      <div class="mt-2">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
        </div>
      </div>
      

    </div>
  );
};

export default Dashboard;
