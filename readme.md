# Project Name

## Description

Describe your project in one/two lines.
 
## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault 
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup
- **sign up** - As a user I want to sign up on the webpage so that I can see all the events that I could attend
- **login** - As a user I want to be able to log in on the webpage so that I can get back to my account
- **logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
- **events list** - As a user I want to see all the events available so that I can choose which ones I want to attend
- **events create** - As a user I want to create an event so that I can invite others to attend
- **events detail** - As a user I want to see the event details and attendee list of one event so that I can decide if I want to attend 
- **event attend** - As a user I want to be able to attend to event so that the organizers can count me in

## Backlog

List of other features outside of the MVPs scope

User profile:
- see my profile
- upload my profile picture
- see other users profile
- list of events created by the user
- list events the user is attending

Geo Location:
- add geolocation to events when creating
- show event in a map in event detail page
- show all events in a map in the event list page

Homepage
- ...


## ROUTES:

- GET / 
  - renders the homepage
  - publications (find)
- GET /auth/signup
  - renders the signup form in a new page
- POST /auth/signup
  - redirects to /
  - body:
    - username
    - email
    - password
- GET /auth/login
  - renders the login form in the home page
- POST /auth/login
  - redirects to / if user logged in
  - body:
    - email
    - password
- POST /auth/logout
  - redirects to / if user logged in


- GET /profile
 - renders the profile in a new page
    - profileImage
    - username
    - email
    - user publications (from Publications)
    - edit profile button
    - add personal links button
- GET /profile/edit
  - renders the profile edit page
- POST /profile/edit
  - profileImage
  - email
  - old password
  - new password
  - redirect to /profile
- GET /profile/links
  - renders profile links addition form
- POST /profile/links
  - creates new link
  - redirect to /profile


- GET /admin/users
  - renders user list for the admin
- GET /admin/users/:userId/edit
  - renders user details page
  - edit user button
  - delete user button
- POST /admin/users/:userId/edit
  - edits the user
  - username
  - email
  - password
  - profileImage
  - role
  - redirects to the user list
- POST /admin/users/:userId/delete
  - deletes the user
  - redirects to the user list
- GET /admin/publications
  - renders publications list for the admin
- GET /admin/publications/:publicationId/details
  - renders publication details
- GET /admin/publications/:publicationId/edit
  - renders publication edit form
- POST /admin/publications/:publicationId/edit
  - edits the publication
  - title
  - content
  - file
  - redirects to the publications list
- POST /admin/publications/:publicationId/delete
  - deletes the publication
  - redirects to the publications list
- POST /admin/publications/:publicationId/approval
  - add a publication to the list
  - redirects to the publication list****



- GET /events
  - renders the event list + the create form
- POST /events/create 
  - redirects to / if user is anonymous
  - body: 
    - name
    - date
    - location
    - description
- GET /events/:id
  - renders the event detail page
  - includes the list of attendees
  - attend button if user not attending yet
- POST /events/:id/attend 
  - redirects to / if user is anonymous
  - body: (empty - the user is already stored in the session)


## Models

User model
 
```
username: String
password: String
```

Event model

```
owner: ObjectId<User>
name: String
description: String
date: Date
location: String
attendees: [ObjectId<User>]
``` 

## Links

### Trello

[Link to your trello board](https://trello.com) or picture of your physical board

### Git

The url to your repository and to your deployed project

[Repository Link](http://github.com)

[Deploy Link](http://heroku.com)

### Slides

The url to your presentation slides

[Slides Link](http://slides.com)
