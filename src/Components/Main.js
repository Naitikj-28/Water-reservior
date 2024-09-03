import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CSS/Main.css';
import ChartComponent from './Chart';

function Main({ selectedDam, isSidebarOpen, selectedDate }) {
  const [data, setData] = useState(null);
  const [averageRainfall, setAverageRainfall] = useState(null);
  const apiKey = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY;
  const sheetId = '1x8WkZ5NJk9BgOsQIz1R4jShRC7hd3KcwE-NK9C45RdM';

  useEffect(() => {
    if (selectedDam) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${selectedDam}?key=${apiKey}`
          );
          const rows = response.data.values;

          if (rows.length === 0) {
            setData([]);
            return;
          }

          const headers = rows[0];
          const dateIndex = headers.indexOf('Date');
          const cumulativeRainfallInsideIndex = headers.indexOf('Cumulative_Rainfall_Inside');

          if (dateIndex === -1 || cumulativeRainfallInsideIndex === -1) {
            console.error('Date or Cumulative_Rainfall_Inside column not found');
            setData([]);
            return;
          }

          const formatDate = (dateStr) => {
            const [day, month, year] = dateStr.split('-');
            return `${year}-${month}-${day}`;
          };

          const formattedDate = formatDate(selectedDate || '01-01-2011');
          const filteredRow = rows.slice(1).find(row => row[dateIndex] === formattedDate);

          const totalCumulativeRainfallInside = rows.slice(1).reduce((sum, row) => {
            const rainfallInside = parseFloat(row[cumulativeRainfallInsideIndex]);
            return sum + (isNaN(rainfallInside) ? 0 : rainfallInside);
          }, 0);

          const averageRainfall = (totalCumulativeRainfallInside / (rows.length - 1)).toFixed(2);
          setAverageRainfall(averageRainfall);

          if (filteredRow) {
            setData(filteredRow);
          } else {
            setData([]);
          }

        } catch (error) {
          console.error('Error fetching data:', error);
          setData([]);
        }
      };

      fetchData();
    }
  }, [selectedDam, selectedDate, apiKey, sheetId]);

  if (data === null) {
    return <p>Loading...</p>;
  }

  if (data.length === 0) {
    return <p>No data available for the selected date.</p>;
  }

  const currentResLevel = data[3];
  const storage = data[6];
  const cumulativeRainfallInside = data[10];
  const resLevel15D = data[23];
  const resLevel30D = data[24];
  const riskLevelCurrent = data[25];
  const riskLevel15D = data[26];
  const riskLevel30D = data[27];
  const accuracy15D = data[29];
  const accuracy30D = data[30];

  return (
    <div className={`main-container ${isSidebarOpen ? 'with-sidebar' : ''}`} style={{ padding: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ width: '100%' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '1.8rem', textAlign: 'center' }}>{selectedDam}</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
            <div style={{ backgroundColor: '#ede1e1', border: '5px solid #4287f5', flex: '1', padding: '10px', borderRadius: '10px', marginRight: '10px' }}>
              <h3>Cumulative Annual Rainfall in Catchment</h3>
              <div style={{ backgroundColor: 'white', padding: '10px', paddingBottom: '20px', borderRadius: '50px', border: '3px solid #4287f5' }}>
                <br /><strong>{cumulativeRainfallInside ? parseFloat(cumulativeRainfallInside).toFixed(2) : 'N/A'}mm</strong><br />
                <span style={{ fontSize: '12px' }}>Average Annual Rainfall: {averageRainfall ? averageRainfall : 'N/A'}mm</span><br /><br />
              </div>
            </div>
            <div style={{ backgroundColor: '#ede1e1', border: '5px solid #4287f5', flex: '1', padding: '10px', borderRadius: '10px', marginRight: '10px' }}>
              <h4>Current Reservoir Status</h4>
              <span style={{ fontSize: '14px' }}><strong>Water Supply Risk:</strong> {riskLevelCurrent}</span><br /><br />
              <div style={{
                backgroundColor: (() => {
                  switch (riskLevelCurrent) {
                    case 'Low':
                      return '#00b67a';
                    case 'Moderate':
                      return '#e49042';
                    case 'High':
                      return '#ca0813';
                    default:
                      return '#e9eaef';
                  }
                })(), padding: '15px', borderRadius: '5px', border: '3px solid #4287f5'
              }}>
                <strong>Water-Level:</strong> {currentResLevel ? parseFloat(currentResLevel).toFixed(1) : 'N/A'}<span style={{ fontSize: '10px' }}> Height in ft</span><br />
                <strong>Volume:</strong> {storage ? parseFloat(storage).toFixed(2) : 'N/A'} <span style={{ fontSize: '10px' }}>(Volume in TMC)</span><br />
              </div>
            </div>
            <div style={{ backgroundColor: '#ede1e1', border: '5px solid #4287f5', flex: '1', padding: '10px', borderRadius: '10px', marginRight: '10px' }}>
              <h3>15 Days Prediction</h3>
              <span style={{ fontSize: '14px' }}><strong>Water Supply Risk:</strong> {riskLevel15D}</span><br /><br />
              <div style={{
                backgroundColor: (() => {
                  switch (riskLevel15D) {
                    case 'Low':
                      return '#00b67a';
                    case 'Moderate':
                      return '#e49042';
                    case 'High':
                      return '#ca0813';
                    default:
                      return '#e9eaef';
                  }
                })(), padding: '15px', borderRadius: '5px', border: '3px solid #4287f5'
              }}>
                <strong>Water-Level:</strong> {resLevel15D ? parseFloat(resLevel15D).toFixed(1) : 'N/A'}<span style={{ fontSize: '10px' }}> Height in ft</span><br />
                <strong>Accuracy:</strong> {accuracy15D ? parseFloat(accuracy15D).toFixed(2) : 'N/A'}<span style={{ fontSize: '10px' }}>%</span><br />
              </div>
            </div>
            <div style={{ backgroundColor: '#ede1e1', border: '5px solid #4287f5', flex: '1', padding: '10px', borderRadius: '10px' }}>
              <h3>30 Days Prediction</h3>
              <span style={{ fontSize: '14px' }}><strong>Water Supply Risk:</strong> {riskLevel30D}</span><br /><br />
              <div style={{
                backgroundColor: (() => {
                  switch (riskLevel30D) {
                    case 'Low':
                      return '#00b67a';
                    case 'Moderate':
                      return '#e49042';
                    case 'High':
                      return '#ca0813';
                    default:
                      return '#e9eaef';
                  }
                })(), padding: '15px', borderRadius: '5px', border: '3px solid #4287f5'
              }}>
                <strong>Water-Level:</strong> {resLevel30D ? parseFloat(resLevel30D).toFixed(1) : 'N/A'}<span style={{ fontSize: '10px' }}> Height in ft</span><br />
                <strong>Accuracy:</strong> {accuracy30D ? parseFloat(accuracy30D).toFixed(2) : 'N/A'}<span style={{ fontSize: '10px' }}>%</span><br />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChartComponent selectedDate={selectedDate} selectedDam={selectedDam} isSidebarOpen={isSidebarOpen} />
    </div>
  );
}

export default Main;