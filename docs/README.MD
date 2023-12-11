# Fresh Air Agenda

- Angelina Huang
- Doruk Hacioglu
- Dylan Minton
- Jeongwoo Heo

## Design

- [API design](APITemplates.md)

## What is Fresh Air Agenda?

Fresh Air Agenda is an application that tracks a users time spent outside. Built with the intent to encourage users to be more mindful
of their time spent outdoors, this app allows a user to set a personal goal for how many hours a week they want to spend outside. The application
will then record and display that data so the user can be more motivated to spend some time getting some fresh air.

Additionally the app has some social media elements, with the events feature users can create events that other users in their local area can attend.

## Functionality

- A new user can sign up and create a user profile that has their goal(hrs/week time spent outside).
- A logged in user will have timelogs that track their daily time spent outside, and display that data and notify them if they reached their goal.
- A logged in user can update the amount of time they spent outside on this main page that displays their daily goal.
- A logged in user can see the weather for their local area and also see any events they have chosen to attend.
- A logged in user can go to the metrics page that has more data so they can see how they are progressing within the week or compared to other weeks.
- A logged in user can go to the events page and create an event.
- A logged in user can go to the events page and see a list of events that are being hosted locally.
- A logged in user can also see who is attending each individual event, and can choose to attend themselves.
- A logged in user can go to their profile page and see their user details, as well as edit them.
- A logged in user can go to other users profile pages to get more information on who they are.

## Project Initialization

To start this application on your local machine:

1. Clone the repository down to your local machine
2. CD into the new project directory
3. Run `docker volume create postgres-data`
4. Run `docker compose build`
5. Run `docker compose up`
8. Exit the container's CLI, and enjoy Smelli Belli to its fullest!
