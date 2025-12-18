# Admin Panel Enhancement Tasks

## Backend API Enhancements

1. Sliding Banner (Gallery)
   - Add update (PUT/PATCH) API endpoint for gallery images.
2. Faculties
   - Add CRUD endpoints for faculties collection.
3. Affiliations
   - Add CRUD endpoints for foreign and professional affiliations.
4. Editable Numbers & About Page Data
   - Add endpoints to manage editable numbers (students enrolled, courses available, etc).
5. Campuses
   - Add CRUD endpoints for campuses.
6. News and Events
   - Add CRUD endpoints for news and events.
7. Courses
   - Extend programmes.js with full CRUD endpoints for programmes and course details.
8. Testimonials
   - Add CRUD endpoints for testimonials.

## Frontend Admin Pages

1. Sliding Banner
   - Enhance AdminGallery.js to support editing images and captions.
2. Faculties
   - Create/manage faculties admin page for add/update/delete.
3. Affiliations
   - Create admin pages for managing foreign and professional affiliations.
4. Editable Numbers
   - Create admin page to manage editable numbers linked with About page.
5. Campuses
   - Create admin page for managing campuses.
6. News and Events
   - Create admin page for managing news and events.
7. Courses
   - Extend ManageCourses.js for full CRUD on courses and detailed pages with templates.
8. Testimonials
   - Create admin page to manage testimonials with templates.

## Frontend Public Pages Updates

1. Faculties page
   - Make faculties page fetch dynamic data from backend.
2. Affiliations and About page
   - Fetch and display editable numbers and affiliations dynamically.
3. Campuses page
   - Fetch campuses data dynamically.
4. Sliding Banner
   - Already dynamic, just ensure full CRUD integration.
5. Courses pages
   - Make course listings and detail pages dynamic with editing support.
6. News and Events pages
   - Make news/events pages dynamic.
7. Testimonials section
   - Display testimonials dynamically.

---

# Follow-up Steps
- Implement backend API updates incrementally.
- Build or extend frontend admin pages for each section.
- Modify corresponding frontend public pages for dynamic content.
- Test CRUD operations end-to-end.
- Ensure linked data updates (e.g. editable numbers reflected on About page).
