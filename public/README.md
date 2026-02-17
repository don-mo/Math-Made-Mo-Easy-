# Moswimming Employee Training Tracker

A comprehensive web-based training management system for tracking swim instructors' video completion and quiz performance.

## Features

### 📊 Dashboard
- Real-time statistics overview
- Total employees count
- Weekly video completions tracking
- Quiz performance metrics
- Activity log of all system events

### 👥 Employee Management
- Add and remove employees
- Track individual employee progress
- View video completion and quiz statistics per employee
- Employee email management

### 🎥 Video Tracking
- Track 4 swimming stroke videos:
  - Freestyle: https://www.youtube.com/watch?v=44Z903gdVqI
  - Backstroke: https://www.youtube.com/watch?v=feDQPi7hz1U
  - Breaststroke: https://www.youtube.com/watch?v=S3Ja0mHZDSg
  - Butterfly: https://www.youtube.com/watch?v=9gs2_YEUkaM
- Week-by-week tracking with calendar navigation
- Checkbox system for marking video completion
- Direct links to training videos

### 📝 Quiz System
- Interactive quiz interface
- 8 default questions covering all swimming strokes
- Add custom questions with 4 multiple-choice options
- Progress tracking during quiz
- Instant feedback on correct/incorrect answers
- Score calculation and history
- Category-based questions (freestyle, backstroke, breaststroke, butterfly, general)

### 📈 Reports
- Generate comprehensive training reports
- Filter by employee or view all employees
- Time period filtering (week, month, all time)
- Displays:
  - Videos completed this week
  - Total quizzes taken
  - Average quiz scores
  - Last quiz completion date

## Installation & Setup

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server or Node.js required for basic usage

### Quick Start

1. **Download all files:**
   - index.html
   - styles.css
   - script.js

2. **Open the application:**
   - Double-click `index.html` or
   - Right-click → Open with → Your browser

3. **Start using:**
   - The app uses browser localStorage to save all data
   - No database setup required
   - Data persists between sessions

## Usage Guide

### Adding Employees
1. Go to the "Employees" tab
2. Click "+ Add Employee"
3. Enter name and email
4. Click "Add Employee"

### Tracking Video Completion
1. Go to the "Videos" tab
2. Use week navigation buttons to select the week
3. Check the box next to each employee's name when they complete a video
4. Data is automatically saved

### Creating Quizzes
1. Go to the "Quiz" tab
2. Scroll to "Quiz Questions" section
3. Click "+ Add Question"
4. Enter question text
5. Enter 4 options (Option 1 is automatically the correct answer)
6. Select a category
7. Click "Add Question"

### Taking a Quiz
1. Go to the "Quiz" tab
2. Select an employee from the dropdown
3. Click "Start Quiz"
4. Answer each question by clicking an option
5. Click "Submit Answer"
6. View results after completion

### Generating Reports
1. Go to the "Reports" tab
2. Select an employee (or "All Employees")
3. Choose time period
4. Click "Generate Report"

## Data Storage

All data is stored locally in your browser using localStorage:
- Employee information
- Video completion tracking by week
- Quiz questions and results
- Activity logs

**Important Notes:**
- Data is stored per browser/device
- Clearing browser data will delete all records
- For production use, consider implementing a backend database
- Export/backup functionality can be added if needed

## Default Quiz Questions

The system includes 8 pre-loaded questions covering:
- Freestyle technique (2 questions)
- Backstroke technique (2 questions)
- Breaststroke technique (3 questions)
- Butterfly technique (1 question)

## Customization

### Adding More Videos
Edit the `videos` array in `script.js`:
```javascript
const videos = ['freestyle', 'backstroke', 'breaststroke', 'butterfly', 'newStroke'];
```

Then add corresponding HTML in `index.html` Videos tab.

### Styling
Modify `styles.css` to change colors, fonts, and layout:
- Primary color: #2193b0
- Gradient: #667eea to #764ba2
- Card styling and animations included

### Adding Features
The codebase is modular and easy to extend:
- `loadData()` and `saveData()` handle persistence
- `addActivity()` logs all events
- Each section has dedicated render functions

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## Security Notes

- This is a client-side only application
- No authentication system included
- Suitable for internal use on trusted devices
- For multi-user environments, implement proper backend with authentication

## Future Enhancements

Potential improvements:
- Backend database integration
- User authentication
- Email notifications
- Export to Excel/PDF
- Mobile app version
- Video embedding
- Advanced analytics

## Support

For issues or questions:
1. Check browser console for errors (F12)
2. Verify localStorage is enabled
3. Try clearing browser cache
4. Use a different browser

## License

Copyright Moswimming - Internal use only
Do not share training materials online

---

Built for Moswimming swim instruction program based on Gold's Gym training materials.
