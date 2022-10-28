# Project Name

## Description

IronWorld is an Ironhack-based on social network which allows 
current and old Ironhack students to be connected through
post publications while getting access to resources like job offers and others which are managed by moderators and admins.
 
## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault.
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault.
- **homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup.
- **sign up** - As a user I want to sign up on the webpage so that I can see all the events that I could attend.
- **login** - As a user I want to be able to log in on the webpage so that I can get back to my account.
- **logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account.
- **posts list** - As a user I want to be able to see all
the posts that registered people have done.
- **navigation bar** - As a user I want to see a navigation
bar which contains all the pages I can access to.
- **post create** - As a user I want to be able to create
a publication at any moment.
- **comment create** - As a user I want to be able to create
a comment in a publication ay any moment.
- **post details** - As a user I want to be able to see all the
details and comments. of a particular post in a new page.
- **profile details** - As a user I want to be able to access
my personal profile and edit my register parameters like
username, email or password.
- **search bar** - As a user I want to be able to search any
post at any moment.
- **like-unlike buttons** - As a user I want to be able to 
like or unlike a publication.
- **favourites button** - As a user I want to be able to
add a particular post to my favourites section in my profile page.
- **job offers** - As a user I want to be able to see and access
to different job offers from home page.
- **most liked publications** - As a user I want to know which
publications have been most-liked and access their details page.


## Backlog

List of other features outside of the MVPs scope

- edit my profile username, age, image, email and password
- add likes to publications
- search posts
- delete and edit comments
- edit my own publications
- see most-liked publications
- moderator can edit, approve and delete user publications
- admin can edit, approve and delete user publications
- admin can edit and delete users

## ROUTES:

- GET / 
  - renders the homepage
  - publications (find, approved publications with middleware)
    - publications will have a button for add comment
- GET /auth/signup
  - renders the signup form in a new page
- POST /auth/signup
  - redirects to /
  - body:
    - username
    - email
    - password
{{{- GET /auth/login
  - renders the login form in the home page}}}
- POST /auth/login
  - redirects to / if user logged in
  - body:
    - email
    - password
- POST /auth/logout
  - redirects to / if user logged in


- POST /user/:publicationId/create
  - creates a new publication in the DB (pending for approval)
  - redirects to /


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


- 

## Models

User model
 
```
username: String
password: String
email: String
age: Number
profileImage: String
role: String
links: Array
publications: Array
favourites: Array
```

Publication model

```
title: String
content: String
file: String
user: Object
approved: Boolean
comments: Array
likes: Number
whoLikes: Array
``` 

Comment model

```
message: String
user: Object
edited: Boolean
``` 

Comment model

```
message: String
user: Object
edited: Boolean
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
