# Requirements

## Functional user requirements

- **Ask for a definition**: The user must be able to ask the application for a specific term and get
  its definition and available acronyms.
  
  - **Terms**: The user may provide a term. This term may contain some typos, or can be written by
  different ways.
  - **Acronyms**: The user can ask for acronyms and the system should return all the available
  definitions for that acronym.
  
- **Create/Update a definition**: The user must be able to create or update a definition for a
  certain term. This definition may contain acronyms, photos and may belong to some categories.
  
  - **Validation**: The definitions provided by the users must be somehow validated to ensure a
  minimum of quality for the data. This validation might be automatic, manual or collaborative.
  
  - **Versioning**: The system must be able to provide all the definitions that have existed for a
  certain term through the history.

- **Sort and classify definitions**: The terms may belong to categories, and can be sorted by
  popularity, date and other terms. Some IA's might be useful for this.

## System requirements

- **Database**: The system needs a database so it can store all the definitions, acronyms and
  categories. We also need to be able to store the training of the IA's.
  
- **RESTful server**: The system needs to expose a RESTful API so all the clients can interact with
  the system through some endpoints.
  
- **Automatic classifier**: The system needs some kind of classifier to offer some suggestions to
  the user.
  
- **Web user interface**: The system needs a web user interface with full functionality so the user
  can interact with the system.
  
- **Telegram bot**: A telegram bot is available for the users to interact with the system.

- **Data extraction process**: The system must have a process that can extract data, process it and
  update it into the system. This process can be automatic or manual.
  
- **User management**: The system must have some kind of user management so users can be identified
  when creating, editing and verifying terms and definitions.

## Non-functional requirements

...
