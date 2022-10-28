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

Index routes:
- GET / 
  - renders the homepage

Auth routes:
- GET /auth/signup
  - renders the signup form in a new page
- POST /auth/signup
  - redirects to /
  - body:
    - username
    - email
    - password
- GET /auth/login
  - renders the login form in the home page}}}
- POST /auth/login
  - redirects to / if user logged in
  - body:
    - email
    - password
- GET /auth/logout
  - redirects to / if user logged in

User routes:
- GET "/user/publication/create"
  - renders a form for create a new publication
- POST "/user/publication/create"
  - creates a new publication for a user in the DB
- GET "/user/search-publication"
  - renders searched publications page from "/"
- GET "/user/:publicationId/details"
  - renders publication details page from "/"
- POST "/user/comment/create"
  - creates a new coment for a publication in the DB
- GET "/users/:commentId/edit"
  - renders comment details page to edit comment information
- POST "/users/:commentId/edit"
  - updates comment message and renders it
- POST "/users/:commentId/delete"
  - updates comment message and renders it
- POST "/user/:publicationId/like"
  - adds like to the likes publication counter and adds user to the whoLikes array
- POST "/user/:publicationId/unlike"
  - removes like from the likes publication counter and removes user from the whoLikes array

Profile routes:
- GET /profile
  - renders the profile in a new page
- GET /profile/edit
  - Renders user edit profile page
- POST /profile/edit
  - edit the profile page, and redirect to profile
- GET /profile/editpassword
  - Renders profile password edit page
- POST /profile/editpassword
  - Renders profile password edit page
- GET /profile/edit/email
  - Renders profile email edit page
- POST /profile/edit/email
  - Renders profile email edit page
- GET "/profile/publications/:publicationId/details"
  - renders the details of each own publication
- POST "/profile/publications/:publicationId/delete"
  - deletes the current own publication
- GET "/profile/publications/:publicationId/edit"
  - renders profile own publication to edit
- POST "/profile/publications/:publicationId/edit"
  - renders profile own publication to edit
- POST "/profile/publications/:publicationId/favourite
  - add publication to UserOnline.favourite properties
- POST "/profile/publications/:publicationId/favouritedelete
  - add publication to UserOnline.favourite properties

Admin routes:
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
- POST "/admin/publications/:publicationId/approval"
  - approves current publication to be added to the index page list
- POST "/admin/publications/:publicationId/cancel"
  - cancels current publication to be added to the index page list
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
  - redirects to the publication list

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

### Git

[https://github.com/borjacabello/IronWorld]

[https://ironworld.cyclic.app]

### Slides

[https://docs.google.com/presentation/d/1xxXK4X910YBhBRdxQKJMVCh7iL-HYggtvkBlpT4unqE/edit?usp=sharing]
