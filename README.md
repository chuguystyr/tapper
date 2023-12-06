# Tapper – the social media app

## Purpose
Tapper app was developed as a social network web app for mobile devices during the EPAM IT Marathon 3.0 to get a more hands-on experience with learned concepts.
## Functionality
This app implements the very basics of functionality as it was proposed by examples shown at BA and UI/UX workshops, namely:
<br/>
1. New users can sign up providing some information about them including avatar (optionally)
2. Users can log in into app with their credentials. Authorization implemented with JWT.
3. Both authorized and unathorized users can see users list and search by user's name.
4. Authorized users can chat with each other (no group chats implemented).
5. List of chats is searchable.

## Used technologies (Project's stack)
React, Next.js 14 (with app router), MongoDB Atlas, Tailwind CSS, JWT.

## Main problems
* Authentication status is stored in React Context (not the best option possible, because of losses on manual page reload).
* Messaging wasn't implemented with use of WebSockets and therefore isn't instant.