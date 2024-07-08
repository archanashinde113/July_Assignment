import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CSS/style.css';
import { useNavigate } from 'react-router-dom';
import Dashboard from './image/Dashboard.svg';
import projectlist from './image/Project-list-active.svg';
import createproject from './image/create-project.svg';
import logo from './image/Logo.svg';
import Card from '@mui/material/Card';
import logout from './image/Logout.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


const ProjectList = () => {
  const navigate = useNavigate(); // useNavigate should be declared at the top level

  const createprojectclick = () => {
    navigate('/dashboard');
  };
  const projectcounterclick = () => {
    navigate('/projectcounter');
  };

  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/projects');
        setProjects(response.data);
      } catch (err) {
        setError('Failed to fetch projects');
        console.error(err);
      }
    };

    fetchProjects();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    navigate('/'); // Redirect to login page
  };

  const handleStartClick = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/projects/status`, { id, status: 'Running' });
      const updatedProject = response.data;

      setProjects(prevProjects =>
        prevProjects.map(project =>
          project._id === updatedProject._id ? updatedProject : project
        )
      );
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  const closeClick = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/projects/status`, { id, status: 'Close' });
      const updatedProject = response.data;
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project._id === updatedProject._id ? updatedProject : project
        )
      );
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/projects/status`, { id, status: 'Cancel' });
      const updatedProject = response.data;
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project._id === updatedProject._id ? updatedProject : project
        )
      );
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortColumn(event.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredProjects = projects.filter(project =>
    Object.values(project).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedProjects = filteredProjects.sort((a, b) => {
    if (sortColumn) {
      if (a[sortColumn] < b[sortColumn]) return -1;
      if (a[sortColumn] > b[sortColumn]) return 1;
    }
    return 0;
  });

  const paginatedProjects = sortedProjects.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  const totalPages = Math.ceil(filteredProjects.length / recordsPerPage);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (

    <div className="container">
      <div className='row'>
        <div className='col-md-1'>
          <div className="img-proj">
            <img src={Dashboard} alt="Dashboard" className="img-proj1" style={{ cursor: 'pointer' }} onClick={projectcounterclick} />
            <img src={projectlist} alt="projectlist" className="img-proj1" style={{ cursor: 'pointer' }} />
            <img src={createproject} alt="createproject" className="img-proj1" style={{ cursor: 'pointer' }} onClick={createprojectclick} />
            <img src={logout} alt="logout" className="img-proj1" style={{ cursor: 'pointer' }} onClick={handleLogout} />
          </div>
        </div>
        <div className='col-md-11 headerbg'>
          <div className='logoimg1'>
            <h6 className='text-white left-text'>Project Listing</h6>
            <img src={logo} alt="logo" className='center-image my-3' />
          </div>
          <Card className='dashbg'>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className='d-flex justify-content-between align-items-center mb-3'>
              <div className="search-container">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
              </div>
              <div className="sort-by-container">
                <label htmlFor="sort-by" className="visually-hidden">Sort By:</label>
                <select id="sort-by" className="form-select" onChange={handleSortChange}>
                  <option value="">Sort By</option>
                  <option value="projectName">Project Name</option>
                  <option value="projectType">Project Type</option>
                  <option value="projectManager">Project Manager</option>
                  <option value="startDate">Start Date</option>
                  <option value="endDate">End Date</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
            <div className="project-list_mobile">
              {paginatedProjects.map((project) => (
                <div key={project._id} className="project-row">
                  <div className="project-info">
                    <div className="project-name"><strong>Project Name:</strong> {project.projectName} <br></br>
                      {new Date(project.startDate).toLocaleDateString()} to &nbsp;
                      {new Date(project.endDate).toLocaleDateString()}
                    </div>
                    <div className="project-status"><strong>Status:</strong> {project.status}</div>
                  </div>
                  <div><strong>Reason:</strong> {project.Reason}</div>
                  <div><strong>Type:</strong> {project.Type}</div>
                  <div><strong>Division:</strong> {project.Division}</div>
                  <div><strong>Category:</strong> {project.Category}</div>
                  <div><strong>Priority:</strong> {project.Priority}</div>
                  <div><strong>Department:</strong> {project.Department}</div>
                  <div><strong>Location:</strong> {project.Location}</div>
                  <div>
                    {project.Status !== 'Running' && (
                      <button className="btn btn-primary btn-sm my-1 custom-btn" onClick={() => handleStartClick(project._id)}>Start</button>
                    )}
                    {project.Status !== 'Close' && (
                      <button className="btn btnc btn-sm my-1 custom-btn" onClick={() => closeClick(project._id)}>Close</button>
                    )}
                    {project.Status !== 'Cancel' && (
                      <button className="btn btnc btn-sm my-1 custom-btn" onClick={() => handleDelete(project._id)}>Cancel</button>
                    )}
                  </div>
                  <hr />
                </div>
              ))}
            </div>

            <table className="table table-bordered desktop_table mt-4">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Reason</th>
                  <th>Type</th>
                  <th>Division</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Department</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProjects.map((project) => (
                  <tr key={project._id}>
                    <td>{project.projectName}
                      <br />
                      {new Date(project.startDate).toLocaleDateString()} to &nbsp;
                      {new Date(project.endDate).toLocaleDateString()}
                    </td>
                    <td>{project.Reason}</td>
                    <td>{project.Type}</td>
                    <td>{project.Division}</td>
                    <td>{project.Category}</td>
                    <td>{project.Priority}</td>
                    <td>{project.Department}</td>
                    <td>{project.Location}</td>
                    <td>{project.status}</td>
                    <td>
                      {project.Status !== 'Running' && (
                        <button className="btn btn-primary btn-sm my-1 custom-btn" onClick={() => handleStartClick(project._id)}> Start</button>
                      )} &nbsp;
                      {project.Status !== 'Close' && (<button className="btn btnc btn-sm my-1 custom-btn" onClick={() => closeClick(project._id)}>Close</button>)}
                      &nbsp;
                      {project.Status !== 'Cancel' && (<button className="btn btnc btn-sm my-1 custom-btn" onClick={() => handleDelete(project._id)}>Cancel</button>)}

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &laquo; Prev
              </button>

              {Array.from({ length: totalPages }, (_, index) => {
                if (
                  index < 4 || // Display first 4 page numbers
                  (index === totalPages - 1) // Display the last page number
                ) {
                  return (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={currentPage === index + 1 ? 'active' : ''}
                    >
                      {index + 1}
                    </button>
                  );
                }
                return null;
              })}

              {totalPages > 5 && currentPage < totalPages - 4 && (
                <>
                  <span>...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className={currentPage === totalPages ? 'active' : ''}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next &raquo;
              </button>
            </div>




          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
