



# WebDev2 Projekt#

[TOC]

## Description

Slack-Clone:

- Profile mit Tags/Interests -> 1:n auf Gruppen
- Chatfunktion (Einzel & Gruppen)

NodeJS

Express.js

EJS.js

MongoDB

Soccet.IO

jQuery

Datenbank

CRUD

Chatfunktion





Arten: Nutzer mit selben Tag,Zwischen 2 Nutzern, Gruppenchatsl.                                                                                                                                                                                                                                                                



## Collections 

Profiles:

```json
profile: {
  "name":"string",
  "surname":"string",
  "birthDate": "date",
  "email": "string",
  "status": "string",
  "password": "string",
  "tags": [tag],
  "picture": blob
}
```

Tags:

```json
tag: {
  "name": "string",
  "messages": [messsage]
}
```

Chats:

````json
chat: {
  "profiles": [profile],
  "messages": [message]
}
````

## Custom Objects 

````json
message: {
  "timestamp": "date-time",
  "type": enum:messageType,
  "content": "string" or blob
}
````