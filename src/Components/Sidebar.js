import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CSS/Sidebar.css';

function Sidebar({ isOpen, onDamClick, selectedDam }) {
  const damNames = ['Krishna Raja Sagara Dam', 'Hemavathi Dam', 'Kabini Dam', 'Harangi Dam'];
  const [damData, setDamData] = useState({});

  const apiKey = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY;
  const sheetId = '1x8WkZ5NJk9BgOsQIz1R4jShRC7hd3KcwE-NK9C45RdM';

  useEffect(() => {
    const fetchData = async () => {
      const newDamData = {};

      for (const dam of damNames) {
        try {
          const response = await axios.get(
            `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${dam}?key=${apiKey}`
          );
          const rows = response.data.values;
          const headers = rows[0];
          const storageIndex = headers.indexOf('Storage');
          const resLevelIndex = headers.indexOf('Current_Res_Level');

          if (storageIndex !== -1 && resLevelIndex !== -1) {
            const storageValues = rows.slice(1).map(row => parseFloat(row[storageIndex]));
            const resLevelValues = rows.slice(1).map(row => parseFloat(row[resLevelIndex]));

            const maxStorage = Math.max(...storageValues);
            const maxResLevel = Math.max(...resLevelValues);

            newDamData[dam] = {
              maxStorage,
              maxResLevel
            };
          } else {
            console.warn(`Storage or Current_Res_Level column not found for ${dam}`);
          }
        } catch (error) {
          console.error(`Error fetching data for ${dam}:`, error);
        }
      }

      setDamData(newDamData);
    };

    fetchData();
    // eslint-disable-next-line
  }, [apiKey, sheetId]);

  useEffect(() => {
    if (!selectedDam) {
      onDamClick('Krishna Raja Sagara Dam');
    }
  }, [onDamClick, selectedDam]);

  return (
    <aside className={isOpen ? 'sidebar open' : 'sidebar'}>
      <div className="scroll-container">
        {damNames.map((name, index) => (
          <div 
            key={index} 
            className={`dam-box ${selectedDam === name ? 'selected' : ''}`} 
            onClick={() => onDamClick(name)}
          >
            <h3>{name}</h3>
            {damData[name] && (
              <div className="dam-info">
                <p>Full Capacity: {damData[name].maxStorage}</p>
                <p>Max Level: {damData[name].maxResLevel}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
