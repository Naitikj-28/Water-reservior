import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './CSS/ChartComponent.css'; // Import the CSS file
import MapData from './Map';

const ChartComponent = ({ selectedDate, selectedDam, isSidebarOpen }) => {
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const spreadsheetId = '1x8WkZ5NJk9BgOsQIz1R4jShRC7hd3KcwE-NK9C45RdM';
            const sheetName = selectedDam; // Use the selected dam from props
            const apiKey = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY;

            try {
                const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`;
                const response = await axios.get(url);

                if (response.data && response.data.values) {
                    const rows = response.data.values;
                    console.log('Rows fetched from the sheet:', rows);

                    const labels = [];
                    const currentResLevel = [];
                    const dayWisePrediction = [];

                    const selectedMonth = selectedDate.slice(0, 7);
                    console.log('Selected month:', selectedMonth);

                    rows.slice(1).forEach(row => {
                        const date = row[2];
                        console.log('Date in row:', date);

                        const [day, month, year] = date.split('-');
                        const formattedDate = `${year}-${month}`;

                        if (date && formattedDate === selectedMonth) {
                            labels.push(date);
                            currentResLevel.push(parseFloat(row[3]) || 0);
                            dayWisePrediction.push(parseFloat(row[28]) || 0);
                        }
                    });

                    if (labels.length === 0) {
                        throw new Error('No data found for the selected month');
                    }

                    setChartData({
                        labels: labels,
                        datasets: [
                            {
                                label: 'Current Res Level',
                                data: currentResLevel,
                                borderColor: 'rgba(75,192,192,1)',
                                fill: true,
                            },
                            {
                                label: 'Day Wise Prediction',
                                data: dayWisePrediction,
                                borderColor: 'rgba(153,102,255,1)',
                                fill: true,
                            },
                        ],
                    });

                    setLoading(false);
                } else {
                    throw new Error('No data found in the sheet');
                }
            } catch (error) {
                console.error('Error fetching data: ', error);
                setError(error.message);
                setLoading(false);
            }
        };

        if (selectedDam) {
            fetchData();
        }
    }, [selectedDate, selectedDam]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={`chart-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <div className="chart-wrapper">
                <Line
                    data={chartData}
                    options={{
                        scales: {
                            x: {
                                grid: {
                                    display: false, // Hide vertical lines
                                },
                            },
                            y: {
                                grid: {
                                    display: true, // Show horizontal lines
                                },
                            },
                        },
                    }}
                    className="chart"
                />
            </div>
            <div className="map-container">
                <MapData selectedDam={selectedDam} />
            </div>
        </div>
    );
};

export default ChartComponent;
