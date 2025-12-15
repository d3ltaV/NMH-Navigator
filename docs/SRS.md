# SRS DOCUMENT

**Project: NMH Navigator**

**Sprint Goal:** Deliver an MVP that allows students to discover workjobs, classes, and co-curriculars in one place via a category or map setting. Functions include ratings/reviews, search/filter, interactive class map, and student feedback form.

## Part 1 - Introduction

### 1.1 Purpose

NMH Navigator is a web-based platform designed to help students efficiently navigate and explore available classes and community opportunities.

This system aims to provide users with access to:
- Workjob reviews and rating
- Class reviews and ratings
- View by map or view by category
- Co-curricular and rating
- PE and rating

### 1.2 Scope

**MVP Features:**
- User authentication
  - Only NMH users are allowed to log in and post reviews/information
  - All NMH users should be prompted to create/sign in with an account
- Interactive map view:
  - Clickable locations, with each location opening a list of workjobs, classes, and PE/Co-Curriculars in that location.
  - Clicking on a workjob, class, PE, or co-curricular activity brings the user to that activity's page.
- Workjob catalog list view:
  - Page with all workjobs listed and different sorting functions (blocks/hours, days, locations, etc.)
- Workjob, Class, and PE/Co-Curricular page:
  - Workjob description, advisor, sports available, location, "assigned/selected," and workjob reviews and ratings (catalog + student feedback)
  - Class description, department, location, and ratings
  - PE/Co-Curricular description, advisor, location, season offered, and ratings
  - Option to return to home page, map, or list view
- Toggle view for workjob, class, and PE/Co-Curriculars
- Class catalog list view:
  - Class description
  - Reviews and rating (catalog + student feedback)
- PE/Co-curriculars review and rating (catalog + student feedback)

**Nice-to-Have Features:**
- Dining module with ratings
- Moderation and community guidelines
- Dashboard for managing content

### 1.3 Intended Users

- **Primary Users:**
  - NMH Students
  - Advisors of NMH students
- **Secondary Users:**
  - NMH Faculty
  - NMH Parents/Guardians

## Part 2 - Overall Description

### 2.1 User Characteristics

- **Primary users: Students**
  - Students who want a quick place to refer to NMH campus information so they can choose their workjobs, classes, and PE/cocurriculars to fit graduation requirements
  - Students want an easy website to use and refer to information without having to do extensive research themselves.
- **Secondary users: Advisors**
  - Advisors can use this website to help direct advisees to the right information and help them formulate their academic and extracurricular plans.
- **Admin/Moderators: Students who are creating this project**
  - Grace, Joelle, Lorcan, Angelina, Siddiqi, and Loli—part of the Sprint Planning Team—will be in charge of handling student input on the website to ensure all content published is appropriate.

### 2.2 General Constraints

- User data (emails, passwords) must be stored securely
- The system should comply with NMH data privacy expectations.
- The website should function on modern browsers and standard devices used across NMH.

### 2.3 Assumptions and Dependencies

- Users have internet access and can support modern browsers
- The data needed is accessible and authorized for display by NMH
- Have some tangible data on usage

### 2.4 System Environment

- Web-based, compatible with any electronic device that can connect to the internet
- Can run on an NMH Server

## Part 3 - Specific Requirements

### 3.1 MVP User Stories

#### Feature 1: Interactive Map

**User story 1:** As an NMH student, I want to easily access information about different locations on campus, including what classes and workjobs are offered there, so I can learn more about my academic and work opportunities.

**Acceptance criteria:**
- Beautiful map that shows dot for each location that has class/workjob
- Clicking a dot opens a new panel
- The map pans and zooms smoothly

#### Feature 2: Rating system

**User story 2:** As a current or incoming NMH student, I want to be able to view and/or give ratings for various NMH offerings, so that I can know what classes to take, which workjobs to sign up for, what classes to take, and the most suitable PE/Co-Curricular options.

**Acceptance criteria:**
- Users can easily see feedback and ratings for each component
- Logged-in users can easily give feedback for classes/food /workjob
- Multiple methods of rating are supported, such as free response, 0–5 scale, and scatter plot.

#### Feature 3: Workjob Catalog

**User story 3:** As an upper-class student who can pick their workjob, I want to see all the available options on campus so that I can find one that best suits my interests and schedule.

**Acceptance criteria:**
- Work job list with key fields: title, description, hours/terms, location, supervisors, contact, prereq/skills, ratings/reviews
- Workjob lists include all workjobs on campus
- Hyperlinks to email contact information

#### Feature 4: Class Catalog

**User story 4:** As an overstimulated student who struggles selecting the right classes, I want a class list with its credits associated (via department), difficulty, location, and ratings/reviews.

**Acceptance criteria:**
- Class list with department, level, prereqs, typical instructors (if NMH allows), and rating
- Filters: department, level, location

#### Feature 5: Co-Curricular/PE/Sports Credit Module

**User story 5:** As a student with multiple areas of interest, I want to explore all the Co-Curricular, PE, and sports offerings NMH has so that I can best plan out my schedule.

**Acceptance criteria:**
- Co-Curricular list with name, category (arts, academics, sports, etc.), meeting times, available terms, advisor, and description
- Students can both leave and view ratings/reviews about their experience
- Filters: category, time (blocks offered)
- Integration into the location map and toggle view

#### Feature 6: Search, Filters, and Sorting

**User story 6:** As a student, I want to filter what I am searching for so I can gain access to the information I want to see quickly.

**Acceptance criteria:**
- Global search across classes, workjobs, dining, and help
- Sort by location, data type (class, workjob, PE, etc.)
- Clear visual toggle to switch between list and map views

### 3.2 Nice-to-Have User Stories

#### Feature 7: Moderation and Community Guidelines

**User story 7:** As a student, I want to know that reviews and comments on NMH Navigator follow community guidelines so that I can trust the information and feel comfortable participating.

**Acceptance criteria:**
- All reviews and comments are reviewed by moderators before being displayed publicly.
- Inappropriate or offensive content is automatically filtered or flagged.
- There is a visible "Report" button on each review for users to flag issues.
- Students receive a message confirming their review has been submitted for approval.

#### Feature 8: Dining Module

**User story 8:** As a student, I want to view and rate different dining options on campus so I can see which meals or dining halls are most liked by other students.

**Acceptance criteria:**
- Dining page with a list of available food locations (Dining Hall, Snack Bar, etc.)
- Students can leave ratings and reviews for specific meals or locations
- Filters by meal type (breakfast/lunch/dinner) and day
- Integration with the main search bar and map (dining locations shown on map)

#### Feature 9: Feedback Form

**User story 9:** As a student, I want to provide feedback about bugs, ideas, or new features so that the development team can improve NMH Navigator.

**Acceptance criteria:**
- Accessible feedback form linked from the home and footer
- Anonymous submission option
- Submissions are stored in the admin dashboard or sent to the team email
- Categories for feedback (bug, suggestion, report)
- Confirmation message after submission

### 3.2 Functional Requirements

1. **Authentication System:**
   - Users can sign up, log in, and manage profiles securely
   - Login required for posting reviews and feedback

2. **Database Integration:**
   - Stores data for classes, workjobs, co-curriculars, users, reviews, and ratings.
   - Supports queries for filtering and sorting.

3. **Interactive Map:**
   - Displays clickable pins for campus locations
   - Integrates with listings (clicking a pin must load associated data)

4. **Rating and Review System:**
   - Users can rate on a 0–5 scale NMH offerings (class, workjobs, etc) and leave comments
   - Ratings are averaged and displayed visually

5. **Catalog views**
   - Separate pages for Workjobs, Classes, Co-Curriculars
   - Search and filter functions per page

6. **Feedback form system**
   - Stores form submissions in the backend for review by the admin team

### 3.3 Non-Functional Requirements

1. **Performance:**
   - Page load time should be under 2 seconds for most pages
   - Smooth transitions and map zoom/pan animations

2. **Usability:**
   - Simple, intuitive UI with consistent design.
   - Accessibility-friendly (contrast, alt text, keyboard navigation)

3. **Security:**
   - All user data is encrypted (SSL, hashed passwords)
   - Review submissions sanitized to prevent XSS/SQL injection.

4. **Scalability:**
   - The system can handle at least 500 concurrent users.
   - Easy to add future modules (Dining, Dorms, etc.)

5. **Maintainability:**
   - Code is modular and documented
   - Admins can easily add or update entries without developer support

6. **Reliability & Availability:**
   - 99% uptime goal

## Part 4 - Appendices

### 4.1 UI Wireframe and Design

- Homepage and Landing Page
- Interactive Campus Map (Touch Screen)
- Catalog List Pages
- Detailed Information about Individual Items

### 4.2 Database Arrangement

- Users
- Workjobs
- Classes
- Co-Curriculars, PE and Sports Requirement
- Locations

### 4.4 Reference Documents

- NMH Course Curriculum Guide
- NMH Workjob Listings
- NMH Available Sports 25-26
- NMH PE and Co-Curricular Equivalents

### 4.5 Technology Tools

- Frontend: HTML, CSS, JS
- Backend: Flask,
- Databases: CSV
- Mapping: Maps JavaScript API
- Version Control, Unity, and Communication: Git

## Part 5 - UML Behavior Diagrams

### 5.1 Use Case Diagram

[Included in directory]

### 5.2 Class Diagram

[Included in directory]

## Part 6 - Testing Parameters

**The Following Will Be Tested Throughout the Duration of The Project to Ensure Functionality:**

- Transitions (how effectively things move from section to section)
- Feedback on Usability
- Security and Privacy
- Performance
