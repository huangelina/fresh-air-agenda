## December 11, 2023

This week I worked on:

* Prop Drilling
* API & Frontend URL Replacement
* Timelog Unit Testing
* User Unit Testing

At the beginning of the week I started by refactoring
the React components to use prop drilling and reduce
the number of fetch requests made. During this process
I removed direct references to localhost:8000 or
localhost:3000 for the environment variable for the
React API Host and Public URL respectively.

After all functionality was complete and refactored
I wrote a unit test for the get users' timelogs
endpoint, as well as for the update user data endpoint.

Throughout the week I was troubleshooting the full
stack deployment to ensure our application remained
functionally deployed.

## December 4, 2023

This week I worked on:

* Getting user metrics from db
* Extrapolating user metrics for gathered data
* Displaying user metrics
* CI/CD

Most of the week was spend manipulating user timelogs
to return a usable value. The average for the current
week, the previous week, and a user selected week
were calculated using several functions and displayed
using Chart.js for React.

I volunteered to take on CI/CD following the lecture,
so I started by going through all of my teams code
and linting to make sure we passed the flake8
pipeline. After our code was reformatted I configured
and deployed a database and our API. Later, with some
help from Rosheen I got the backend deployed properly
and deployed the frontend after some debugging.


## November 22, 2023

This week I worked on:

* Getting the create event endpoint working
* Getting the CRUD endpoints for users working\
* Debugging with the team

On Monday the team finished our first endpoints
together with post requests for events and users
and got authentication started. Once we had all
helped get an endpoint working and got it to require
authentication we dispersed the remaining endpoints
and went to work.

I was made responsible for the remaining user endpoints:
getting one user by ID, getting a list of all users,
updating a user by ID, and deleting a user by ID. It
took we some time to get one user by ID, as I was trying
to use the same get user endpoint the authenticator used
which required a username as an input. I ended up making
a new endpoint that got users by ID. The other endpoints
were rather easy and came together in no time.


## November 17, 2023

This week I worked on:

* Planning API endpoints with the team
* Building a create user endpoint
* Planning our SQL tables
* Building all our SQL tables
* Creating our wireframes

The team spent the past two weeks planning and
organizing our application. We built our wireframes
first alongside our MVP and stretch goals.

Following the initial outlining we created our API
templates and build the create user endpoint with
authentication and login/logout capabilities. We
created a create event endpoint, but it doesn't
connect to the database or create data.
