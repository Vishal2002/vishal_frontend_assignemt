// src/components/BirthdayCalendar.jsx
import React, { useState, useEffect } from 'react';
import { samples } from '../../utils/sample';
import '../index.css'; // Add this import

const BirthdayCalendar = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [birthdayData, setBirthdayData] = useState('');
  const [parsedBirthdays, setParsedBirthdays] = useState([]);
  const [calendarData, setCalendarData] = useState({});

  const colors = ['#545D79', '#8AB721', '#C77D99', '#78CAE3', '#E64A33'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    const sampleDataString = JSON.stringify(samples, null, 2);
    setBirthdayData(sampleDataString);
    parseBirthdays(sampleDataString);
  }, []);

  useEffect(() => {
    if (parsedBirthdays.length > 0) {
      calculateBirthdayCalendar();
    }
  }, [selectedYear, parsedBirthdays]);

  const parseBirthdays = (data) => {
    try {
      const parsed = JSON.parse(data);
      setParsedBirthdays(parsed);
    } catch (error) {
      console.error('Invalid JSON data');
      setParsedBirthdays([]);
    }
  };

  const calculateAge = (birthDate, currentYear) => {
    let birth;
    if (birthDate.includes('/')) {
      birth = new Date(birthDate);
    } else if (birthDate.includes('-')) {
      const [year, month, day] = birthDate.split('-').map(num => parseInt(num));
      birth = new Date(year, month - 1, day);
    }
    
    return currentYear - birth.getFullYear();
  };

  const calculateBirthdayCalendar = () => {
    const calendar = {
      Sunday: [],
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: []
    };

    parsedBirthdays.forEach(person => {
      let month, day, year;
    
      if (person.birthday.includes('/')) {
        [month, day, year] = person.birthday.split('/').map(num => parseInt(num));
      } else if (person.birthday.includes('-')) {
        [year, month, day] = person.birthday.split('-').map(num => parseInt(num));
      }
      
      const birthdayInSelectedYear = new Date(selectedYear, month - 1, day);
      const dayOfWeek = days[birthdayInSelectedYear.getDay()];
      
      const age = calculateAge(person.birthday, selectedYear);
      
      calendar[dayOfWeek].push({
        name: person.name,
        age: age,
        originalBirthday: person.birthday
      });
    });

    Object.keys(calendar).forEach(day => {
      calendar[day].sort((a, b) => a.age - b.age);
    });

    setCalendarData(calendar);
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const handleDataChange = (e) => {
    const data = e.target.value;
    setBirthdayData(data);
    parseBirthdays(data);
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2000; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  const getGridSize = (count) => {
    if (count === 0) return 1;
    if (count === 1) return 1;
    if (count <= 4) return 2;
    if (count <= 9) return 3;
    if (count <= 16) return 4;
    return 5;
  };

  const renderPersonSquare = (person, index, totalCount) => {
    const colorIndex = index % colors.length;
    const gridSize = getGridSize(totalCount);
    const squareSize = `calc(100% / ${gridSize})`;
    
    return (
      <div
        key={`${person.name}-${person.age}`}
        className="person-square"
        style={{
          backgroundColor: colors[colorIndex],
          width: squareSize,
          height: squareSize,
        }}
        title={person.name}
      >
        {person.name.split(' ').map(n => n[0]).join('')}
      </div>
    );
  };

  return (
    <div className="birthday-calendar-container">
      <h1 className="main-title">
        7-Day Birthday Calendar
      </h1>
      
      {/* Controls */}
      <div className="controls-container">
        <div className="data-input-section">
          <label className="input-label">
            Birthday Data (JSON):
          </label>
          <textarea
            value={birthdayData}
            onChange={handleDataChange}
            className="data-textarea"
            placeholder="Enter birthday data in JSON format..."
          />
        </div>
        
        <div className="year-select-section">
          <label className="input-label">
            Select Year:
          </label>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="year-select"
          >
            {generateYearOptions().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Calendar */}
      <div className="calendar-grid">
        {days.map(day => {
          const peopleOnThisDay = calendarData[day] || [];
          const isEmpty = peopleOnThisDay.length === 0;
          
          return (
            <div key={day} className="day-column">
              {/* Day Header */}
              <div className="day-header">
                {day}
              </div>
              
              {/* Day Content */}
              <div 
                className={`day-content ${isEmpty ? 'day-empty' : ''}`}
                title={isEmpty ? '' : peopleOnThisDay.map(p => p.name).join(', ')}
              >
                {isEmpty ? (
                  <div className="empty-message">
                    No birthdays
                  </div>
                ) : (
                  peopleOnThisDay.map((person, index) => 
                    renderPersonSquare(person, index, peopleOnThisDay.length)
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BirthdayCalendar;