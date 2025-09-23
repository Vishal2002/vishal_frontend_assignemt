import React, { useState, useEffect } from 'react';
import { samples } from '../../utils/sample';

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

    // Sort each day by age (youngest to oldest)
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold',
          textAlign: 'center',
          border: '1px solid white',
          boxSizing: 'border-box'
        }}
        title={person.name}
      >
        {person.name.split(' ').map(n => n[0]).join('')}
      </div>
    );
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        7-Day Birthday Calendar
      </h1>
      
      {/* Controls */}
      <div style={{ 
        marginBottom: '30px', 
        display: 'flex', 
        gap: '50px', 
        flexWrap: 'wrap',
        alignItems: 'flex-start'
      }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Birthday Data (JSON):
          </label>
          <textarea
            value={birthdayData}
            onChange={handleDataChange}
            style={{
              width: '100%',
              height: '200px',
              padding: '10px',
              border: '2px solid #ddd',
              borderRadius: '5px',
              fontFamily: 'monospace',
              fontSize: '12px',
              resize: 'vertical'
            }}
            placeholder="Enter birthday data in JSON format..."
          />
        </div>
        
        <div style={{ minWidth: '150px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Select Year:
          </label>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            style={{
              padding: '10px',
              border: '2px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
              width: '100%'
            }}
          >
            {generateYearOptions().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Calendar */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: '10px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {days.map(day => {
          const peopleOnThisDay = calendarData[day] || [];
          const isEmpty = peopleOnThisDay.length === 0;
          const gridSize = getGridSize(peopleOnThisDay.length);
          
          return (
            <div key={day} style={{ 
              border: '2px solid #333',
              borderRadius: '10px',
              minHeight: '200px',
              backgroundColor: 'white',
              overflow: 'hidden'
            }}>
              {/* Day Header */}
              <div style={{
                backgroundColor: '#333',
                color: 'white',
                padding: '10px',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {day}
              </div>
              
              {/* Day Content */}
              <div 
                className={isEmpty ? 'day-empty' : ''}
                style={{
                  padding: '10px',
                  height: 'calc(100% - 44px)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignContent: 'flex-start',
                  minHeight: '156px'
                }}
                title={isEmpty ? '' : peopleOnThisDay.map(p => p.name).join(', ')}
              >
                {isEmpty ? (
                  <div style={{ 
                    width: '100%', 
                    textAlign: 'center', 
                    color: '#999',
                    fontSize: '14px',
                    marginTop: '50px'
                  }}>
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